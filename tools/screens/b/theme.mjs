// Design B "Viewfinder": shared tokens and components. Full spec: .stitch/prompts/design-b.md
// Idea: "Point Of View" as a camera viewfinder. Every photo is framed by four L-shaped corner brackets.
// DO:   clean white canvas (#FFF) with soft tinted category fields; straight photos, radius 24, tint backdrop;
//       straight prices ("95" + small "EGP", 700 tabular) on a mango-yellow chip with ink text;
//       sticky top bar + sticky category rail (plain #anchors, optional scroll-spy); 2-col grid + list rows;
//       Readex Pro only, headings 700 / -0.02em, labels 600 uppercase .08em; EN first, AR directly under.
// DO:   coloured text only in the *Deep tones (AA). Yellow/teal are fills, never text on white.
//       Tap targets >= 44px. Works with JS off. prefers-reduced-motion: no animation. Light only.
// DON'T: rotation, sticker tags, confetti/floating cubes, tilted drop-shadow cards (that is Design A),
//       dark backgrounds, new Arabic text (only strings from shared.mjs via ar()), inline SVG icons
//       (use ic('<material name>') placeholders), local photo paths (only photo(id)).
// Cubes (rounded diamonds) appear only as small markers: category dots, kickers, the logo.

import { BRAND, CATEGORIES, DRINKS, drink, drinksIn, photo, ic, ar, cube } from '../shared.mjs';

export { BRAND, CATEGORIES, DRINKS, drink, drinksIn, photo, ic, ar, cube };

export const fonts = 'family=Readex+Pro:wght@300..700';

// ---------- tokens ----------
// Deep tones checked for WCAG AA (>= 4.5:1) on white and on their own tint.
export const T = {
  canvas: '#FFFFFF', mist: '#F7F4FB', ink: '#2A1640', muted: '#6B5F7B', hair: '#ECE6F2',
  purple: '#7243AB', yellow: '#F9CD18', orange: '#F7941D', teal: '#17AE9D', coral: '#F2654A',
  yellowTint: '#FFF4C2', orangeTint: '#FFE9D1', purpleTint: '#EFE7F9', tealTint: '#DDF4F0', coralTint: '#FDE4DD',
  yellowDeep: '#7A5D00', orangeDeep: '#A65200', purpleDeep: '#5B3290', tealDeep: '#0A7064', coralDeep: '#B23B25',
};
export const colors = T;

const TONES = ['yellow', 'orange', 'purple', 'teal', 'coral'];
export const tone = (color) => ({ base: T[color], tint: T[`${color}Tint`], deep: T[`${color}Deep`] });

export const cat = (id) => CATEGORIES.find((c) => c.id === id);
export const catOf = (d) => cat(d.cat);

// Layout constants shared by the CSS and the scroll-spy (px).
const BAR_H = 60; // sticky top bar
const RAIL_H = 66; // sticky category rail under it

// ---------- brand ----------
// Logo mark in CSS (adapted from Design A): purple U-cup outline, four rounded diamonds
// (yellow top, two teal sides, big orange middle) and small orange/teal dots. Scales with font-size.
const gem = (size, color, x, y) =>
  `<i class="cube" style="position:absolute;width:${size}em;height:${size}em;left:${x - size / 2}em;top:${y - size / 2}em;background:${T[color]}"></i>`;
const pip = (color, x, y) =>
  `<i class="mark-dot" style="left:${x}em;top:${y}em;background:${T[color]}"></i>`;
export const logoMark = (px = 40) =>
  `<span class="mark" style="font-size:${px}px" aria-hidden="true"><i class="mark-cup"></i>${gem(0.2, 'yellow', 0.5, 0.3)}${gem(0.165, 'teal', 0.355, 0.45)}${gem(0.165, 'teal', 0.645, 0.45)}${gem(0.25, 'orange', 0.5, 0.64)}${pip('orange', 0.66, 0.02)}${pip('teal', 0.58, 0.1)}${pip('teal', 0.74, 0.09)}${pip('orange', 0.56, 0.18)}${pip('orange', 0.67, 0.17)}${pip('teal', 0.62, 0.25)}</span>`;

// Logo mark + "POV" wordmark (P purple, O yellow, V teal) + Arabic brand name.
export const brandLockup = () =>
  `<span class="lockup">${logoMark(38)}<span class="lockup-txt"><span class="wm"><span style="color:${T.purple}">P</span><span style="color:${T.yellow}">O</span><span style="color:${T.teal}">V</span></span>${ar(BRAND.ar, 'lockup-ar')}</span></span>`;

// Sticky header. `back: true` swaps the lockup for a 44px back button to the menu.
export const topBar = ({ back = false } = {}) => `
<header class="topbar">
  ${back
    ? `<a class="tb-back" href="01-menu.html" aria-label="Back to menu">${ic('arrow_back')}</a>`
    : brandLockup()}
  <span class="place">${ic('location_on')}Cairo</span>
</header>`;

// Sticky category rail. Plain anchors (`#id`, or `${href}#id`), works without JS.
// Colours are passed as CSS vars so the scroll-spy can move `.on` between chips.
export const catRail = (activeId, { href = '' } = {}) => `
<nav class="rail" aria-label="Menu categories">
  <div class="rail-in">
    ${CATEGORIES.map((c) => {
      const t = tone(c.color);
      const on = c.id === activeId;
      const n = drinksIn(c.id).length;
      return `<a class="chip${on ? ' on' : ''}" href="${href}#${c.id}" style="--c:${t.base};--t:${t.tint};--d:${t.deep}"${on ? ' aria-current="true"' : ''}>${cube(9, c.color)}<span class="chip-txt"><span class="chip-en">${c.en}<span class="chip-n">${n}<span class="sr"> ${n === 1 ? 'drink' : 'drinks'}</span></span></span>${ar(c.ar, 'chip-ar')}</span></a>`;
    }).join('')}
  </div>
</nav>`;

// ---------- viewfinder + photos ----------
// B's signature motif: four L-shaped corner brackets in the colour's base tone.
// The parent must be position:relative (.fp already is).
export const viewfinder = (color, { inset = 10, size = 22, stroke = 3 } = {}) =>
  `<span class="vfs" aria-hidden="true" style="--vf:${T[color] || color};--vfi:${inset}px;--vfs:${size}px;--vfw:${stroke}px"><i class="vf vf-tl"></i><i class="vf vf-tr"></i><i class="vf vf-bl"></i><i class="vf vf-br"></i></span>`;

// Photo on its category-tint backdrop, straight, rounded, with viewfinder brackets on top.
// `vf` passes options through to viewfinder() (e.g. smaller brackets on small photos).
// `vfColor` overrides the bracket colour (default: category colour; yellow brackets on yellow
// signature photos are faint, so a screen may pass e.g. 'purple').
export const framedPhoto = (d, { ratio = '1/1', radius = 24, cls = '', vf = {}, vfColor } = {}) => {
  const c = catOf(d).color;
  return `<figure class="fp ${cls}" style="aspect-ratio:${ratio};border-radius:${radius}px;background:${tone(c).tint}"><img src="${photo(d.id)}" alt="${d.en}" loading="lazy"/>${viewfinder(vfColor || c, vf)}</figure>`;
};

// ---------- text pieces ----------
// Straight price, never rotated. `chip: true` = mango-yellow fill with ink text.
export const price = (amount, { size = 'md', chip = false } = {}) =>
  `<span class="price price-${size}${chip ? ' price-chip' : ''}"><b>${amount}</b><small>${BRAND.currency}</small></span>`;

// EN name (h3), AR directly under it, optional English note.
export const names = (d, { size = 17 } = {}) =>
  `<h3 class="nm" style="font-size:${size}px">${d.en}</h3>${ar(d.ar, 'nm-ar')}${d.note ? `<p class="nm-note">${d.note}</p>` : ''}`;

// ---------- cards ----------
// 2-column grid card: framed photo, names, price chip bottom right. One link.
export const tile = (d, href) => `
<a class="tile" href="${href}">
  ${framedPhoto(d, { ratio: '1/1', radius: 18, vf: { inset: 8, size: 18, stroke: 3 } })}
  <div class="tile-body">${names(d, { size: 16 })}</div>
  <div class="tile-foot">${price(d.price, { chip: true })}</div>
</a>`;

// Compact list row: 60px framed square, names, price, chevron. Hairline between rows.
export const row = (d, href) => `
<a class="row" href="${href}">
  ${framedPhoto(d, { ratio: '1/1', radius: 16, cls: 'fp-sm', vf: { inset: 5, size: 11, stroke: 2 } })}
  <div class="row-body">${names(d, { size: 16 })}</div>
  ${price(d.price, { size: 'md' })}
  ${ic('chevron_right', 'row-chev')}
</a>`;

// Section header: kicker "0N · N drinks" (deep tone), EN title, AR title, short base-colour bar.
export const secHead = (c, n = drinksIn(c.id).length) => {
  const t = tone(c.color);
  const i = CATEGORIES.findIndex((x) => x.id === c.id) + 1;
  return `
<header class="sh">
  <p class="sh-k" style="color:${t.deep}">${cube(8, c.color)}${String(i).padStart(2, '0')} · ${n} ${n === 1 ? 'drink' : 'drinks'}</p>
  <h2 class="sh-t">${c.en}</h2>
  ${ar(c.ar, 'sh-ar')}
  <span class="sh-bar" style="background:${t.base}" aria-hidden="true"></span>
</header>`;
};

// ---------- base CSS (replaces shared BASE_CSS for design B) ----------
const fields = TONES.map((c) => `.field-${c}{background:${T[`${c}Tint`]}}`).join('\n');

export const baseCss = `
:root{--bar:${BAR_H}px;--rail:${RAIL_H}px}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{margin:0;background:${T.canvas};color:${T.ink};font-family:'Readex Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.screen{max-width:430px;margin:0 auto;min-height:100vh;position:relative;overflow-x:clip;background:${T.canvas}}
a{color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}
img{display:block;max-width:100%}
h1,h2,h3,p,figure{margin:0}
.ar{font-family:'Readex Pro',sans-serif;unicode-bidi:isolate;display:inline-block;max-width:100%}
.ico{font-size:22px;line-height:1}
.cube{display:inline-block;border-radius:28%;transform:rotate(45deg);flex-shrink:0}
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.pad{padding-left:20px;padding-right:20px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
section[id]{scroll-margin-top:calc(var(--bar) + var(--rail) + 8px)}
${fields}
.field-mist{background:${T.mist}}
a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:3px solid ${T.purple};outline-offset:2px;border-radius:12px}

/* logo mark */
.mark{position:relative;display:inline-block;width:1em;height:1em;flex-shrink:0}
.mark i{display:block}
.mark-cup{position:absolute;left:.15em;top:.4em;width:.7em;height:.56em;border:.065em solid ${T.purple};border-top:0;border-radius:0 0 .24em .24em}
.mark-dot{position:absolute;width:.055em;height:.055em;border-radius:50%}
.lockup{display:inline-flex;align-items:center;gap:8px}
.lockup-txt{display:flex;flex-direction:column;line-height:1}
.wm{font-size:24px;font-weight:700;letter-spacing:-.04em;line-height:1}
.lockup-ar{margin-top:3px;font-size:12px;font-weight:600;color:${T.purpleDeep};line-height:1.1}

/* top bar */
.topbar{position:sticky;top:0;z-index:30;height:var(--bar);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px 0 14px;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid ${T.hair}}
.tb-back{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:${T.mist};color:${T.ink}}
.place{display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px 0 9px;border-radius:999px;background:${T.mist};font-size:13px;font-weight:600;color:${T.ink}}
.place .ico{font-size:17px;color:${T.coralDeep}}

/* category rail */
.rail{position:sticky;top:var(--bar);z-index:25;height:var(--rail);display:flex;align-items:center;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid ${T.hair}}
.rail-in{position:relative;display:flex;gap:6px;width:100%;overflow-x:auto;padding:0 16px;scroll-snap-type:x proximity;scroll-padding:0 16px;scrollbar-width:none;-ms-overflow-style:none}
.rail-in::-webkit-scrollbar{display:none}
.chip{position:relative;display:inline-flex;align-items:center;gap:9px;flex-shrink:0;min-height:50px;padding:6px 14px 8px 12px;border-radius:14px;white-space:nowrap;scroll-snap-align:start;color:${T.ink}}
.chip .cube{width:9px;height:9px;background:var(--c)}
.chip-txt{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15}
.chip-en{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600}
.chip-n{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:${T.mist};font-size:11px;font-weight:600;color:${T.muted};font-variant-numeric:tabular-nums}
.chip-ar{font-size:11.5px;font-weight:500;color:${T.muted};margin-top:2px}
.chip::after{content:'';position:absolute;left:12px;right:12px;bottom:0;height:2px;border-radius:2px;background:var(--c);opacity:0}
.chip.on{background:var(--t)}
.chip.on::after{opacity:1}
.chip.on .chip-en{font-weight:700}
.chip.on .chip-n{background:#fff;color:var(--d)}
.chip.on .chip-ar{color:${T.ink}}

/* viewfinder brackets */
.vfs{position:absolute;inset:0;pointer-events:none;z-index:1}
.vf{position:absolute;display:block;width:var(--vfs);height:var(--vfs);border:0 solid var(--vf)}
.vf-tl{top:var(--vfi);left:var(--vfi);border-top-width:var(--vfw);border-left-width:var(--vfw);border-top-left-radius:calc(var(--vfw) * 2)}
.vf-tr{top:var(--vfi);right:var(--vfi);border-top-width:var(--vfw);border-right-width:var(--vfw);border-top-right-radius:calc(var(--vfw) * 2)}
.vf-bl{bottom:var(--vfi);left:var(--vfi);border-bottom-width:var(--vfw);border-left-width:var(--vfw);border-bottom-left-radius:calc(var(--vfw) * 2)}
.vf-br{bottom:var(--vfi);right:var(--vfi);border-bottom-width:var(--vfw);border-right-width:var(--vfw);border-bottom-right-radius:calc(var(--vfw) * 2)}

/* framed photo */
.fp{position:relative;display:block;width:100%;overflow:hidden;isolation:isolate}
.fp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fp-sm{width:60px;height:60px;flex-shrink:0}

/* price */
.price{display:inline-flex;align-items:baseline;gap:3px;color:${T.ink};line-height:1;white-space:nowrap}
.price b{font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.price small{font-weight:600;letter-spacing:.08em}
.price-sm b{font-size:14px}.price-sm small{font-size:9px}
.price-md b{font-size:17px}.price-md small{font-size:10px}
.price-lg b{font-size:28px}.price-lg small{font-size:12px}
.price-chip{padding:6px 10px;border-radius:12px;background:${T.yellow};color:${T.ink}}

/* names */
.nm{font-weight:700;letter-spacing:-.02em;line-height:1.15;color:${T.ink}}
.nm-ar{display:block;text-align:left;margin-top:2px;font-size:15px;font-weight:500;line-height:1.45;color:${T.muted}}
.nm-note{margin-top:3px;font-size:12.5px;line-height:1.35;color:${T.muted}}

/* tile (2-col grid card) */
.tile{display:flex;flex-direction:column;min-height:44px;padding:8px;border-radius:24px;background:#fff;border:1px solid ${T.hair};transition:transform .12s ease}
.tile:active{transform:scale(.98)}
.tile-body{padding:10px 4px 0}
.tile-foot{display:flex;justify-content:flex-end;margin-top:auto;padding-top:10px}

/* row (compact list) */
.row{display:flex;align-items:center;gap:12px;min-height:72px;padding:8px 0;transition:background-color .12s ease}
.row + .row{border-top:1px solid ${T.hair}}
.row:active{background:${T.mist}}
.row-body{flex:1;min-width:0}
.row-body .nm-ar{font-size:14px;margin-top:1px}
.row-chev{font-size:20px;color:${T.muted};margin-left:-4px}

/* section header */
.sh{display:flex;flex-direction:column;align-items:flex-start;margin-bottom:16px}
.sh-k{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-variant-numeric:tabular-nums}
.sh-k .cube{width:8px;height:8px}
.sh-t{margin-top:8px;font-size:28px;font-weight:700;letter-spacing:-.02em;line-height:1.05;color:${T.ink}}
.sh-ar{margin-top:4px;font-size:17px;font-weight:600;line-height:1.4;color:${T.muted}}
.sh-bar{display:block;width:36px;height:3px;border-radius:3px;margin-top:10px}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
  .tile:active{transform:none}
}
`;

// ---------- optional scroll-spy ----------
// Highlights the rail chip for the section in view and scrolls it into view inside the rail.
// Fails silently; the page is complete without it (rail links are plain anchors).
export const railSpyScript = `<script>(function(){try{
var rail=document.querySelector('.rail-in');if(!rail||!('IntersectionObserver' in window))return;
var chips=[].slice.call(rail.querySelectorAll('.chip')),map={};
chips.forEach(function(a){var h=a.getAttribute('href')||'',i=h.indexOf('#');if(i!==0)return;var id=h.slice(1);if(document.getElementById(id))map[id]=a;});
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function set(a){if(!a||a.classList.contains('on'))return;chips.forEach(function(c){c.classList.remove('on');c.removeAttribute('aria-current');});a.classList.add('on');a.setAttribute('aria-current','true');
var x=Math.max(0,a.offsetLeft-16);try{rail.scrollTo({left:x,behavior:reduce?'auto':'smooth'});}catch(e){rail.scrollLeft=x;}}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(map[e.target.id]);});},{rootMargin:'-${BAR_H + RAIL_H}px 0px -60% 0px',threshold:0});
Object.keys(map).forEach(function(id){io.observe(document.getElementById(id));});
}catch(e){}})();</script>`;
