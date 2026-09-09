"""Place prefixed Vinext assets at the GitHub Pages project root."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import shutil

root = Path('dist/client')
prefix = '/plus-calendar/'
nested = root / 'plus-calendar' / '_next'
if nested.exists():
    shutil.move(str(nested), str(root / '_next'))
    (root / 'plus-calendar').rmdir()
(root / '.nojekyll').touch()

class VerifyAssets(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('src', 'href') or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc:
                continue
            path = unquote(url.path)
            if path.startswith(prefix):
                assert (root / path[len(prefix):]).is_file(), value
            elif path.startswith('/') and not path.startswith('//'):
                raise ValueError('Unexpected root-relative asset: ' + value)

assert (root / 'index.html').is_file(), 'Missing generated calendar homepage'
VerifyAssets().feed((root / 'index.html').read_text())
assert (root / 'proposal.html').is_file()
print('GitHub Pages homepage and asset paths verified.')
