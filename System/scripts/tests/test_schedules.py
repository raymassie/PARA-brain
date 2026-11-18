from pathlib import Path
import importlib.util
import os
import plistlib
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / 'System/scripts/render-schedules.py'
spec = importlib.util.spec_from_file_location('schedule_renderer', SCRIPT)
schedules = importlib.util.module_from_spec(spec)
spec.loader.exec_module(schedules)


class Schedules(unittest.TestCase):
    def test_definitions_use_existing_runners_and_expected_times(self):
        expected = {
            'morning-brief': {'Hour': 6, 'Minute': 0},
            'nightly-lint': {'Hour': 23, 'Minute': 30},
            'weekly-synthesis': {'Hour': 19, 'Minute': 0, 'Weekday': 0},
        }
        with tempfile.TemporaryDirectory() as temp:
            paths = schedules.render(ROOT, Path(temp))
            self.assertEqual(len(paths), len(expected))
            for path in paths:
                data = plistlib.loads(path.read_bytes())
                job = data['Label'].removeprefix('org.para-brain.')
                self.assertIn(job, expected)
                self.assertEqual(data['StartCalendarInterval'], expected[job])
                self.assertEqual(data['WorkingDirectory'], str(ROOT))
                self.assertEqual(data['ProgramArguments'], [
                    '/bin/zsh', '-l', str(ROOT / 'System/scripts' / (job + '.sh')),
                ])
                self.assertTrue(Path(data['ProgramArguments'][-1]).is_file())
                self.assertEqual(data['StandardOutPath'], str(
                    ROOT / 'System/logs' / (job + '.launchd.log')))
                self.assertEqual(data['StandardErrorPath'], data['StandardOutPath'])
                self.assertFalse(data['RunAtLoad'])

    def test_vault_paths_with_xml_characters_and_custom_labels(self):
        with tempfile.TemporaryDirectory() as temp:
            vault = Path(temp) / 'A vault & <notes> "quoted"'
            paths = schedules.render(vault, Path(temp) / 'jobs', 'org.example.vault')
            for path in paths:
                data = plistlib.loads(path.read_bytes())
                self.assertEqual(data['WorkingDirectory'], str(vault.resolve()))
                self.assertTrue(data['ProgramArguments'][-1].startswith(str(vault.resolve())))
                self.assertTrue(data['Label'].startswith('org.example.vault.'))
                self.assertNotIn('__VAULT_ROOT__', path.read_text())
                self.assertNotIn('__LABEL_PREFIX__', path.read_text())

    def test_rerender_preserves_identical_definitions(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / 'jobs'
            paths = schedules.render(ROOT, output)
            before = {p: (p.read_bytes(), p.stat().st_mtime_ns) for p in paths}
            self.assertEqual(schedules.render(ROOT, output), paths)
            self.assertEqual(before, {
                p: (p.read_bytes(), p.stat().st_mtime_ns) for p in paths
            })

    def test_conflict_preserves_customization_and_creates_no_other_jobs(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / 'jobs'
            output.mkdir()
            custom = output / 'org.para-brain.weekly-synthesis.plist'
            custom.write_text('existing local customization')
            with self.assertRaises(ValueError):
                schedules.render(ROOT, output)
            self.assertEqual(custom.read_text(), 'existing local customization')
            self.assertEqual(list(output.iterdir()), [custom])

    def test_invalid_label_prefix_cannot_create_output_paths(self):
        for prefix in ['', '../escape', 'a/b', 'with spaces', '-leading']:
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as temp:
                output = Path(temp) / 'jobs'
                with self.assertRaises(ValueError):
                    schedules.render(ROOT, output, prefix)
                self.assertFalse(output.exists())

    def test_cli_discovers_copied_vault_without_installing_or_configuring_jobs(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            vault = base / 'A copied vault & notes'
            scripts = vault / 'System/scripts'
            scripts.mkdir(parents=True)
            shutil.copy2(SCRIPT, scripts / SCRIPT.name)
            shutil.copytree(SCRIPT.parent / 'launchd', scripts / 'launchd')
            environment = {**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'}
            result = subprocess.run(
                [sys.executable, str(scripts / SCRIPT.name)],
                cwd=base, capture_output=True, text=True, env=environment,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('No jobs installed or enabled.', result.stdout)
            output = vault / 'System/.local/launchd'
            self.assertEqual(len(list(output.glob('*.plist'))), 3)
            self.assertFalse((vault / 'System/assistant.local.json').exists())
            self.assertFalse((vault / 'System/logs').exists())
            self.assertFalse((vault / 'Library/LaunchAgents').exists())
            self.assertFalse((vault / '03-resources').exists())
            for path in output.glob('*.plist'):
                self.assertEqual(plistlib.loads(path.read_bytes())['WorkingDirectory'],
                                 str(vault.resolve()))


if __name__ == '__main__':
    unittest.main(verbosity=2)
