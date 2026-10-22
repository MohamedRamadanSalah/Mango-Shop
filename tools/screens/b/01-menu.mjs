// 01 Menu, Design B "Viewfinder". View-only QR phone menu (390px). Hand-built, no Stitch AI.
// Spec: .stitch/prompts/design-b.md. Tokens + components: ./theme.mjs (do not edit it from here).
// Icons are Material Symbols placeholders; `stitch-icons apply` swaps them for MingCute.
//
// Scroll rhythm (fields alternate tinted / white):
//   intro "Today in focus" (white, swipe carousel) > signatures (yellow) > cubes (white)
//   > smoothies (purple) > juices (white, compact rows) > seasonal (coral) > how to order (white)

import {
  BRAND, drinksIn, ic, ar, cube, T, cat,
  topBar, catRail, framedPhoto, viewfinder, price, names, tile, row, secHead, brandLockup, railSpyScript,
  fonts, colors, baseCss,
} from './theme.mjs';

export { fonts, colors, baseCss };
export const file = '01-menu';
export const title = 'Menu';

const DETAIL = '02-drink-detail.html';
const pad2 = (n) => String(n).padStart(2, '0');

// ---------- local cards ----------

// Signature tile: like theme tile(), but purple brackets (yellow ones vanish on the yellow photos).
const sigTile = (d) => `
<a class="tile" href="${DETAIL}">
  ${framedPhoto(d, { ratio: '1/1', radius: 18, vfColor: 'purple', vf: { inset: 8, size: 18, stroke: 3 } })}
  <div class="tile-body">${names(d, { size: 16 })}</div>
  <div class="tile-foot">${price(d.price, { chip: true })}</div>
</a>`;

// Wide signature tile spanning both grid columns: photo left (4/5), text right.
const wideTile = (d, badge) => `
<a class="wide" href="${DETAIL}">
  ${framedPhoto(d, { ratio: '4/5', radius: 18, vfColor: 'purple', vf: { inset: 8, size: 18, stroke: 3 } })}
  <div class="wide-body">
    ${badge}
    ${names(d, { size: 20 })}
    <div class="wide-foot">${price(d.price, { chip: true, size: 'lg' })}</div>
  </div>
</a>`;

// Seasonal tile: taller photo + "Limited" badge above the names.
const seasTile = (d) => `
<a class="tile" href="${DETAIL}">
  ${framedPhoto(d, { ratio: '4/5', radius: 18, vf: { inset: 8, size: 18, stroke: 3 } })}
  <div class="tile-body"><span class="lim">${ic('schedule')}Limited</span>${names(d, { size: 16 })}</div>
  <div class="tile-foot">${price(d.price, { chip: true })}</div>
</a>`;

// ---------- intro: "Today in focus" ----------
const sigs = drinksIn('signatures');

const focusCard = (d, i) => `
<a class="fc" href="${DETAIL}">
  ${framedPhoto(d, { ratio: '4/5', radius: 24, vfColor: 'purple', vf: { inset: 12, size: 26, stroke: 3 } })}
  <div class="fc-body">
    <p class="fc-k"><b>${pad2(i + 1)}</b><span>/${pad2(sigs.length)}</span></p>
    <div class="fc-row">
      <div class="fc-names">${names(d, { size: 21 })}</div>
      ${price(d.price, { chip: true })}
    </div>
  </div>
</a>`;

const intro = `
<section class="intro" aria-labelledby="intro-t">
  <div class="pad">
    <p class="focus-k"><span class="rec" aria-hidden="true"></span>Today in focus</p>
    <h1 id="intro-t" class="intro-t">Your Choice. Your Point Of <mark>View.</mark></h1>
    ${ar(BRAND.taglineAr, 'intro-ar')}
  </div>
  <div class="car" aria-label="${sigs.length} Mango Signatures, swipe sideways">
    ${sigs.map(focusCard).join('')}
  </div>
  <div class="car-foot pad">
    <span class="car-prog" aria-hidden="true"><i class="car-thumb"></i></span>
    <span class="swipe" aria-hidden="true">Swipe${ic('arrow_forward')}</span>
  </div>
</section>`;

// ---------- 1. Mango Signatures ----------
const sig = cat('signatures');
const cocktail = sigs.reduce((a, b) => (b.price > a.price ? b : a)); // priciest = featured wide tile
const signatures = `
<section id="signatures" class="sec field-yellow">
  <div class="pad">
    ${secHead(sig)}
    <div class="grid2">
      ${wideTile(cocktail, `<span class="badge">${ic('auto_awesome')}Four fruits</span>`)}
      ${sigs.filter((d) => d !== cocktail).map(sigTile).join('')}
    </div>
  </div>
</section>`;

// ---------- 2. Fresh Cubes: one wide horizontal feature card ----------
const cubesDrink = drinksIn('cubes')[0];
const cubes = `
<section id="cubes" class="sec">
  <div class="pad">
    ${secHead(cat('cubes'))}
    <a class="feat" href="${DETAIL}">
      <div class="feat-body">
        ${cubesDrink.note ? `<span class="feat-pill">${cube(7, 'orange')}${cubesDrink.note}</span>` : ''}
        <h3 class="nm" style="font-size:24px">${cubesDrink.en}</h3>
        ${ar(cubesDrink.ar, 'nm-ar feat-ar')}
        <div class="feat-foot">${price(cubesDrink.price, { chip: true, size: 'lg' })}<span class="go">${ic('arrow_forward')}</span></div>
      </div>
      ${framedPhoto(cubesDrink, { ratio: '4/5', radius: 20, vf: { inset: 9, size: 20, stroke: 3 } })}
    </a>
  </div>
</section>`;

// ---------- 3. Smoothies & Shakes ----------
const smoothies = `
<section id="smoothies" class="sec field-purple">
  <div class="pad">
    ${secHead(cat('smoothies'))}
    <div class="grid2">${drinksIn('smoothies').map((d) => tile(d, DETAIL)).join('')}</div>
  </div>
</section>`;

// ---------- 4. Fresh Juices: compact rows ----------
const juices = `
<section id="juices" class="sec">
  <div class="pad">
    ${secHead(cat('juices'))}
    <div class="rows">${drinksIn('juices').map((d) => row(d, DETAIL)).join('')}</div>
  </div>
</section>`;

// ---------- 5. Seasonal ----------
const seasonal = `
<section id="seasonal" class="sec field-coral">
  <div class="pad">
    ${secHead(cat('seasonal'))}
    <div class="grid2">${drinksIn('seasonal').map(seasTile).join('')}</div>
  </div>
</section>`;

// ---------- footer: how to order ----------
const STEPS = [
  { t: 'Pick your drink', s: 'Every card shows the price in EGP.', i: 'check_circle' },
  { t: 'Tell the cashier its name', s: 'English or Arabic, both are on the card.', i: 'chat_bubble' },
  { t: 'Watch it made fresh', s: 'Right in front of you, at the counter.', i: 'visibility' },
];
const footer = `
<footer class="foot">
  <div class="pad">
    <div class="how">
      ${viewfinder('purple', { inset: 10, size: 24, stroke: 3 })}
      <p class="how-k">${cube(8, 'purple')}At the counter</p>
      <h2 class="how-t">How to order</h2>
      <ol class="steps">
        ${STEPS.map((s, i) => `
        <li class="step">
          <span class="st-n">${i + 1}</span>
          <span class="st-txt"><span class="st-t">${s.t}</span><span class="st-s">${s.s}</span></span>
          ${ic(s.i, 'st-i')}
        </li>`).join('')}
      </ol>
    </div>
    <div class="foot-brand">
      ${brandLockup()}
      <p class="foot-en">${BRAND.tagline}</p>
      ${ar(BRAND.taglineAr, 'foot-ar')}
      <p class="foot-meta"><span>${ic('location_on')}Cairo</span><span>${ic('info')}Prices in ${BRAND.currency}</span></p>
    </div>
  </div>
</footer>`;

export const body = `${topBar()}${catRail('signatures')}${intro}${signatures}${cubes}${smoothies}${juices}${seasonal}${footer}${railSpyScript}`;

// ---------- CSS (screen only; tokens from theme) ----------
export const css = `
/* sections */
.sec{padding:34px 0 38px}
.rows{margin-top:-4px}

/* intro */
.intro{padding:22px 0 30px;timeline-scope:--car}
.focus-k{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.purpleDeep}}
.rec{width:8px;height:8px;border-radius:50%;background:${T.coral};box-shadow:0 0 0 3px ${T.coralTint}}
.intro-t{margin-top:10px;font-size:32px;font-weight:700;letter-spacing:-.03em;line-height:1.08;color:${T.ink}}
.intro-t mark{color:inherit;padding:0 .08em;margin:0 -.04em;background:linear-gradient(transparent 56%, ${T.yellow} 56%, ${T.yellow} 90%, transparent 90%);-webkit-box-decoration-break:clone;box-decoration-break:clone}
.intro-ar{display:block;margin-top:8px;text-align:left;font-size:17px;font-weight:600;line-height:1.5;color:${T.muted}}

/* carousel */
.car{display:flex;gap:12px;margin-top:20px;padding:0 20px 2px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:20px;overscroll-behavior-x:contain;scrollbar-width:none;-ms-overflow-style:none;scroll-timeline:--car x}
.car::-webkit-scrollbar{display:none}
.fc{flex:0 0 78%;min-width:0;scroll-snap-align:start;display:block}
.fc:active .fp{transform:scale(.985)}
.fc .fp{transition:transform .12s ease}
.fc-body{padding:12px 2px 0}
.fc-k{font-size:12px;font-weight:600;letter-spacing:.08em;font-variant-numeric:tabular-nums;color:${T.muted}}
.fc-k b{font-weight:700;color:${T.purpleDeep}}
.fc-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-top:4px}
.fc-names{min-width:0}
.fc-row .price{margin-top:1px}
.car-foot{display:flex;align-items:center;justify-content:space-between;margin-top:16px}
.car-prog{position:relative;display:block;width:88px;height:4px;border-radius:4px;background:${T.hair};overflow:hidden}
.car-thumb{position:absolute;left:0;top:0;bottom:0;width:20%;border-radius:4px;background:${T.purple};animation:car-p linear both;animation-timeline:--car}
@keyframes car-p{to{transform:translateX(400%)}}
.swipe{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:${T.muted}}
.swipe .ico{font-size:17px;color:${T.purpleDeep}}

/* signatures: wide featured tile */
.wide{grid-column:1 / -1;display:flex;gap:14px;padding:8px;border-radius:24px;background:#fff;border:1px solid ${T.hair};transition:transform .12s ease}
.wide:active{transform:scale(.98)}
.wide .fp{width:46%;flex-shrink:0}
.wide-body{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding:8px 6px 4px 0}
.badge{display:inline-flex;align-items:center;gap:5px;height:26px;margin-bottom:12px;padding:0 10px 0 8px;border-radius:999px;background:${T.purpleTint};color:${T.purpleDeep};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.badge .ico{font-size:15px}
.wide-foot{margin-top:auto;padding-top:12px}

/* fresh cubes: horizontal feature */
.feat{display:flex;align-items:stretch;gap:6px;padding:8px;border-radius:28px;background:${T.orangeTint};transition:transform .12s ease}
.feat:active{transform:scale(.98)}
.feat .fp{width:48%;flex-shrink:0;background:#fff!important}
.feat-body{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding:14px 8px 6px 12px}
.feat-pill{display:inline-flex;align-items:center;gap:7px;height:26px;margin-bottom:12px;padding:0 11px 0 10px;border-radius:999px;background:#fff;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.orangeDeep}}
.feat-ar{font-size:16px}
.feat-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;margin-top:auto;padding-top:14px}
.go{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:14px;background:${T.ink};color:#fff}
.go .ico{font-size:20px}

/* seasonal */
.lim{display:inline-flex;align-items:center;gap:4px;height:24px;margin-bottom:8px;padding:0 9px 0 7px;border-radius:999px;background:${T.coralTint};color:${T.coralDeep};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.lim .ico{font-size:14px}

/* footer: how to order */
.foot{padding:34px 0 40px}
.how{position:relative;padding:28px 24px 22px;border-radius:28px;background:${T.mist}}
.how-k{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.purpleDeep}}
.how-t{margin-top:8px;font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:${T.ink}}
.steps{list-style:none;margin:18px 0 0;padding:0}
.step{position:relative;display:flex;align-items:center;gap:14px;padding:10px 0}
.step:not(:last-child)::after{content:'';position:absolute;left:17px;top:50px;bottom:-12px;border-left:2px dashed #D9CFE6}
.st-n{display:grid;place-items:center;width:36px;height:36px;flex-shrink:0;border-radius:12px;background:${T.yellow};color:${T.ink};font-size:16px;font-weight:700;font-variant-numeric:tabular-nums}
.st-txt{flex:1;min-width:0;display:flex;flex-direction:column}
.st-t{font-size:16px;font-weight:600;letter-spacing:-.01em;line-height:1.25;color:${T.ink}}
.st-s{margin-top:2px;font-size:12.5px;line-height:1.35;color:${T.muted}}
.st-i{font-size:22px;color:${T.purpleDeep}}
.foot-brand{display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:34px}
.foot-en{margin-top:16px;font-size:15px;font-weight:600;letter-spacing:-.01em;color:${T.ink}}
.foot-ar{margin-top:4px;font-size:16px;font-weight:600;line-height:1.5;color:${T.purpleDeep}}
.foot-meta{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 16px;margin-top:16px;font-size:12.5px;color:${T.muted}}
.foot-meta span{display:inline-flex;align-items:center;gap:4px}
.foot-meta .ico{font-size:16px;color:${T.coralDeep}}

@media (prefers-reduced-motion: reduce){
  .fc:active .fp,.wide:active,.feat:active{transform:none}
}
`;
