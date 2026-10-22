#!/usr/bin/env node
// Build a clickable Kaleido prototype from the finished screens in .stitch/vibe-*.html.
//   node tools/build-prototype.mjs        -> prototype/index.html (phone frame + screen list)
// Each screen gets proto.js injected; its ROUTES table wires buttons, icons and tabs to other screens.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '.stitch');
const OUT = path.join(ROOT, 'prototype');

// Order = flow order in the screen list.
const SCREENS = [
  ['splash', 'Splash'],
  ['onboarding-1', 'Onboarding 1'],
  ['onboarding-2', 'Onboarding 2'],
  ['onboarding-3', 'Onboarding 3'],
  ['login', 'Log In'],
  ['signup', 'Sign Up'],
  ['home-feed', 'Home Feed'],
  ['explore', 'Explore'],
  ['create', 'Create Post'],
  ['story', 'Story Viewer'],
  ['reels', 'Reels'],
  ['inbox', 'Inbox'],
  ['chat', 'Chat'],
  ['profile', 'Profile'],
  ['notifications', 'Notifications'],
  ['settings', 'Settings'],
];

// Runs inside every screen. Rules match a clicked element by its visible text or by a
// data-icon inside it (the Material name the icon kit keeps). "back" means history.back().
const PROTO_JS = `(() => {
  const page = location.pathname.split('/').pop().replace('.html', '');
  const TABS = { '#home': 'home-feed', '#explore': 'explore', '#inbox': 'inbox', '#profile': 'profile' };
  const BACK_ICONS = ['arrow_back', 'arrow_back_ios', 'arrow_back_ios_new', 'chevron_left'];
  const ROUTES = {
    'onboarding-1': [{ text: 'Next', to: 'onboarding-2' }, { text: 'Skip', to: 'login' }],
    'onboarding-2': [{ text: 'Next', to: 'onboarding-3' }, { text: 'Skip', to: 'login' }],
    'onboarding-3': [{ text: 'Get started', to: 'signup' }, { text: 'I already have an account', to: 'login' }],
    login: [{ text: 'Log in', to: 'home-feed' }, { text: 'Sign up', to: 'signup' }, { icon: ['google', 'apple', 'facebook'], to: 'home-feed' }],
    signup: [{ text: 'Create account', to: 'home-feed' }, { text: 'Log in', to: 'login' }],
    'home-feed': [
      { icon: ['notifications', 'notifications_none'], to: 'notifications' },
      { icon: ['send'], area: 'header', to: 'inbox' },
      { text: 'Your story', to: 'create' },
      { area: 'stories', to: 'story' },
      { icon: ['play_arrow', 'play_circle'], to: 'reels' },
      { text: 'sara.travels', to: 'profile' },
    ],
    explore: [{ icon: ['play_arrow', 'play_circle'], to: 'reels' }, { text: 'lina.art', to: 'chat' }],
    inbox: [{ text: 'lina.art', to: 'chat' }, { text: 'omar_fit', to: 'chat' }, { text: 'Travel Squad', to: 'chat' }],
    profile: [{ icon: ['tune', 'settings', 'menu'], to: 'settings' }, { icon: ['play_arrow'], to: 'reels' }],
    create: [{ text: 'Share', to: 'home-feed' }, { icon: ['close'], to: 'back' }],
    story: [{ icon: ['close'], to: 'home-feed' }],
    reels: [{ text: 'nour.eats', to: 'profile' }],
    settings: [{ text: 'Log out', to: 'login' }],
  };

  const go = (to) => (to === 'back' ? history.back() : (location.href = to + '.html'));
  const clickable = (el) => el.closest('a, button, [role="button"], .cursor-pointer, label') || el;
  const icons = (el) => [...el.querySelectorAll('[data-icon]')].map((n) => n.dataset.icon).concat(el.dataset?.icon || []);
  const text = (el) => (el.innerText || '').replace(/\\s+/g, ' ').trim();

  // Walk up from the tapped element, but never past its own button/link (or 6 levels), so a
  // tap on a post doesn't pick up an icon elsewhere in the same card.
  function match(target) {
    if (!(target instanceof Element)) return null;
    const stop = target.closest('a, button, [role="button"]');
    for (let el = target, depth = 0; el && el !== document.body && depth < 6; el = el.parentElement, depth++) {
      if (el.matches('a[href^="#"]') && TABS[el.getAttribute('href')]) return TABS[el.getAttribute('href')];
      const isControl = el.matches('a, button, [role="button"]');
      const ic = isControl ? icons(el) : el.dataset.icon ? [el.dataset.icon] : [];
      if (el.matches('nav.fixed button') && ic.includes('add')) return 'create';
      for (const r of ROUTES[page] || []) {
        if (r.area === 'stories') {
          if (depth <= 3 && el.querySelector('img') && el.closest('section') === document.querySelector('main section')) return r.to;
          continue;
        }
        if (r.area === 'header' && !el.closest('header')) continue;
        if (r.icon && r.icon.some((i) => ic.includes(i))) return r.to;
        if (r.text && el.matches?.('a, button, [role="button"], span, p, h3, div') && text(el).startsWith(r.text) && text(el).length <= r.text.length + 24) return r.to;
      }
      if (BACK_ICONS.some((i) => ic.includes(i)) && isControl) return 'back';
      if (el === stop) break;
    }
    return null;
  }

  document.addEventListener('click', (e) => {
    const to = match(e.target);
    if (to) {
      e.preventDefault();
      e.stopPropagation();
      go(to);
    }
  }, true);

  // Show a pointer on anything that leads somewhere.
  document.addEventListener('mouseover', (e) => {
    const el = clickable(e.target);
    if (match(e.target)) el.style.cursor = 'pointer';
  });

  window.__protoMatch = match; // used by link checks
  if (page === 'splash') setTimeout(() => go('onboarding-1'), 2200);
  parent?.postMessage?.({ kaleidoScreen: page }, '*');
})();
`;

const INDEX_HTML = (list) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kaleido Prototype</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#f3f1ee;--ink:#1a1a2e;--muted:#8a8a9a;--violet:#7c3aed;--coral:#ff5a7a;--card:#fff}
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:var(--bg);font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--ink);display:flex;gap:40px;align-items:center;justify-content:center;padding:24px}
aside{width:240px;align-self:stretch;display:flex;flex-direction:column;gap:6px;max-height:calc(100vh - 48px);overflow:auto}
h1{margin:0 0 4px;font-size:28px;font-weight:800;background:linear-gradient(90deg,var(--violet),var(--coral));-webkit-background-clip:text;background-clip:text;color:transparent}
p.hint{margin:0 0 14px;color:var(--muted);font-size:13px;line-height:1.5}
button.s{all:unset;cursor:pointer;padding:10px 14px;border-radius:14px;font-weight:600;font-size:14px;color:var(--ink)}
button.s:hover{background:#fff}button.s.on{background:var(--card);color:var(--violet);box-shadow:0 6px 18px -8px rgba(124,58,237,.35)}
.group{margin-top:10px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:0 14px}
.phone{width:414px;height:868px;border-radius:56px;background:#1a1a2e;padding:12px;box-shadow:0 30px 80px -20px rgba(26,26,46,.45);flex:0 0 auto}
iframe{width:390px;height:844px;border:0;border-radius:44px;background:#faf8f5;display:block}
.restart{all:unset;cursor:pointer;margin-top:14px;text-align:center;padding:12px;border-radius:999px;color:#fff;font-weight:700;background:linear-gradient(90deg,var(--violet),var(--coral))}
@media (max-width:760px){body{flex-direction:column;padding:16px}aside{width:100%;max-height:none}.phone{transform:scale(.8);transform-origin:top center}}
</style></head><body>
<aside>
  <h1>Kaleido</h1>
  <p class="hint">Tap through the app inside the phone, or jump to any screen here.</p>
  ${list}
  <button class="restart" onclick="show('splash')">Restart from splash</button>
</aside>
<div class="phone"><iframe id="f" src="screens/splash.html" title="Kaleido prototype"></iframe></div>
<script>
const f=document.getElementById('f');
function show(id){f.src='screens/'+id+'.html'}
function mark(id){document.querySelectorAll('button.s').forEach(b=>b.classList.toggle('on',b.dataset.id===id))}
addEventListener('message',e=>{if(e.data&&e.data.kaleidoScreen)mark(e.data.kaleidoScreen)});
f.addEventListener('load',()=>{try{mark(f.contentWindow.location.pathname.split('/').pop().replace('.html',''))}catch(_){}});
</script>
</body></html>
`;

fs.mkdirSync(path.join(OUT, 'screens'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'proto.js'), PROTO_JS);
const groups = { splash: 'Welcome', login: 'Account', 'home-feed': 'App', inbox: 'Messages', profile: 'You' };
let list = '';
for (const [id, label] of SCREENS) {
  const src = path.join(SRC, `vibe-${id}.html`);
  if (!fs.existsSync(src)) {
    console.error(`missing ${path.relative(ROOT, src)}`);
    process.exit(1);
  }
  let html = fs.readFileSync(src, 'utf8');
  html = html.includes('</body>') ? html.replace('</body>', '<script src="../proto.js"></script></body>') : html + '<script src="../proto.js"></script>';
  fs.writeFileSync(path.join(OUT, 'screens', `${id}.html`), html);
  if (groups[id]) list += `<div class="group">${groups[id]}</div>`;
  list += `<button class="s" data-id="${id}" onclick="show('${id}')">${label}</button>`;
}
fs.writeFileSync(path.join(OUT, 'index.html'), INDEX_HTML(list));
console.log(`prototype: ${SCREENS.length} screens -> ${path.relative(ROOT, path.join(OUT, 'index.html'))}`);
