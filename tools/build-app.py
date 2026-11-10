#!/usr/bin/env python3
"""Build the offline app bundle in app/www from the web version in index.html.

The web version loads three.js from cdnjs and the fonts from Google Fonts.
The app bundles both, so it works with no internet connection:
  - the three.js <script> tag is pointed at vendor/three.min.js
  - the Google Fonts <link> tags are replaced with fonts/fonts.css
Everything in app/vendor-files is copied into app/www as-is.

Usage: python3 tools/build-app.py
"""
import pathlib, re, shutil, sys

root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "index.html").read_text(encoding="utf-8")
www = root / "app" / "www"
assets = root / "app" / "vendor-files"

three_tag = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
if src.count(three_tag) != 1:
    sys.exit("build-app: couldn't find the three.js <script> tag in index.html")
out = src.replace(three_tag, '<script src="vendor/three.min.js"></script>')

font_links = re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>\n?', out)
if not font_links:
    sys.exit("build-app: couldn't find the Google Fonts <link> tags in index.html")
for i, tag in enumerate(font_links):
    out = out.replace(tag, '<link rel="stylesheet" href="fonts/fonts.css">\n' if i == 0 else "", 1)

if "googleapis" in out or "cdnjs" in out:
    sys.exit("build-app: index.html still points at the internet after rewriting")

if www.exists():
    shutil.rmtree(www)
shutil.copytree(assets, www)
(www / "index.html").write_text(out, encoding="utf-8")
print(f"built {www / 'index.html'} ({len(out):,} bytes) plus {sum(1 for _ in assets.rglob('*') if _.is_file())} bundled files")
