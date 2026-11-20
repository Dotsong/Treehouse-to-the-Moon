#!/usr/bin/env python3
"""Put the cel kit (cel-kit.js and folk.js from Maleficium) into index.html, between the two marker comments.

Run from the repo root: python3 tools/cel/splice.py
The first time, the markers are added just after the lights in the renderer section; after that, only what is between them is replaced.
"""
import pathlib, sys
root=pathlib.Path(__file__).resolve().parent.parent.parent
idx=root/'index.html'; s=idx.read_text(encoding='utf-8')
A='/* ===== cel kit, from Maleficium (tools/cel): do not edit here ===== */\n'; B='/* ===== end of the cel kit ===== */\n'
kit=(root/'tools/cel/cel-kit.js').read_text(encoding='utf-8')+'\n'+(root/'tools/cel/folk.js').read_text(encoding='utf-8')+'\n'
if A in s:
    i=s.index(A)+len(A); j=s.index(B); s=s[:i]+kit+s[j:]
else:
    anchor='/* ---------- Earth (the ground is a planet) ---------- */'
    if anchor not in s: sys.exit('splice: could not find the Earth section to insert before')
    s=s.replace(anchor,A+kit+B+'\n'+anchor,1)
idx.write_text(s,encoding='utf-8'); print('cel kit spliced in:',len(kit),'bytes')
