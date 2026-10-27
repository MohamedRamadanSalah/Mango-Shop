// Concept C2 "Pick a Flavour" (draft for the client's option C). Responsive, view-only.
// Idea: a purple welcome area where the 5 categories are big photo tiles (step 1: pick a category),
// then each category is a shelf of large drink photos (swipe on phones, grid on a computer).
// Logo colours: purple hero, every tile and shelf in its category colour (tint + solid accents).

import { C, BRAND, CATEGORIES, drinksIn, photo, ic, ar, logoMark, MARK_CSS } from '../shared.mjs';

export const file = '01-menu';
export const title = 'Menu';

const ON = { yellow: C.ink, orange: C.ink, purple: '#fff', teal: C.ink, coral: C.ink };
const vars = (color) => `--c:${C[color]};--t:${C[`${color}Soft`]};--on:${ON[color]}`;

export const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{margin:0;background:#fff;color:${C.ink};font-family:'Readex Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.screen{min-height:100vh;overflow-x:clip}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
h1,h2,h3,p,figure{margin:0}
.ar{font-family:'Readex Pro',sans-serif;unicode-bidi:isolate;display:block}
.ico{font-size:20px;line-height:1}
${MARK_CSS}
.wrap{max-width:1200px;margin:0 auto;padding:0 20px}
section[id]{scroll-margin-top:16px}
`;

export const css = `
/* hero */
.hero{background:${C.purple};color:#fff;border-radius:0 0 32px 32px;padding-bottom:22px}
.hd{display:flex;align-items:center;justify-content:space-between;padding-top:16px}
.brand{display:flex;align-items:center;gap:12px}
.brand .mark{background:#fff;border-radius:14px;box-shadow:0 0 0 7px #fff}
.wm{font-size:26px;font-weight:700;letter-spacing:-.04em;line-height:1}
.brand .ar{margin-top:2px;font-size:13px;font-weight:600;color:#E6DAF6}
.place{display:inline-flex;align-items:center;gap:4px;height:34px;padding:0 12px 0 9px;border-radius:999px;background:rgba(255,255,255,.14);font-size:13px;font-weight:600}
.hi{padding-top:26px}
.hi h1{font-size:32px;font-weight:700;letter-spacing:-.03em;line-height:1.08}
.hi h1 span{color:${C.yellow}}
.hi .ar{margin-top:8px;font-size:18px;font-weight:500;color:#E6DAF6}
.pick{margin-top:22px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.yellow}}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.tile{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:190px;padding:12px 14px 14px;border-radius:22px;background:var(--t);color:${C.ink};overflow:hidden}
.tile:first-child{grid-column:1/-1;min-height:170px}
.tile img{position:absolute;right:-10px;top:-10px;width:62%;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:50%}
.tile:first-child img{width:44%;top:auto;bottom:-14px;right:-6px}
.tile-txt{position:relative;z-index:1}
.tile:first-child .tile-txt{max-width:56%}
.tile b{display:block;font-size:16px;font-weight:700;line-height:1.15}
.tile .ar{margin-top:3px;font-size:13px;font-weight:500;color:${C.muted};text-align:left}
.cnt{position:absolute;left:12px;top:12px;display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 8px;border-radius:999px;background:var(--c);color:var(--on);font-size:13px;font-weight:700}

/* shelves */
.shelf{padding-top:34px}
.sh{margin-bottom:14px}
.sh h2{display:flex;align-items:center;gap:10px;font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.sh h2 i{width:16px;height:16px;border-radius:28%;transform:rotate(45deg);background:var(--c);flex-shrink:0}
.sh .ar{margin-top:4px;padding-left:26px;font-size:17px;font-weight:600;color:${C.muted};text-align:left}
.row{display:grid;grid-auto-flow:column;grid-auto-columns:64%;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -20px;padding:0 20px 6px;scroll-padding:0 20px;scrollbar-width:none}
.row::-webkit-scrollbar{display:none}
.item{scroll-snap-align:start}
.ph{aspect-ratio:4/5;border-radius:26px;overflow:hidden;background:var(--t)}
.ph img{width:100%;height:100%;object-fit:cover}
.it{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:10px 4px 0}
.it h3{font-size:16px;font-weight:700;line-height:1.2}
.it .ar{margin-top:2px;font-size:14.5px;font-weight:500;color:${C.muted};text-align:left}
.it .note{margin-top:2px;font-size:12px;color:${C.muted}}
.pr{flex-shrink:0;display:inline-flex;align-items:baseline;gap:3px;padding:6px 10px;border-radius:12px;background:var(--c);color:var(--on);font-weight:700;line-height:1}
.pr b{font-size:16px}.pr small{font-size:10px;letter-spacing:.06em}
.ft{margin-top:40px;padding:26px 0 34px;text-align:center;color:${C.muted};font-size:13px;border-top:1px solid #EEE7F5}

@media (min-width:760px){
  .hero{border-radius:0 0 48px 48px;padding-bottom:36px}
  .hi h1{font-size:52px}
  .hi .ar{font-size:24px}
  .tiles{grid-template-columns:repeat(5,minmax(0,1fr))}
  .tile,.tile:first-child{grid-column:auto;min-height:210px}
  .tile img,.tile:first-child img{width:66%;right:-12px;bottom:auto;top:-12px}
  .tile:first-child .tile-txt{max-width:none}
  .row{grid-auto-flow:row;grid-template-columns:repeat(4,minmax(0,1fr));overflow:visible;margin:0;padding:0}
  .shelf{padding-top:48px}
}
@media (min-width:1100px){.row{grid-template-columns:repeat(5,minmax(0,1fr))}}
`;

const tile = (c) => {
  const list = drinksIn(c.id);
  return `<a class="tile" href="#${c.id}" style="${vars(c.color)}"><span class="cnt">${list.length}</span><img src="${photo(list[0].id)}" alt=""/><span class="tile-txt"><b>${c.en}</b>${ar(c.ar)}</span></a>`;
};

const item = (d) => `
<div class="item">
  <figure class="ph"><img src="${photo(d.id)}" alt="${d.en}" loading="lazy"/></figure>
  <div class="it"><div><h3>${d.en}</h3>${ar(d.ar)}${d.note ? `<p class="note">${d.note}</p>` : ''}</div><span class="pr"><b>${d.price}</b><small>${BRAND.currency}</small></span></div>
</div>`;

const shelf = (c) => `
<section class="wrap shelf" id="${c.id}" style="${vars(c.color)}">
  <header class="sh"><h2><i aria-hidden="true"></i>${c.en}</h2>${ar(c.ar)}</header>
  <div class="row">${drinksIn(c.id).map(item).join('')}</div>
</section>`;

export const body = `
<header class="hero">
  <div class="wrap">
    <div class="hd">
      <span class="brand">${logoMark(40)}<span><span class="wm"><span>P</span><span style="color:${C.yellow}">O</span><span style="color:#5FE0D0">V</span></span>${ar(BRAND.ar)}</span></span>
      <span class="place">${ic('location_on')}Cairo</span>
    </div>
    <div class="hi"><h1>Your Choice. <span>Your Point Of View.</span></h1>${ar(BRAND.taglineAr)}</div>
    <p class="pick">Pick a flavour</p>
    <nav class="tiles" aria-label="Menu categories">${CATEGORIES.map(tile).join('')}</nav>
  </div>
</header>
${CATEGORIES.map(shelf).join('')}
<footer class="ft">Prices in ${BRAND.currency} · Order at the counter</footer>`;
