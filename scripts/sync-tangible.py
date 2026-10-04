"""Import the tested Tangible Views project without changing its source."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'site/projects/tangible-views'


def sync(source):
    tracked = ['index.html', 'project-notes.html', 'studio.css', 'validation-report.json',
               'docs/UI-CHECKS.md', 'docs/ARCHITECTURE.md', 'docs/PRINCIPLES.zh-CN.md']
    tracked += [str(p.relative_to(source)) for p in sorted((source / 'src').glob('*.mjs'))]
    missing = [name for name in tracked if not (source / name).is_file()]
    if missing:
        raise SystemExit('Missing project files: ' + ', '.join(missing))
    if not (source / 'src/app.mjs').is_file():
        raise SystemExit('Expected a Tangible Views source checkout.')
    # Remove only previously imported files when the upstream project drops them.
    manifest = ROOT / 'tangible-source.json'
    previous = json.loads(manifest.read_text()).get('files', []) if manifest.exists() else []
    for name in previous:
        old = (DEST / name).resolve()
        if name not in tracked and old.is_relative_to(DEST.resolve()) and old.is_file():
            old.unlink()
    for name in tracked:
        dest = DEST / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source / name, dest)
    html = (DEST / 'index.html').read_text()
    html = html.replace('<div class="header-actions">', '<div class="header-actions"><a class="header-button portfolio-return" href="../../#tangible-project" data-no-translate>Portfolio</a>', 1)
    html = html.replace('</head>', '<link rel="canonical" href="https://jiaxiyou-ctrl.github.io/projects/tangible-views/">\n</head>')
    (DEST / 'index.html').write_text(html)
    head = subprocess.run(['git', '-C', str(source), 'rev-parse', 'HEAD'], capture_output=True, text=True, check=True).stdout.strip()
    dirty = bool(subprocess.run(['git', '-C', str(source), 'status', '--porcelain'], capture_output=True, text=True, check=True).stdout.strip())
    manifest.write_text(json.dumps({'repository': 'https://github.com/jiaxiyou-ctrl/tangible-views',
                                    'commit': head, 'working_tree_changes': dirty, 'files': tracked}, indent=2) + '\n')
    print(f'Imported {len(tracked)} Tangible Views files from {head[:7]}' + (' (with local changes)' if dirty else ''))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path, help='Local checkout of jiaxiyou-ctrl/tangible-views')
    sync(parser.parse_args().source.resolve())
