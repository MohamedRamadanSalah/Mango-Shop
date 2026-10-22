#!/usr/bin/env node
// Builds the POV QR menu screens by hand (no Stitch AI), one folder per design option.
// Icons are written as Material Symbols names (placeholders); run stitch-icons apply afterwards.
//
//   node tools/build-screens.mjs            -> screens/<design>/NN-name.material.html for every design
//   node tools/build-screens.mjs b          -> only design b
//
// Then: node tools/stitch-icons.mjs apply screens/<design>/<f>.material.html screens/<design>/<f>.html
//
// Each screen lives in tools/screens/<design>/NN-*.mjs and exports { file, title, css, body },
// plus optional `fonts` (Google Fonts css2 query, default Readex Pro), `colors` (Tailwind colors)
// and `baseCss` (replaces the shared Mango Pop BASE_CSS).

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, C, BASE_CSS } from './screens/shared.mjs';

const SRC = path.join(ROOT, 'tools', 'screens');
const READEX = 'family=Readex+Pro:wght@300..700';

const page = ({ title, css = '', body, fonts = READEX, colors = C, baseCss = BASE_CSS }) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>POV · ${title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?${fonts}&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script>tailwind.config={theme:{extend:{fontFamily:{sans:['Readex Pro','sans-serif']},colors:${JSON.stringify(colors)}}}}</script>
<style>${baseCss}${css}</style>
</head>
<body><main class="screen">
${body}
</main></body></html>
`;

const only = process.argv[2];
const designs = fs.readdirSync(SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory() && (!only || d.name === only))
  .map((d) => d.name).sort();
if (!designs.length) throw new Error(`no design folder ${only ? `"${only}" ` : ''}in tools/screens`);

for (const design of designs) {
  const out = path.join(ROOT, 'screens', design);
  fs.mkdirSync(out, { recursive: true });
  const modules = fs.readdirSync(path.join(SRC, design)).filter((f) => /^\d\d-.*\.mjs$/.test(f)).sort();
  for (const f of modules) {
    const screen = await import(new URL(`./screens/${design}/${f}`, import.meta.url));
    fs.writeFileSync(path.join(out, `${screen.file}.material.html`), page(screen));
    console.log(`screens/${design}/${screen.file}.material.html`);
  }
}
