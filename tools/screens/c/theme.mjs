// Design C "Color Blocks": shared tokens and components. Full spec: .stitch/prompts/design-c.md
// Idea: each menu category is a full-width block in its own logo colour; colour IS the structure.
// Responsive: one page for phone (2-col grid), tablet (3-col) and desktop (5-col, 1200px container).
// DO:   solid logo colours on the blocks and nav chips; white straight cards; one card type everywhere;
//       ink text on yellow/orange/teal/coral, white text only on purple (all >= 4.5:1);
//       EN first, AR directly under it via ar(); works with JS off; Readex Pro only.
// DON'T: decoration (confetti, brackets, rotation, gradients, heavy shadows), dark backgrounds,
//       new Arabic text, inline SVG icons (use ic('<material name>')), local photo paths (use photo(id)).

import { BRAND, CATEGORIES, DRINKS, drink, drinksIn, photo, ic, ar } from '../shared.mjs';

export { BRAND, CATEGORIES, DRINKS, drink, drinksIn, photo, ic, ar };

export const fonts = 'family=Readex+Pro:wght@300..700';

// ---------- tokens ----------
// `on` is the text colour used on top of the solid base colour (checked >= 4.5:1).
// `tealLarge` is a slightly deeper teal for big display text on white (>= 3:1, WCAG large text).
export const T = {
  canvas: '#FFFFFF', ink: '#2A1640', muted: '#6B5F7B', hair: '#ECE6F2', mist: '#F7F4FB',
  purple: '#7243AB', yellow: '#F9CD18', orange: '#F7941D', teal: '#17AE9D', coral: '#F2654A',
  yellowTint: '#FFF4C2', orangeTint: '#FFE9D1', purpleTint: '#EFE7F9', tealTint: '#DDF4F0', coralTint: '#FDE4DD',
  tealLarge: '#10998A',
};
export const colors = T;

const ON = { yellow: T.ink, orange: T.ink, purple: '#FFFFFF', teal: T.ink, coral: T.ink };
export const tone = (color) => ({ base: T[color], tint: T[`${color}Tint`], on: ON[color] });

export const cat = (id) => CATEGORIES.find((c) => c.id === id);
export const catOf = (d) => cat(d.cat);
// CSS custom properties for a category colour: --c base, --t tint, --on text on base.
export const vars = (color) => { const t = tone(color); return `--c:${t.base};--t:${t.tint};--on:${t.on}`; };

const count = (n) => `${n} ${n === 1 ? 'drink' : 'drinks'}`;

// ---------- brand ----------
// Logo mark in CSS (from Design B): purple U-cup, four rounded diamonds, small dots. Scales with font-size.
const gem = (size, color, x, y) =>
  `<i class="gem" style="width:${size}em;height:${size}em;left:${x - size / 2}em;top:${y - size / 2}em;background:${T[color]}"></i>`;
const pip = (color, x, y) => `<i class="pip" style="left:${x}em;top:${y}em;background:${T[color]}"></i>`;
export const logoMark = (px = 40) =>
  `<span class="mark" style="font-size:${px}px" aria-hidden="true"><i class="mark-cup"></i>${gem(0.2, 'yellow', 0.5, 0.3)}${gem(0.165, 'teal', 0.355, 0.45)}${gem(0.165, 'teal', 0.645, 0.45)}${gem(0.25, 'orange', 0.5, 0.64)}${pip('orange', 0.66, 0.02)}${pip('teal', 0.58, 0.1)}${pip('teal', 0.74, 0.09)}${pip('orange', 0.56, 0.18)}${pip('orange', 0.67, 0.17)}${pip('teal', 0.62, 0.25)}</span>`;

export const wordmark = () =>
  `<span class="wm"><span style="color:${T.purple}">P</span><span style="color:${T.yellow}">O</span><span style="color:${T.teal}">V</span></span>`;

export const lockup = () =>
  `<span class="lockup">${logoMark(38)}<span class="lockup-txt">${wordmark()}${ar(BRAND.ar, 'lockup-ar')}</span></span>`;

// Five equal bars in the logo colours, in category order. The only graphic element in C.
export const stripe = () =>
  `<div class="stripe" aria-hidden="true">${CATEGORIES.map((c) => `<i style="background:${T[c.color]}"></i>`).join('')}</div>`;

// Sticky top bar + stripe. `back: true` puts a "Menu" back link left and the lockup in the middle.
export const topBar = ({ back = false } = {}) => `
<header class="topbar">
  <div class="wrap topbar-in">
    ${back ? `<a class="back" href="01-menu.html">${ic('arrow_back')}<span>Menu</span></a><span class="tb-mid">${lockup()}</span>` : lockup()}
    <span class="place">${ic('location_on')}Cairo</span>
  </div>
  ${stripe()}
</header>`;

// ---------- category nav ----------
// Solid chip in the category colour: EN + count on top, AR under it. Plain anchor.
export const chip = (c, { href = '', on = false } = {}) =>
  `<a class="chip${on ? ' on' : ''}" href="${href}#${c.id}" style="${vars(c.color)}"${on ? ' aria-current="true"' : ''}><span class="chip-en">${c.en}<b class="chip-n">${drinksIn(c.id).length}</b></span>${ar(c.ar, 'chip-ar')}</a>`;

export const catNav = ({ href = '', active = '' } = {}) => `
<nav class="cnav" aria-label="Menu categories">
  <div class="wrap cnav-in">${CATEGORIES.map((c) => chip(c, { href, on: c.id === active })).join('')}</div>
</nav>`;

// ---------- cards ----------
export const price = (amount, cls = '') =>
  `<span class="price ${cls}"><b>${amount}</b><small>${BRAND.currency}</small></span>`;

// The one card type. Photo on the category tint, names, price chip in the category colour.
export const card = (d, href) => `
<a class="card" href="${href}" style="${vars(catOf(d).color)}">
  <figure class="ph"><img src="${photo(d.id)}" alt="${d.en}" loading="lazy"/></figure>
  <div class="cm">
    <div class="cb"><h3 class="nm">${d.en}</h3>${ar(d.ar, 'nm-ar')}${d.note ? `<p class="nm-note">${d.note}</p>` : ''}</div>
    <div class="cf">${price(d.price)}</div>
  </div>
</a>`;

// Card grid. `n<count>` lets small sections (1-2 drinks) switch to wide cards on bigger screens.
export const grid = (drinks, href, cls = '') =>
  `<div class="grid n${drinks.length} ${cls}">${drinks.map((d) => card(d, href)).join('')}</div>`;

// Block header: "01 · 5 drinks", EN title, AR title. Text takes the enclosing block's colour.
export const blockHead = (c, { kicker } = {}) => {
  const i = CATEGORIES.findIndex((x) => x.id === c.id) + 1;
  return `
<header class="bh">
  <p class="bh-k">${kicker || `${String(i).padStart(2, '0')}<i></i>${count(drinksIn(c.id).length)}`}</p>
  <h2 class="bh-t">${c.en}</h2>
  ${ar(c.ar, 'bh-ar')}
</header>`;
};

// A full-width colour block for one category. `tint: true` uses the soft tint instead of the solid colour.
// `solo: true` (one-drink sections) puts the header left and the card right on desktop.
export const block = (c, inner, { tint = false, id = c.id, solo = false } = {}) =>
  `<section class="blk${tint ? ' blk-tint' : ''}${solo ? ' blk-solo' : ''}"${id ? ` id="${id}"` : ''} style="${vars(c.color)}"><div class="wrap">${inner}</div></section>`;

export const footer = () => `
<footer class="foot">
  <div class="wrap foot-in">
    ${logoMark(52)}
    ${wordmark()}
    <p class="foot-tag">${BRAND.tagline}</p>
    ${ar(BRAND.taglineAr, 'foot-ar')}
    <p class="foot-note">Fresh mango-first juice, Cairo · Prices in ${BRAND.currency}</p>
  </div>
  ${stripe()}
</footer>`;

// ---------- base CSS (replaces shared BASE_CSS for design C) ----------
const WIDE = `{grid-column:1/-1;flex-direction:row;align-items:stretch;gap:4px}`;
const wideRules = (sel) => `
${sel}${WIDE}
${sel} .ph{width:46%;flex-shrink:0}
${sel} .cb{padding:8px 8px 0 12px}
${sel} .cf{padding:10px 8px 4px 12px}`;

export const baseCss = `
:root{--bar:70px;--nav:76px}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{margin:0;background:${T.canvas};color:${T.ink};font-family:'Readex Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.screen{min-height:100vh;position:relative;overflow-x:clip;background:${T.canvas}}
a{color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}
img{display:block;max-width:100%}
h1,h2,h3,p,figure{margin:0}
.ar{font-family:'Readex Pro',sans-serif;unicode-bidi:isolate;display:block;max-width:100%}
.ico{font-size:22px;line-height:1}
.wrap{width:100%;max-width:1240px;margin:0 auto;padding-left:20px;padding-right:20px}
section[id]{scroll-margin-top:calc(var(--bar) + var(--nav))}
a:focus-visible,button:focus-visible{outline:3px solid ${T.ink};outline-offset:3px;border-radius:14px}

/* logo */
.mark{position:relative;display:inline-block;width:1em;height:1em;flex-shrink:0}
.mark i{display:block;position:absolute}
.mark-cup{left:.15em;top:.4em;width:.7em;height:.56em;border:.065em solid ${T.purple};border-top:0;border-radius:0 0 .24em .24em}
.gem{border-radius:28%;transform:rotate(45deg)}
.pip{width:.055em;height:.055em;border-radius:50%}
.wm{display:block;font-size:24px;font-weight:700;letter-spacing:-.04em;line-height:1}
.lockup{display:inline-flex;align-items:center;gap:8px}
.lockup-txt{display:flex;flex-direction:column;align-items:flex-start;line-height:1}
.lockup-ar{margin-top:3px;font-size:12px;font-weight:600;color:${T.purple};line-height:1.1}

/* top bar + stripe */
.topbar{position:sticky;top:0;z-index:30;background:#fff;border-bottom:3px solid #fff}
.topbar-in{position:relative;height:calc(var(--bar) - 6px);display:flex;align-items:center;justify-content:space-between;gap:12px}
.stripe{display:flex;height:6px}
.stripe i{flex:1}
.place{display:inline-flex;align-items:center;gap:4px;height:34px;padding:0 13px 0 10px;border-radius:999px;background:${T.mist};font-size:13px;font-weight:600}
.place .ico{font-size:17px;color:${T.coral}}
.back{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px 0 10px;border-radius:14px;background:${T.mist};font-size:14px;font-weight:600}
.tb-mid{position:absolute;left:50%;transform:translateX(-50%)}

/* category nav */
.cnav{position:sticky;top:var(--bar);z-index:25;height:var(--nav);display:flex;align-items:center;background:#fff;border-bottom:1px solid ${T.hair}}
.cnav-in{display:flex;gap:8px;overflow-x:auto;padding-top:6px;padding-bottom:6px;scrollbar-width:none;-ms-overflow-style:none;scroll-padding:0 20px}
.cnav-in::-webkit-scrollbar{display:none}
.chip{flex-shrink:0;display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:54px;padding:6px 14px;border-radius:14px;background:var(--c);color:var(--on);white-space:nowrap;transition:box-shadow .15s ease}
.chip-en{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:600;line-height:1.15}
.chip-n{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:rgba(255,255,255,.6);color:${T.ink};font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}
.chip-ar{font-size:12px;font-weight:500;line-height:1.3;text-align:left}
.chip.on{box-shadow:0 0 0 2px #fff,0 0 0 4px ${T.ink}}

/* intro */
.intro{padding-top:26px;padding-bottom:22px}
.tag{font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.08}
.tag-a{color:${T.coral}}
.tag-b{color:${T.tealLarge}}
.tag-ar{margin-top:8px;font-size:19px;font-weight:600;color:${T.purple};line-height:1.4;text-align:left}
.intro-note{margin-top:12px;font-size:14px;color:${T.muted}}

/* colour block */
.blk{background:var(--c);color:var(--on);padding:30px 0 34px}
.blk-tint{background:var(--t);color:${T.ink}}
.bh{margin-bottom:18px}
.bh-k{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-variant-numeric:tabular-nums}
.bh-k i{width:4px;height:4px;border-radius:50%;background:currentColor}
.bh-t{margin-top:6px;font-size:30px;font-weight:700;letter-spacing:-.025em;line-height:1.05}
.bh-ar{margin-top:4px;font-size:19px;font-weight:600;line-height:1.4;text-align:left}

/* grid + card */
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.card{display:flex;flex-direction:column;min-width:0;padding:8px;border-radius:20px;background:#fff;color:${T.ink};transition:transform .12s ease}
.card:active{transform:scale(.98)}
.ph{position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--t)}
.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cm{display:flex;flex-direction:column;flex:1;min-width:0}
.cb{flex:1;padding:10px 4px 0}
.nm{font-size:16px;font-weight:700;letter-spacing:-.015em;line-height:1.2}
.nm-ar{margin-top:3px;font-size:14.5px;font-weight:500;line-height:1.45;color:${T.muted};text-align:left}
.nm-note{margin-top:3px;font-size:12.5px;line-height:1.35;color:${T.muted}}
.cf{display:flex;padding:10px 4px 4px}
.price{display:inline-flex;align-items:baseline;gap:3px;padding:7px 11px;border-radius:12px;background:var(--c);color:var(--on);line-height:1;white-space:nowrap}
.price b{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}
.price small{font-size:10px;font-weight:600;letter-spacing:.08em}

/* wide card: a lone card everywhere, and the odd last card on phones */
${wideRules('.grid>.card:only-child')}
@media (max-width:699px){${wideRules('.grid>.card:last-child:nth-child(odd)')}}

/* footer */
.foot{border-top:1px solid ${T.hair}}
.foot-in{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding-top:40px;padding-bottom:34px}
.foot-in .wm{font-size:30px;margin-top:4px}
.foot-tag{font-size:17px;font-weight:600}
.foot-ar{font-size:17px;font-weight:600;color:${T.purple};text-align:center}
.foot-note{margin-top:6px;font-size:13px;color:${T.muted}}
.foot .stripe{height:10px}

/* tablet */
@media (min-width:700px){
  :root{--nav:84px}
  .wrap{padding-left:32px;padding-right:32px}
  .grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
  .grid>.card:only-child{grid-column:span 2}
  .grid.n2{grid-template-columns:repeat(2,minmax(0,1fr))}
  ${wideRules('.grid.n2>.card')}
  .grid.n2>.card{grid-column:auto}
  .grid.n2 .nm,.grid>.card:only-child .nm{font-size:19px}
  .blk{padding:44px 0 48px}
  .bh{display:flex;align-items:baseline;flex-wrap:wrap;column-gap:16px;margin-bottom:24px}
  .bh-k{flex-basis:100%}
  .bh-t{font-size:38px}
  .bh-ar{font-size:24px}
  .chip{flex:1 0 auto;min-height:60px;padding:8px 16px}
  .tag{font-size:44px}
  .tag-ar{font-size:24px}
  .intro{padding-top:40px;padding-bottom:32px}
}

/* desktop */
@media (min-width:1100px){
  .grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}
  .grid.n2{grid-template-columns:repeat(2,minmax(0,1fr))}
  .grid.n2 .ph,.grid>.card:only-child .ph{width:40%}
  .blk-solo .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:center}
  .blk-solo .bh{margin-bottom:0}
  .blk-solo .grid{grid-template-columns:1fr}
  .blk-solo .grid>.card:only-child{grid-column:1/-1}
  .cnav-in{overflow:visible}
  .chip{flex:1 1 0}
  .bh-t{font-size:44px}
  .tag{font-size:52px}
  .card{transition:transform .15s ease,box-shadow .15s ease}
  .card:hover{transform:translateY(-3px);box-shadow:0 14px 30px -22px rgba(42,22,64,.55)}
}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
  .card:active,.card:hover{transform:none}
}
`;

// ---------- optional scroll-spy ----------
// Rings the nav chip of the block in view and scrolls it into view inside the nav (phones).
// Fails silently; the page is complete without it (nav links are plain anchors).
export const navSpyScript = `<script>(function(){try{
var nav=document.querySelector('.cnav-in');if(!nav||!('IntersectionObserver' in window))return;
var chips=[].slice.call(nav.querySelectorAll('.chip')),map={};
chips.forEach(function(a){var h=a.getAttribute('href')||'';if(h.charAt(0)!=='#')return;var id=h.slice(1);if(document.getElementById(id))map[id]=a;});
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function set(a){if(!a||a.classList.contains('on'))return;chips.forEach(function(c){c.classList.remove('on');c.removeAttribute('aria-current');});a.classList.add('on');a.setAttribute('aria-current','true');
if(nav.scrollWidth>nav.clientWidth){var x=Math.max(0,a.offsetLeft-20);try{nav.scrollTo({left:x,behavior:reduce?'auto':'smooth'});}catch(e){nav.scrollLeft=x;}}}
var top=document.querySelector('.cnav').getBoundingClientRect().bottom;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(map[e.target.id]);});},{rootMargin:'-'+Math.round(top)+'px 0px -55% 0px',threshold:0});
Object.keys(map).forEach(function(id){io.observe(document.getElementById(id));});
}catch(e){}})();</script>`;
