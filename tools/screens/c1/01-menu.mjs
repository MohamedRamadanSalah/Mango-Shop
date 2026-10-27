// Concept C1 "Menu Board" (draft for the client's option C). Responsive, view-only.
// Idea: a bilingual juice-bar menu board. A clean list (not cards): English left, Arabic right,
// small round photos, prices in the category colour. Two board columns on a computer.
// Logo colours: category headers on their tint with a solid diamond, colour price chips.

import { C, BRAND, CATEGORIES, drinksIn, photo, ic, ar, logoMark, MARK_CSS } from '../shared.mjs';

export const file = '01-menu';
export const title = 'Menu';

const ON = { yellow: C.ink, orange: C.ink, purple: '#fff', teal: C.ink, coral: C.ink };
const vars = (color) => `--c:${C[color]};--t:${C[`${color}Soft`]};--on:${ON[color]}`;

export const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{margin:0;background:#FFFBF1;color:${C.ink};font-family:'Readex Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.screen{min-height:100vh;overflow-x:clip}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
h1,h2,h3,p,figure{margin:0}
.ar{font-family:'Readex Pro',sans-serif;unicode-bidi:isolate}
.ico{font-size:20px;line-height:1}
${MARK_CSS}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
section[id]{scroll-margin-top:64px}
`;

export const css = `
/* header */
.hd{display:flex;align-items:center;justify-content:space-between;padding-top:18px;padding-bottom:6px}
.brand{display:flex;align-items:center;gap:10px}
.wm{font-size:26px;font-weight:700;letter-spacing:-.04em;line-height:1}
.brand .ar{display:block;margin-top:2px;font-size:13px;font-weight:600;color:${C.purple}}
.place{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:${C.muted}}
.place .ico{color:${C.coral}}
.hello{padding-top:22px;padding-bottom:18px}
.hello h1{font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.1}
.hello .ar{display:block;margin-top:6px;font-size:18px;font-weight:600;color:${C.purple}}

/* tabs */
.tabs{position:sticky;top:0;z-index:20;background:rgba(255,251,241,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid ${C.line}}
.tabs-in{display:flex;gap:6px;overflow-x:auto;padding-top:10px;padding-bottom:10px;scrollbar-width:none}
.tabs-in::-webkit-scrollbar{display:none}
.tab{display:inline-flex;align-items:center;gap:8px;flex-shrink:0;min-height:44px;padding:0 14px;border-radius:999px;background:#fff;border:1.5px solid ${C.line};font-size:14px;font-weight:600;white-space:nowrap}
.tab i{width:10px;height:10px;border-radius:28%;transform:rotate(45deg);background:var(--c)}

/* board */
.board{padding-top:22px;padding-bottom:40px}
.cat{break-inside:avoid;margin-bottom:26px;background:#fff;border-radius:24px;border:1.5px solid ${C.line};overflow:hidden}
.cat-h{display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--t)}
.cat-h .dm{width:22px;height:22px;border-radius:28%;transform:rotate(45deg);background:var(--c);flex-shrink:0;margin:0 4px}
.cat-h h2{font-size:21px;font-weight:700;letter-spacing:-.02em;line-height:1.15}
.cat-h .ar{margin-left:auto;font-size:18px;font-weight:600;text-align:right}
.rows{padding:4px 18px 8px}
.row{display:grid;grid-template-columns:56px minmax(0,1fr) auto;align-items:center;gap:12px;padding:12px 0}
.row + .row{border-top:1.5px dashed ${C.line}}
.th{width:56px;height:56px;border-radius:50%;overflow:hidden;background:var(--t)}
.th img{width:100%;height:100%;object-fit:cover}
.nm{font-size:16px;font-weight:600;line-height:1.25}
.nm-ar{display:block;margin-top:2px;font-size:15px;font-weight:500;color:${C.muted}}
.lead{display:none}
.note{margin-top:2px;font-size:12.5px;color:${C.muted}}
.pr{display:inline-flex;align-items:baseline;gap:3px;padding:6px 10px;border-radius:12px;background:var(--c);color:var(--on);font-weight:700;line-height:1;white-space:nowrap}
.pr b{font-size:17px;font-variant-numeric:tabular-nums}
.pr small{font-size:10px;letter-spacing:.06em}
.ft{padding:26px 0 34px;text-align:center;color:${C.muted};font-size:13px}

@media (min-width:760px){
  .hello{display:flex;align-items:baseline;justify-content:space-between;gap:20px}
  .hello h1{font-size:44px}
  .hello .ar{font-size:24px}
  .tabs-in{justify-content:center}
  /* EN ...... AR on one line, like a printed board */
  .mid{display:flex;align-items:baseline;gap:10px}
  .lead{display:block;flex:1;min-width:20px;border-bottom:2px dotted #E6D6B0;transform:translateY(-4px)}
  .nm-ar{margin:0}
}
@media (min-width:1000px){
  .board{column-count:2;column-gap:26px}
}
`;

const row = (d) => `
<div class="row">
  <figure class="th"><img src="${photo(d.id)}" alt="${d.en}" loading="lazy"/></figure>
  <div><div class="mid"><h3 class="nm">${d.en}</h3><i class="lead" aria-hidden="true"></i>${ar(d.ar, 'nm-ar')}</div>${d.note ? `<p class="note">${d.note}</p>` : ''}</div>
  <span class="pr"><b>${d.price}</b><small>${BRAND.currency}</small></span>
</div>`;

const cat = (c) => `
<section class="cat" id="${c.id}" style="${vars(c.color)}">
  <header class="cat-h"><i class="dm" aria-hidden="true"></i><h2>${c.en}</h2>${ar(c.ar)}</header>
  <div class="rows">${drinksIn(c.id).map(row).join('')}</div>
</section>`;

export const body = `
<header class="wrap hd">
  <span class="brand">${logoMark(44)}<span><span class="wm"><span style="color:${C.purple}">P</span><span style="color:${C.yellow}">O</span><span style="color:${C.teal}">V</span></span>${ar(BRAND.ar)}</span></span>
  <span class="place">${ic('location_on')}Cairo</span>
</header>
<section class="wrap hello"><h1>${BRAND.tagline}</h1>${ar(BRAND.taglineAr)}</section>
<nav class="tabs" aria-label="Menu categories"><div class="wrap tabs-in">${CATEGORIES.map((c) => `<a class="tab" href="#${c.id}" style="${vars(c.color)}"><i aria-hidden="true"></i>${c.en}</a>`).join('')}</div></nav>
<div class="wrap board">${CATEGORIES.map(cat).join('')}</div>
<footer class="ft">Prices in ${BRAND.currency} · Order at the counter</footer>`;
