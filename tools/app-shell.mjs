#!/usr/bin/env node
// Normalize the app shell of a Stitch-generated app screen so every screen matches the Home Feed:
//   - removes the fake iOS status bar (9:41 / signal / wifi / battery) Stitch sometimes adds
//   - replaces the fixed bottom <nav> with the shared app tab bar, marking one tab active
// Run it on the Stitch HTML *before* tools/stitch-icons.mjs; the nav uses Material names as placeholders.
//
//   node tools/app-shell.mjs <in.html> <out.html> [--active home|explore|inbox|profile]

import fs from 'node:fs';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXA9-P3G3Ml_PLMTs_sMx1aptdX59cmOaXOnNpK7CdiPh0kpU_6oCqxb_5dzpwKNBqu7zkVZFwpiXuUBjDXpPItmkswlPG5dQWrhS-18NYqsfAvVVOPDhKByXFRVH5DA5WC8t6P_rX8chyCBujmr7wNc-7L-pHoCgo18h9xd-qd6pnsXuzTzxzatFk7HMzjVhyeym3uq4eDe-Q2vj5Og_-_pn8xSRVLYfKJbexPgSY-KKipWV6U2p1g8NQE8RAQlHt9KIutfVq2qKh';

const STATUS_BAR =
  /(?:<!--[^>]*?[Ss]tatus[^>]*?-->\s*)?<(header|div)\b[^>]*>\s*<span[^>]*>\s*9:41\s*<\/span>\s*<div\b[^>]*>(?:\s*<span[^>]*>[a-z0-9_]+<\/span>)+\s*<\/div>\s*<\/\1>\s*/;
const BOTTOM_NAV = /(?:<!--[^>]*?-->\s*)?<nav\b[^>]*class="[^"]*\bfixed\b[^"]*\bbottom-[^"]*"[^>]*>[\s\S]*?<\/nav>/g;

function tab(id, icon, label, active) {
  const color = active ? 'text-[#7C3AED] font-bold' : 'text-[#8A8A9A]';
  const fill = active ? ` style="font-variation-settings: 'FILL' 1;"` : '';
  return `<a class="flex flex-col items-center justify-center ${color} active:scale-90 transition-transform duration-200" href="#${id}">
<span class="material-symbols-outlined text-[24px]"${fill}>${icon}</span>
<span class="text-[11px] leading-4 font-semibold">${label}</span>
</a>`;
}

function bottomNav(active) {
  const ring = active === 'profile' ? 'ring-2 ring-[#7C3AED]' : 'border border-[#E4E2DF]';
  const profileColor = active === 'profile' ? 'text-[#7C3AED] font-bold' : 'text-[#8A8A9A]';
  return `<!-- Vibe shared bottom navigation -->
<nav class="fixed bottom-4 inset-x-4 max-w-md mx-auto z-50 flex justify-around items-center px-3 py-2 bg-white/95 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-8px_rgba(124,58,237,0.25)]">
${tab('home', 'home', 'Home', active === 'home')}
${tab('explore', 'search', 'Explore', active === 'explore')}
<div class="relative -top-3.5 flex flex-col items-center">
<button class="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF5A7A] shadow-[0_8px_20px_-4px_rgba(124,58,237,0.5)] text-white flex items-center justify-center border-4 border-white active:scale-95 transition-transform">
<span class="material-symbols-outlined text-[26px]">add</span>
</button>
</div>
${tab('inbox', 'chat_bubble', 'Inbox', active === 'inbox')}
<a class="flex flex-col items-center justify-center ${profileColor} active:scale-90 transition-transform duration-200" href="#profile">
<span class="w-6 h-6 rounded-full p-0.5 ${ring} overflow-hidden block"><img class="w-full h-full rounded-full object-cover" alt="Your profile" src="${AVATAR}"/></span>
<span class="text-[11px] leading-4 font-semibold mt-0.5">Profile</span>
</a>
</nav>`;
}

const args = process.argv.slice(2);
const activeFlag = args.indexOf('--active');
const active = activeFlag >= 0 ? args.splice(activeFlag, 2)[1] : undefined;
const [input, output] = args;
if (!input || !output) {
  console.error('usage: app-shell.mjs <in.html> <out.html> [--active home|explore|inbox|profile]');
  process.exit(1);
}

// Fallback: a <header> whose only visible text is the clock (icons may be Material names or inline SVG).
const HEADER_BLOCK = /(?:<!--[^>]*?-->\s*)?<header\b[^>]*>[\s\S]*?<\/header>\s*/g;
const isStatusOnly = (block) =>
  block.includes('9:41') &&
  block
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<span[^>]*material-symbols[^>]*>[a-z0-9_]+<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '') === '9:41';

let html = fs.readFileSync(input, 'utf8');
let hadStatusBar = STATUS_BAR.test(html);
html = html.replace(STATUS_BAR, '');
if (!hadStatusBar) {
  html = html.replace(HEADER_BLOCK, (block) => (isStatusOnly(block) ? ((hadStatusBar = true), '') : block));
}
let navs = 0;
if (active) {
  html = html.replace(BOTTOM_NAV, () => (navs++ === 0 ? bottomNav(active) : ''));
  if (!navs) console.warn('app-shell: no fixed bottom <nav> found; nothing replaced');
}
fs.writeFileSync(output, html);
console.log(`app-shell: status bar ${hadStatusBar ? 'removed' : 'not found'}, bottom nav ${active ? (navs ? `set (${active} active)` : 'missing') : 'untouched'} -> ${output}`);
