#!/usr/bin/env node
// Swap Stitch's default Material Symbols for a real icon library (fetched from Iconify).
// Stitch writes icons as <span class="material-symbols-outlined">favorite</span>, so the
// icon name is a semantic placeholder we can map through icons/icon-kit.json.
//
//   node tools/stitch-icons.mjs build [set]                       resolve + cache SVGs for a set
//   node tools/stitch-icons.mjs apply <in.html> <out.html> [--set s]
//   node tools/stitch-icons.mjs screen <projectId> <screenId> [--set s]
//   node tools/stitch-icons.mjs compare <in.html>                 one file per set + side-by-side page
//
// The default set is "activeSet" in icons/icon-kit.json. Unmapped icon names fail the run
// so a screen never ships with a leftover Material icon.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT_PATH = path.join(ROOT, 'icons', 'icon-kit.json');
const CACHE_DIR = path.join(ROOT, 'icons', 'cache');
const OUT_DIR = path.join(ROOT, '.stitch');

const MATERIAL_CLASS = /\bmaterial-(?:symbols-(?:outlined|rounded|sharp)|icons(?:-[a-z]+)?)\b/;
const MATERIAL_ELEMENT = new RegExp(
  `<(\\w+)(\\s[^>]*?class\\s*=\\s*"[^"]*${MATERIAL_CLASS.source}[^"]*"[^>]*)>\\s*([a-z0-9_]+)\\s*</\\1>`,
  'g',
);
const ICON_CSS =
  '<style id="si-icons">:where(.si-icon){font-size:24px}' +
  '.si-icon{display:inline-flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;vertical-align:middle}' +
  '.si-icon>svg{width:1em;height:1em;display:block}</style>';

function die(msg, code = 1) {
  console.error(`stitch-icons: ${msg}`);
  process.exit(code);
}

function loadKit() {
  return JSON.parse(fs.readFileSync(KIT_PATH, 'utf8'));
}

function pickSet(kit, set) {
  const name = set || kit.activeSet;
  if (!kit.sets[name]) die(`unknown set "${name}". Available: ${Object.keys(kit.sets).join(', ')}`);
  return name;
}

function toSvg(icon, root) {
  const w = icon.width ?? root.width ?? 16;
  const h = icon.height ?? root.height ?? 16;
  let body = icon.body;
  const t = [];
  if (icon.hFlip) t.push(`translate(${w} 0) scale(-1 1)`);
  if (icon.vFlip) t.push(`translate(0 ${h}) scale(1 -1)`);
  if (icon.rotate) t.push(`rotate(${icon.rotate * 90} ${w / 2} ${h / 2})`);
  if (t.length) body = `<g transform="${t.join(' ')}">${body}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="${icon.left ?? 0} ${icon.top ?? 0} ${w} ${h}" aria-hidden="true">${body}</svg>`;
}

async function fetchSvgs(prefix, names) {
  const out = {};
  for (let i = 0; i < names.length; i += 60) {
    const chunk = names.slice(i, i + 60);
    const res = await fetch(`https://api.iconify.design/${prefix}.json?icons=${chunk.join(',')}`);
    if (!res.ok) die(`Iconify returned ${res.status} for ${prefix}`);
    const json = await res.json();
    const icons = json.icons || {};
    for (const [n, icon] of Object.entries(icons)) out[n] = toSvg(icon, json);
    for (const [n, alias] of Object.entries(json.aliases || {})) {
      const parent = icons[alias.parent];
      if (parent && !out[n]) out[n] = toSvg({ ...parent, ...alias, body: parent.body }, json);
    }
  }
  return out;
}

async function build(setArg) {
  const kit = loadKit();
  const set = pickSet(kit, setArg);
  const def = kit.sets[set];
  // A candidate starting with "=" is an exact icon name used for both states (e.g. "=plus-bold").
  const variants = (base) => (base.startsWith('=') ? [base.slice(1), base.slice(1)] : [base + def.regular, base + def.fill]);
  const wanted = new Set();
  for (const icon of Object.values(kit.icons)) {
    for (const base of icon[set] || []) variants(base).forEach((n) => wanted.add(n));
  }
  const svgs = await fetchSvgs(set, [...wanted]);
  const resolved = {};
  const missing = [];
  for (const [key, icon] of Object.entries(kit.icons)) {
    const base = (icon[set] || []).find((b) => variants(b).every((n) => svgs[n]));
    if (!base) {
      missing.push(`${key} (tried: ${(icon[set] || []).join(', ') || 'none'})`);
      continue;
    }
    const [regular, fill] = variants(base);
    const entry = { name: base, regular: svgs[regular], fill: svgs[fill] };
    if (icon.style === 'fill') entry.regular = entry.fill;
    for (const m of icon.material) resolved[m] = entry;
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, `${set}.json`), JSON.stringify(resolved, null, 1));
  console.log(`${def.label}: ${Object.keys(kit.icons).length - missing.length}/${Object.keys(kit.icons).length} icons resolved`);
  if (missing.length) die(`no ${set} match for:\n  ${missing.join('\n  ')}\nFix the candidates in icons/icon-kit.json.`, 2);
  return resolved;
}

async function loadCache(set) {
  const file = path.join(CACHE_DIR, `${set}.json`);
  const kitTime = fs.statSync(KIT_PATH).mtimeMs;
  if (fs.existsSync(file) && fs.statSync(file).mtimeMs >= kitTime) return JSON.parse(fs.readFileSync(file, 'utf8'));
  return build(set);
}

function applyIcons(html, cache) {
  const unmapped = new Set();
  let count = 0;
  // Drop the Material font, but keep other families Stitch bundles into the same Google Fonts link
  // (e.g. "family=Plus+Jakarta+Sans...&family=Material+Symbols+Outlined...").
  html = html.replace(/<link[^>]+Material\+(?:Symbols|Icons)[^>]*>\s*/g, (link) => {
    const kept = link.replace(/family=Material\+(?:Symbols|Icons)[^&"]*(?:&(?:amp;)?)?/g, '');
    return /family=/.test(kept) ? kept.replace(/(?:&(?:amp;)?)+(display=)/, '&$1').replace(/\?(?:&(?:amp;)?)+/, '?') : '';
  });
  html = html.replace(MATERIAL_ELEMENT, (match, tag, attrs, text) => {
    // Stitch sometimes tags an icon data-icon="sparkles" but falls back to a wrong glyph name
    // (e.g. arrow_back_ios_new) because "sparkles" isn't a Material icon; trust the tag when we know it.
    const tagged = /\bdata-icon="([a-z0-9_]+)"/.exec(attrs)?.[1];
    const filled = /['"]FILL['"]\s*1/.test(attrs);
    // Real back buttons are never filled; a filled back chevron is Stitch's broken stand-in for a sparkle.
    const fakeSparkle = !tagged && filled && text === 'arrow_back_ios_new';
    const name = fakeSparkle ? 'auto_awesome' : tagged && cache[tagged] ? tagged : text;
    const entry = cache[name];
    if (!entry) {
      unmapped.add(name);
      return match;
    }
    count++;
    const cleanAttrs = attrs.replace(MATERIAL_CLASS, 'si-icon');
    return `<${tag}${cleanAttrs} data-icon="${name}">${filled ? entry.fill : entry.regular}</${tag}>`;
  });
  // Stitch sometimes styles the Material class directly; keep those rules on the new class.
  html = html.replace(/\.material-(?:symbols-(?:outlined|rounded|sharp)|icons(?:-[a-z]+)?)\b/g, '.si-icon');
  html = html.includes('</head>') ? html.replace('</head>', `${ICON_CSS}</head>`) : ICON_CSS + html;
  const leftovers = (html.match(/material-(?:symbols|icons)/gi) || []).length;
  return { html, count, unmapped: [...unmapped], leftovers };
}

async function applyFile(input, output, set) {
  const cache = await loadCache(set);
  const result = applyIcons(fs.readFileSync(input, 'utf8'), cache);
  if (result.unmapped.length) {
    die(`unmapped Material icons: ${result.unmapped.join(', ')}\nAdd them to a "material" list in icons/icon-kit.json and re-run.`, 2);
  }
  if (result.leftovers) die(`${result.leftovers} Material reference(s) left in ${input}; check the markup by hand.`, 2);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, result.html);
  console.log(`${set}: replaced ${result.count} icons -> ${path.relative(ROOT, output)}`);
}

async function screen(projectId, screenId, set) {
  if (!projectId || !screenId) die('usage: screen <projectId> <screenId> [--set s]');
  const raw = execSync(`stitch get screen ${screenId} --project ${projectId} --json`, {
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
  const json = JSON.parse(raw);
  const data = json.data || json;
  const url = data.htmlCode?.downloadUrl;
  if (!url) die(`screen ${screenId} has no HTML (is it an image screen?)`);
  const res = await fetch(url);
  if (!res.ok) die(`HTML download failed: ${res.status}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const source = path.join(OUT_DIR, `${screenId}.material.html`);
  fs.writeFileSync(source, await res.text());
  const output = path.join(OUT_DIR, `${screenId}.${set}.html`);
  await applyFile(source, output, set);
  const title = (data.title || 'Screen').replace(/"/g, '');
  console.log(`\nUpload when ready:\n  stitch upload screen ${path.relative(ROOT, output)} --project ${projectId} --title "${title}" --json`);
}

// `stitch upload screen` never sends a device type, so Stitch renders uploaded HTML at
// desktop width. This sends the same screens:batchCreate request with deviceType set,
// signed with the Stitch CLI's own login (~/.stitch/credentials.json).
async function upload(file, projectId, title, device = 'MOBILE', preview) {
  if (!file || !projectId) die('usage: upload <file.html> <projectId> [--title t] [--device MOBILE|DESKTOP|TABLET] [--preview shot.png]');
  execSync('stitch status --json', { stdio: 'ignore', env: { ...process.env, NO_COLOR: '1' } }); // refreshes an expired token
  const home = process.env.USERPROFILE || process.env.HOME;
  const readJson = (p) => {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      return {};
    }
  };
  const creds = readJson(path.join(home, '.stitch', 'credentials.json'));
  // `stitch login --api-key` saves the key in ~/.stitch.json; prefer it over the OAuth token.
  const apiKey = process.env.STITCH_API_KEY || readJson(path.join(home, '.stitch.json')).apiKey;
  if (!apiKey && !creds.access_token) die('not logged in: run `stitch login` or `stitch login --api-key <key>`');
  const headers = apiKey
    ? { 'X-Goog-Api-Key': apiKey }
    : { Authorization: `Bearer ${creds.access_token}` };
  const screen = {
    screenType: 'DOCUMENT',
    isCreatedByClient: true,
    deviceType: device,
    htmlCode: { fileContentBase64: fs.readFileSync(file).toString('base64'), mimeType: 'text/html' },
    title: title || path.basename(file, path.extname(file)),
  };
  // Stitch renders its own thumbnail at 1280px; a phone-size PNG keeps the canvas preview mobile.
  if (preview) {
    const png = fs.readFileSync(preview);
    screen.screenshot = { fileContentBase64: png.toString('base64'), mimeType: 'image/png' };
    screen.width = String(png.readUInt32BE(16));
    screen.height = String(png.readUInt32BE(20));
  }
  const res = await fetch(`https://stitch.googleapis.com/v1/projects/${projectId}/screens:batchCreate`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ parent: `projects/${projectId}`, requests: [{ screen }], createScreenInstances: true }),
  });
  const text = await res.text();
  if (!res.ok) die(`upload failed (HTTP ${res.status}): ${text.slice(0, 500)}`);
  const ids = (JSON.parse(text).results || []).map((r) => r.screen?.name?.split('/').pop() || r.screen?.id);
  console.log(`uploaded ${device} screen: ${ids.join(', ')}`);
  for (const id of ids) console.log(`  https://stitch.google.com/projects/${projectId}?node-id=${id}`);
}

async function compare(input) {
  if (!input) die('usage: compare <in.html>');
  const kit = loadKit();
  const dir = path.join(OUT_DIR, 'compare');
  const frames = [];
  for (const set of Object.keys(kit.sets)) {
    const out = path.join(dir, `${set}.html`);
    await applyFile(input, out, set);
    frames.push(
      `<figure><figcaption>${kit.sets[set].label}</figcaption><iframe src="${set}.html" loading="lazy"></iframe></figure>`,
    );
  }
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>Icon set comparison</title><style>
body{margin:0;padding:24px;background:#f3f1ee;font-family:system-ui,sans-serif;color:#1a1a2e}
h1{font-size:20px;margin:0 0 16px}.row{display:flex;gap:24px;overflow-x:auto}
figure{margin:0;flex:0 0 auto}figcaption{font-weight:700;margin-bottom:8px}
iframe{width:390px;height:844px;border:0;border-radius:28px;background:#fff;box-shadow:0 10px 30px rgba(26,26,46,.12)}
</style></head><body><h1>Same screen, different icon sets</h1><div class="row">${frames.join('')}</div></body></html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  console.log(`\nOpen ${path.relative(ROOT, path.join(dir, 'index.html'))} to compare.`);
}

const [cmd, ...rest] = process.argv.slice(2);
const setFlag = rest.indexOf('--set');
const setArg = setFlag >= 0 ? rest.splice(setFlag, 2)[1] : undefined;
const kit = loadKit();

switch (cmd) {
  case 'build':
    await build(rest[0] || setArg);
    break;
  case 'apply':
    if (rest.length < 2) die('usage: apply <in.html> <out.html> [--set s]');
    await applyFile(rest[0], rest[1], pickSet(kit, setArg));
    break;
  case 'screen':
    await screen(rest[0], rest[1], pickSet(kit, setArg));
    break;
  case 'compare':
    await compare(rest[0]);
    break;
  case 'upload': {
    const flag = (name) => {
      const i = rest.indexOf(name);
      return i >= 0 ? rest.splice(i, 2)[1] : undefined;
    };
    const title = flag('--title');
    const device = flag('--device');
    const preview = flag('--preview');
    await upload(rest[0], rest[1], title, device, preview);
    break;
  }
  default:
    die('commands: build [set] | apply <in> <out> [--set s] | screen <projectId> <screenId> [--set s] | compare <in.html> | upload <file.html> <projectId> [--title t] [--device d]');
}
