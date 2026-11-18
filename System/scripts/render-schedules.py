#!/usr/bin/env python3
"""Render optional macOS job definitions for this vault; never install or load jobs."""
import argparse
from pathlib import Path
import plistlib
import re

def render(vault, output, prefix='org.para-brain'):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9.-]*', prefix):
        raise ValueError('Label prefix must contain only letters, digits, dots, and hyphens.')
    vault, output = Path(vault).resolve(), Path(output).resolve()
    templates = Path(__file__).resolve().parent/'launchd'
    prepared = {}
    def substitute(value):
        if isinstance(value, str):
            return value.replace('__VAULT_ROOT__', str(vault)).replace('__LABEL_PREFIX__', prefix)
        if isinstance(value, list):
            return [substitute(item) for item in value]
        if isinstance(value, dict):
            return {key: substitute(item) for key, item in value.items()}
        return value
    for source in sorted(templates.glob('*.plist.template')):
        data = substitute(plistlib.loads(source.read_bytes()))
        target = output/(data['Label']+'.plist')
        content = plistlib.dumps(data)
        if target.exists() and target.read_bytes() != content:
            raise ValueError(f'{target.name} already has different content; preserve or reconcile it first.')
        prepared[target] = content
    if not prepared:
        raise ValueError('No launchd templates found.')
    output.mkdir(parents=True, exist_ok=True)
    for path, content in prepared.items():
        if not path.exists():
            with path.open('xb') as stream:
                stream.write(content)
    return list(prepared)

def main():
    root=Path(__file__).resolve().parents[2]
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--vault',type=Path,default=root)
    parser.add_argument('--output',type=Path,default=root/'System/.local/launchd')
    parser.add_argument('--label-prefix',default='org.para-brain')
    args=parser.parse_args()
    try:
        paths=render(args.vault,args.output,args.label_prefix)
    except (OSError,ValueError) as exc:
        parser.exit(1,str(exc)+'\n')
    print(f'Rendered {len(paths)} inactive definitions in {args.output}. No jobs installed or enabled.')

if __name__=='__main__':main()
