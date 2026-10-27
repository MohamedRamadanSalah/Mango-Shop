// Concept C3 "Cubes" (draft for the client's option C). Responsive, view-only.
// Idea: the logo is the design. Every drink photo sits in a rounded diamond (the logo's mango cube)
// with a second cube in the category colour behind it. The categories are five big cubes at the top.
// Sections alternate white and a light tint. Centered, calm, gallery-like.

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
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
section[id]{scroll-margin-top:10px}
`;

export const css = `
/* header */
.top{display:flex;justify-content:flex-end;padding-top:14px}
.place{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:${C.muted}}
.place .ico{color:${C.coral}}
.hd{display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:4px}
.wm{margin-top:8px;font-size:34px;font-weight:700;letter-spacing:-.04em;line-height:1}
.hd .wm-ar{margin-top:2px;font-size:15px;font-weight:600;color:${C.purple}}
.tag{margin-top:14px;font-size:20px;font-weight:700;letter-spacing:-.02em;line-height:1.2}
.tag .a{color:${C.coral}}.tag .b{color:#10998A}
.hd .tag-ar{margin-top:4px;font-size:16px;font-weight:600;color:${C.purple}}

/* category cubes */
.cubes{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin-top:26px;padding-bottom:26px}
.cb{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;min-height:44px}
.cb i{width:42px;height:42px;margin:6px 0 2px;border-radius:28%;transform:rotate(45deg);background:var(--c);display:grid;place-items:center}
.cb i b{transform:rotate(-45deg);font-style:normal;font-size:14px;font-weight:700;color:var(--on)}
.cb span{font-size:11.5px;font-weight:600;line-height:1.2}
.cb .ar{margin-top:2px;font-size:11px;font-weight:500;color:${C.muted}}

/* sections */
.sec{padding:34px 0 38px}
.sec:nth-of-type(odd){background:var(--t)}
.sh{text-align:center;margin-bottom:22px}
.sh i{display:inline-block;width:14px;height:14px;border-radius:28%;transform:rotate(45deg);background:var(--c)}
.sh h2{margin-top:10px;font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.sh .ar{margin-top:4px;font-size:18px;font-weight:600;color:${C.muted}}
.gal{display:flex;flex-wrap:wrap;justify-content:center;gap:26px 12px}
.it{width:calc(50% - 7px);display:flex;flex-direction:column;align-items:center;text-align:center}
/* photo in a rounded diamond, with a colour cube behind it (the logo's stacked cubes) */
.dia{position:relative;width:74%;aspect-ratio:1/1;margin:12% 0 14%}
.dia::before{content:'';position:absolute;inset:0;border-radius:24%;transform:translate(9%,9%) rotate(45deg);background:var(--c)}
.dia .win{position:absolute;inset:0;border-radius:24%;transform:rotate(45deg);overflow:hidden;background:#fff;box-shadow:0 0 0 4px #fff}
.dia img{position:absolute;left:50%;top:50%;width:142%;height:142%;max-width:none;object-fit:cover;transform:translate(-50%,-50%) rotate(-45deg)}
.it h3{font-size:15.5px;font-weight:700;line-height:1.2}
.it .ar{margin-top:2px;font-size:14px;font-weight:500;color:${C.muted}}
.it .note{margin-top:2px;font-size:12px;color:${C.muted}}
.pr{margin-top:8px;display:inline-flex;align-items:baseline;gap:3px;padding:6px 11px;border-radius:999px;background:var(--c);color:var(--on);font-weight:700;line-height:1}
.pr b{font-size:16px}.pr small{font-size:10px;letter-spacing:.06em}
.ft{display:flex;flex-direction:column;align-items:center;gap:8px;padding:30px 0 36px;color:${C.muted};font-size:13px}

@media (min-width:760px){
  .tag{font-size:34px}
  .hd .tag-ar{font-size:22px}
  .cubes{max-width:760px;margin-left:auto;margin-right:auto}
  .cb i{width:58px;height:58px}
  .cb span{font-size:14px}
  .cb .ar{font-size:13px}
  .sec{padding:56px 0 60px}
  .sh h2{font-size:36px}
  .sh .ar{font-size:22px}
  .it{width:calc(33.333% - 10px)}
  .it h3{font-size:17px}
}
@media (min-width:1100px){
  .gal{gap:30px 18px}
  .it{width:calc(20% - 16px)}
}
`;

const item = (d) => `
<div class="it">
  <figure class="dia"><span class="win"><img src="${photo(d.id)}" alt="${d.en}" loading="lazy"/></span></figure>
  <h3>${d.en}</h3>${ar(d.ar)}${d.note ? `<p class="note">${d.note}</p>` : ''}
  <span class="pr"><b>${d.price}</b><small>${BRAND.currency}</small></span>
</div>`;

const sec = (c) => `
<section class="sec" id="${c.id}" style="${vars(c.color)}">
  <div class="wrap">
    <header class="sh"><i aria-hidden="true"></i><h2>${c.en}</h2>${ar(c.ar)}</header>
    <div class="gal">${drinksIn(c.id).map(item).join('')}</div>
  </div>
</section>`;

export const body = `
<div class="wrap top"><span class="place">${ic('location_on')}Cairo</span></div>
<header class="wrap hd">
  ${logoMark(76)}
  <span class="wm"><span style="color:${C.purple}">P</span><span style="color:${C.yellow}">O</span><span style="color:${C.teal}">V</span></span>
  ${ar(BRAND.ar, 'wm-ar')}
  <h1 class="tag"><span class="a">Your Choice.</span> <span class="b">Your Point Of View.</span></h1>
  ${ar(BRAND.taglineAr, 'tag-ar')}
</header>
<nav class="wrap cubes" aria-label="Menu categories">${CATEGORIES.map((c) => `<a class="cb" href="#${c.id}" style="${vars(c.color)}"><i><b>${drinksIn(c.id).length}</b></i><span>${c.en}${ar(c.ar)}</span></a>`).join('')}</nav>
${CATEGORIES.map(sec).join('')}
<footer class="ft">${logoMark(36)}Prices in ${BRAND.currency} · Order at the counter</footer>`;
