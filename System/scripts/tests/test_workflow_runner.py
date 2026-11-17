from pathlib import Path
import contextlib
import datetime as dt
import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPTS=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('workflow',SCRIPTS/'run-workflow.py')
runner=importlib.util.module_from_spec(spec); spec.loader.exec_module(runner)
calendar_spec=importlib.util.spec_from_file_location('calendars',SCRIPTS/'read-calendar.py')
calendar=importlib.util.module_from_spec(calendar_spec); calendar_spec.loader.exec_module(calendar)

class Workflows(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)/'A vault & notes'
        (self.root/'System').mkdir(parents=True)
        (self.root/'03-resources').mkdir()
        (self.root/'03-resources/vault-log.md').write_text('# Existing activity\n')
        self.adapter=self.root/'adapter.py'
        self.adapter.write_text('import sys,json\nprompt=sys.stdin.read()\nprint("---\\ncreated: 2026-11-17\\ntags: [test]\\nsources: []\\n---\\n# Verified fixture report\\n\\nFixture body.\\n"+json.dumps(sys.argv[1:]))\n')
        self.config={'command':[sys.executable,str(self.adapter)],'timezone':'America/Los_Angeles'}
        self.save()
    def save(self): (self.root/'System/assistant.local.json').write_text(json.dumps(self.config))
    def run_job(self,job='nightly-lint',extra=()):
        with patch.dict(os.environ,{'PARA_ASSISTANT_COMMAND':''}),contextlib.redirect_stdout(io.StringIO()),contextlib.redirect_stderr(io.StringIO()):
            return runner.main([job,'--vault',str(self.root),*extra])
    def report(self,job='nightly-lint'):
        today=dt.datetime.now(runner.ZoneInfo('America/Los_Angeles')).date()
        return runner.destination(self.root,job,today)
    def test_all_three_jobs_keep_existing_destination_shapes(self):
        for job in runner.JOBS:
            self.assertEqual(self.run_job(job),0)
            self.assertIn('Verified fixture',self.report(job).read_text())
        self.assertEqual(self.report('weekly-synthesis').parent,self.root/'03-resources/compound/weekly')
    def test_dry_run_has_no_process_or_filesystem_side_effects(self):
        self.config['calendar_names']=['Work']; self.save()
        before=sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*'))
        with patch.object(runner.subprocess,'run') as run:
            self.assertEqual(self.run_job('morning-brief',['--dry-run']),0)
            run.assert_not_called()
        self.assertEqual(before,sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*')))
    def test_no_implicit_provider_when_configuration_is_absent(self):
        self.config={};self.save()
        with patch.object(runner.subprocess,'run') as run:
            self.assertEqual(self.run_job(),1);run.assert_not_called()
        self.assertFalse(self.report().exists())
    def test_job_command_override_and_argument_boundaries(self):
        self.config['command']=['unavailable-command']
        self.config['jobs']={'nightly-lint':{'command':[sys.executable,str(self.adapter),'argument with spaces; $(literal)']}}
        self.save();self.assertEqual(self.run_job(),0)
        self.assertIn(json.dumps(['argument with spaces; $(literal)']),self.report().read_text())
    def test_existing_report_is_never_overwritten_or_reinvoked(self):
        self.assertEqual(self.run_job(),0);self.report().write_text('preserve this exact report')
        with patch.object(runner.subprocess,'run') as run:
            self.assertEqual(self.run_job(),0);run.assert_not_called()
        self.assertEqual(self.report().read_text(),'preserve this exact report')
    def test_nonzero_exit_without_output_can_retry_safely(self):
        self.adapter.write_text('raise SystemExit(7)\n')
        self.assertEqual(self.run_job(),1)
        self.assertFalse((self.root/'System/logs/nightly-lint.pending.json').exists())
    def test_saved_report_with_failed_activity_requires_inspection_before_retry(self):
        with patch.object(runner,'append_activity',side_effect=OSError('activity unavailable')):
            self.assertEqual(self.run_job(),1)
        with patch.object(runner.subprocess,'run') as run:
            self.assertEqual(self.run_job(),1);run.assert_not_called()
        self.assertTrue(self.report().is_file())
    def test_exit_zero_without_report_is_failure(self):
        self.adapter.write_text('print("done")\n');self.assertEqual(self.run_job(),1)
    def test_report_missing_source_metadata_is_not_published(self):
        self.adapter.write_text('print("---\\ncreated: 2026-11-17\\ntags: []\\n---\\n# Incomplete\\nBody")\n')
        self.assertEqual(self.run_job(),1);self.assertFalse(self.report().exists())
    def test_each_job_selects_its_para_recipe_and_report_only_scope(self):
        recipes={'morning-brief':'System/skills/morning-brief.md',
                 'nightly-lint':'System/prompts/audit.md',
                 'weekly-synthesis':'System/prompts/weekly-synthesis.md'}
        for job,recipe in recipes.items():
            prompt=runner.prompt_for(self.root,job,dt.date(2026,11,17),self.report(job),'Not configured.')
            self.assertIn(recipe,prompt);self.assertIn('REPORT-ONLY',prompt)
            self.assertIn('Do not write any files',prompt)
            self.assertNotIn('wiki/sources',prompt)
    def test_calendar_configuration_rejects_non_string_names(self):
        p=self.root/'System/assistant.local.json'
        p.write_text(json.dumps({'calendar_names':[7]}))
        with self.assertRaises(ValueError):calendar.configured_names(p)
    def test_failed_adapter_cannot_publish_partial_stdout(self):
        self.adapter.write_text(self.adapter.read_text()+'raise SystemExit(7)\n')
        self.assertEqual(self.run_job(),1);self.assertFalse(self.report().exists())
    def test_concurrent_report_creation_cannot_be_overwritten(self):
        def concurrent(source,target):
            Path(target).write_text('another writer completed this report')
            raise FileExistsError('already exists')
        with patch.object(runner.os,'link',side_effect=concurrent): self.assertEqual(self.run_job(),1)
        self.assertEqual(self.report().read_text(),'another writer completed this report')
    def test_shared_lock_prevents_simultaneous_workflows(self):
        folder=self.root/'System/logs';folder.mkdir()
        with (folder/'workflows.lock').open('a') as lock:
            runner.fcntl.flock(lock,runner.fcntl.LOCK_EX|runner.fcntl.LOCK_NB)
            with patch.object(runner.subprocess,'run') as run:
                self.assertEqual(self.run_job(),0);run.assert_not_called()
    def test_no_configured_calendars_does_not_query_device(self):
        with patch.object(calendar,'read_calendar') as read,patch('sys.argv',['read-calendar.py','--config',str(self.root/'missing.json')]),contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(calendar.main(),0);read.assert_not_called()
    def test_calendar_retries_and_preserves_name_as_literal_argument(self):
        name='Work "quoted" $(literal)'
        with patch.object(calendar.subprocess,'run',side_effect=[subprocess.CompletedProcess([],1,'','temporary'),subprocess.CompletedProcess([],0,'event','')]) as run:
            result=calendar.read_calendar(name)
            self.assertTrue(result['available']);self.assertEqual(result['attempts'],2)
            self.assertEqual(run.call_args.args[0][-1],name)
            self.assertNotIn(name,run.call_args.args[0][2])

if __name__=='__main__': unittest.main(verbosity=2)
