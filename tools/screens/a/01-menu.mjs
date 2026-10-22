// 01 Menu: the QR phone menu (view-only). Hand-built, no Stitch AI.
// Icons are Material Symbols placeholders; `stitch-icons apply` swaps them for MingCute.

import { C, BRAND, CATEGORIES, drinksIn, photo, ic, ar, cube, dot, priceTag, wordmark } from '../shared.mjs';

export const file = '01-menu';
export const title = 'Menu';

const DETAIL = '02-drink-detail.html';
const cat = (id) => CATEGORIES.find((c) => c.id === id);
const soft = (color) => C[`${color}Soft`];

// ---------- local pieces ----------

// The logo mark drawn in CSS: purple cup, four rounded diamond cubes, sprinkle dots. Scales with font-size.
const gem = (size, color, x, y) =>
  `<i class="cube" style="position:absolute;width:${size}em;height:${size}em;left:${x - size / 2}em;top:${y - size / 2}em;background:${C[color]}"></i>`;
const pip = (color, x, y) =>
  `<i class="dot" style="position:absolute;width:.055em;height:.055em;left:${x}em;top:${y}em;background:${C[color]}"></i>`;
const logoMark = (px = 48, cls = '') => `
<span class="mark ${cls}" style="font-size:${px}px" aria-hidden="true">
  <i class="mark-cup"></i>
  ${gem(0.2, 'yellow', 0.5, 0.3)}${gem(0.165, 'teal', 0.355, 0.45)}${gem(0.165, 'teal', 0.645, 0.45)}${gem(0.25, 'orange', 0.5, 0.64)}
  ${pip('orange', 0.66, 0.02)}${pip('teal', 0.58, 0.1)}${pip('teal', 0.74, 0.09)}${pip('orange', 0.56, 0.18)}${pip('orange', 0.67, 0.17)}${pip('teal', 0.62, 0.25)}
</span>`;

// A cube or dot that floats/tumbles. Wrapper animates so the cube keeps its own 45deg turn.
const fall = (shape, style, delay = 0, dur = 6) =>
  `<span class="fall" style="${style};animation-delay:-${delay}s;animation-duration:${dur}s">${shape}</span>`;

const drinkName = (d, size = 17) => `
<h3 class="dn" style="font-size:${size}px">${d.en}</h3>
${ar(d.ar, 'dn-ar')}`;

const note = (d) => (d.note ? `<p class="note">${d.note}</p>` : '');

const sectionHead = (c, count, extra = '') => `
<div class="sec-head z">
  <div class="min-w-0">
    <span class="count" style="background:${soft(c.color)}">${cube(9, c.color)}${count} ${count === 1 ? 'drink' : 'drinks'}</span>
    <h2 class="sec-title"><span style="background-image:linear-gradient(transparent 62%, ${soft(c.color)} 62%)">${c.en}</span></h2>
    ${ar(c.ar, 'sec-ar')}
  </div>
  <div class="sec-gems" aria-hidden="true">
    ${cube(22, c.color, 'position:absolute;right:4px;top:6px')}
    ${cube(13, c.color === 'purple' ? 'yellow' : 'purple', 'position:absolute;right:34px;top:2px')}
    ${dot(7, c.color === 'teal' ? 'orange' : 'teal', 'position:absolute;right:28px;top:30px')}
  </div>
  ${extra}
</div>`;

// ---------- hero ----------
const hero = `
<header class="hero">
  <div class="hero-top z">
    <a class="brand" href="#top" aria-label="${BRAND.name} home">
      ${logoMark(46)}
      <span class="flex flex-col">${wordmark(30)}${ar(BRAND.ar, 'brand-ar')}</span>
    </a>
    <span class="place">${ic('location_on')}Cairo</span>
  </div>

  <h1 class="tagline z">
    <span style="color:${C.coral}">Your</span> <span style="color:${C.orange}">Choice.</span><br/>
    <span style="color:${C.teal}">Your Point</span><br/>
    <span style="color:${C.teal}">Of View.</span>
  </h1>
  ${ar(BRAND.taglineAr, 'tagline-ar z')}

  <div class="stage">
    <span class="stage-diamond"></span>
    <span class="stage-diamond two"></span>
    <div class="hero-photo">
      <img src="${photo('hero')}" alt="POV mango drinks"/>
    </div>
    <span class="hero-sticker">${ic('auto_awesome')}Mango first</span>
    ${fall(cube(30, 'orange'), 'left:22px;top:30px', 0, 7)}
    ${fall(cube(18, 'teal'), 'left:70px;top:132px', 2, 6)}
    ${fall(cube(14, 'yellow'), 'right:10px;top:8px', 1, 5)}
    ${fall(cube(24, 'coral'), 'right:-6px;top:236px', 3, 8)}
    ${fall(cube(12, 'purple'), 'left:34px;top:226px', 4, 6)}
    ${fall(dot(9, 'teal'), 'right:56px;top:-4px', 1.5, 5)}
    ${fall(dot(7, 'orange'), 'right:30px;top:20px', 3, 6)}
    ${fall(dot(8, 'coral'), 'left:96px;top:66px', 2.5, 7)}
    ${fall(dot(6, 'teal'), 'left:14px;top:180px', 0.5, 5)}

    <a class="pick" href="${DETAIL}">
      <span class="pick-label">${ic('star', '', true)}Our signature</span>
      <span class="pick-name">POV Mango</span>
      ${ar(drinksIn('signatures')[0].ar, 'pick-ar')}
      ${priceTag(drinksIn('signatures')[0].price, { rotate: -6, cls: 'pick-price' })}
    </a>
  </div>
</header>`;

// ---------- category chips ----------
const chips = `
<nav class="chips-bar" aria-label="Menu categories">
  <div class="chips">
    ${CATEGORIES.map(
      (c, i) => `<a class="chip${i === 0 ? ' on' : ''}" href="#${c.id}">${cube(11, i === 0 ? 'yellow' : c.color)}<span class="chip-en">${c.en}</span>${ar(c.ar, 'chip-ar')}</a>`,
    ).join('')}
  </div>
</nav>`;

// ---------- 1. Mango Signatures: feature card + zig-zag photo cards ----------
const sig = cat('signatures');
const [sigLead, ...sigRest] = drinksIn('signatures');
const signatures = `
<section id="signatures" class="sec">
  ${sectionHead(sig, drinksIn('signatures').length)}
  <a class="lead-card z" href="${DETAIL}">
    <div class="lead-photo">
      <img src="${photo(sigLead.id)}" alt="${sigLead.en}"/>
      <span class="lead-badge">${ic('local_fire_department')}The original</span>
      ${priceTag(sigLead.price, { rotate: 5, cls: 'lead-price' })}
      ${cube(22, 'teal', 'position:absolute;left:18px;bottom:30px')}
      ${dot(9, 'orange', 'position:absolute;left:50px;bottom:20px')}
    </div>
    <div class="lead-body">
      <div class="min-w-0">${drinkName(sigLead, 26)}${note(sigLead)}</div>
      <span class="go">${ic('arrow_forward')}</span>
    </div>
  </a>
  <div class="zig z">
    ${sigRest
      .map(
        (d, i) => `
    <a class="zig-card${i % 2 ? ' flip' : ''}" href="${DETAIL}">
      <div class="zig-photo">
        <img src="${photo(d.id)}" alt="${d.en}"/>
        ${priceTag(d.price, { rotate: i % 2 ? 6 : -6, cls: 'zig-price' })}
      </div>
      <div class="zig-body">${drinkName(d, 18)}${note(d)}</div>
    </a>`,
      )
      .join('')}
  </div>
</section>`;

// ---------- 2. Fresh Cubes: diamond-masked feature block ----------
const cubesCat = cat('cubes');
const cubesDrink = drinksIn('cubes')[0];
const freshCubes = `
<section id="cubes" class="sec">
  ${sectionHead(cubesCat, 1)}
  <a class="cube-block z" href="${DETAIL}">
    ${cube(120, 'orange', 'position:absolute;right:-56px;top:-48px;opacity:.9')}
    ${cube(46, 'yellow', 'position:absolute;right:52px;top:84px')}
    ${cube(20, 'teal', 'position:absolute;right:26px;top:150px')}
    ${dot(10, 'purple', 'position:absolute;right:90px;top:40px')}
    ${dot(7, 'teal', 'position:absolute;right:112px;top:18px')}
    <div class="diamond">
      <div class="diamond-in"><img src="${photo(cubesDrink.id)}" alt="${cubesDrink.en}"/></div>
    </div>
    <div class="cube-body">
      <div class="min-w-0">
        ${drinkName(cubesDrink, 28)}
        ${cubesDrink.note ? `<span class="pill">${cubesDrink.note}</span>` : ''}
      </div>
      ${priceTag(cubesDrink.price, { rotate: -5, cls: 'big-price' })}
    </div>
  </a>
</section>`;

// ---------- 3. Smoothies & Shakes: staggered tall cards on a soft purple band ----------
const smoothCat = cat('smoothies');
const smoothies = `
<section id="smoothies" class="sec band" style="background:${C.purpleSoft}">
  ${cube(64, 'purple', 'position:absolute;left:-30px;bottom:40px;opacity:.12')}
  ${cube(18, 'yellow', 'position:absolute;left:24%;bottom:26px')}
  ${dot(8, 'coral', 'position:absolute;right:26px;top:30px')}
  ${sectionHead(smoothCat, drinksIn('smoothies').length)}
  <div class="tall-grid z">
    ${drinksIn('smoothies')
      .map(
        (d, i) => `
    <a class="tall-card${i % 2 ? ' low' : ''}" href="${DETAIL}">
      <div class="tall-photo">
        <img src="${photo(d.id)}" alt="${d.en}"/>
        ${priceTag(d.price, { rotate: i % 2 ? -5 : 5, cls: 'tall-price' })}
      </div>
      <div class="tall-body">${drinkName(d, 17)}${note(d)}</div>
    </a>`,
      )
      .join('')}
  </div>
</section>`;

// ---------- 4. Fresh Juices: two-column grid, last one wide ----------
const juiceCat = cat('juices');
const juiceList = drinksIn('juices');
const juices = `
<section id="juices" class="sec">
  ${sectionHead(juiceCat, juiceList.length)}
  <div class="juice-grid z">
    ${juiceList
      .map((d, i) => {
        const wide = i === juiceList.length - 1 && juiceList.length % 2 === 1;
        return `
    <a class="juice-card${wide ? ' wide' : ''}" href="${DETAIL}">
      <div class="juice-photo">
        <img src="${photo(d.id)}" alt="${d.en}"/>
        ${priceTag(d.price, { rotate: i % 2 ? 4 : -4, cls: 'juice-price' })}
      </div>
      <div class="juice-body">${drinkName(d, 16)}${note(d)}</div>
    </a>`;
      })
      .join('')}
  </div>
</section>`;

// ---------- 5. Seasonal: coral colour-block band with ticket cards ----------
const seasCat = cat('seasonal');
const seasonal = `
<section id="seasonal" class="sec band seasonal" style="background:${C.coral}">
  ${fall(cube(34, 'yellow'), 'right:22px;top:26px', 1, 7)}
  ${fall(cube(16, 'card'), 'right:76px;top:16px', 3, 6)}
  ${fall(dot(9, 'yellow'), 'right:18px;top:92px', 2, 5)}
  ${cube(150, '#FFFFFF', 'position:absolute;left:-80px;bottom:-70px;opacity:.12')}
  <div class="z seas-head">
    <span class="limited">${ic('schedule')}While the season lasts</span>
    <h2 class="sec-title seas-title">${seasCat.en}</h2>
    ${ar(seasCat.ar, 'sec-ar seas-ar')}
  </div>
  <div class="tickets z">
    ${drinksIn('seasonal')
      .map(
        (d, i) => `
    <a class="ticket" href="${DETAIL}">
      <div class="ticket-photo"><img src="${photo(d.id)}" alt="${d.en}"/></div>
      <div class="ticket-body">
        ${drinkName(d, 18)}${note(d)}
        ${priceTag(d.price, { rotate: i % 2 ? 4 : -4, cls: 'ticket-price' })}
      </div>
    </a>`,
      )
      .join('')}
  </div>
</section>`;

// ---------- footer ----------
const footer = `
<footer class="foot">
  <div class="foot-gems" aria-hidden="true">
    ${cube(16, 'yellow', 'position:absolute;left:20px;top:22px')}
    ${cube(11, 'teal', 'position:absolute;left:50px;top:8px')}
    ${dot(7, 'orange', 'position:absolute;left:70px;top:30px')}
    ${cube(12, 'coral', 'position:absolute;right:30px;top:16px')}
    ${dot(6, 'purple', 'position:absolute;right:58px;top:34px')}
  </div>
  ${logoMark(76, 'foot-mark')}
  <div class="mt-2">${wordmark(46)}</div>
  ${ar(BRAND.taglineAr, 'foot-ar')}
  <p class="foot-en">${BRAND.tagline}</p>
  <div class="foot-meta">
    <span>${ic('location_on')}Cairo, Egypt</span>
    <span>${ic('info')}Prices in ${BRAND.currency}</span>
  </div>
</footer>`;

export const body = `<div id="top"></div>${hero}${chips}${signatures}${freshCubes}${smoothies}${juices}${seasonal}${footer}`;

// ---------- CSS ----------
export const css = `
html{scroll-behavior:smooth}
main.screen{overflow:clip}
a{color:inherit;text-decoration:none}
img{display:block}
h1,h2,h3,p{margin:0}
.ar{display:inline-block;max-width:100%}

/* logo mark */
.mark{position:relative;display:inline-block;width:1em;height:1em;flex-shrink:0}
.mark i{display:block}
.mark-cup{position:absolute;left:.15em;top:.4em;width:.7em;height:.56em;border:.065em solid ${C.purple};border-top:0;border-radius:0 0 .24em .24em}

/* floating cubes */
.fall{position:absolute;display:block;line-height:0;animation:tumble 6s ease-in-out infinite;pointer-events:none}
@keyframes tumble{0%,100%{transform:translateY(-7px) rotate(-8deg)}50%{transform:translateY(7px) rotate(10deg)}}
@media (prefers-reduced-motion:reduce){.fall{animation:none}html{scroll-behavior:auto}}

/* hero */
.hero{position:relative;padding:18px 16px 8px;overflow:hidden}
.hero-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:8px}
.brand-ar{font-size:13px;font-weight:600;color:${C.purple};margin-top:3px;line-height:1.1}
.place{display:inline-flex;align-items:center;gap:4px;height:34px;padding:0 12px 0 9px;border-radius:999px;background:#fff;border:1.5px solid ${C.line};font-size:13px;font-weight:600;color:${C.ink}}
.place .ico{font-size:17px;color:${C.coral}}
.tagline{margin-top:26px;font-size:44px;line-height:1;font-weight:700;letter-spacing:-.035em}
.tagline-ar{margin-top:12px;font-size:19px;font-weight:600;color:${C.purple};line-height:1.5}

.stage{position:relative;height:392px;margin-top:6px}
.stage-diamond{position:absolute;left:-70px;top:62px;width:250px;height:250px;border-radius:28%;background:${C.yellow};transform:rotate(45deg)}
.stage-diamond.two{left:auto;right:-36px;top:-10px;width:86px;height:86px;background:${C.tealSoft}}
.hero-photo{position:absolute;right:0;top:26px;width:262px;height:300px;border-radius:30px;overflow:hidden;background:${C.yellowSoft};border:6px solid #fff;box-shadow:0 26px 44px -26px rgba(42,22,64,.55);transform:rotate(3deg)}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-sticker{position:absolute;left:8px;top:84px;display:inline-flex;align-items:center;gap:5px;padding:8px 13px;border-radius:999px;background:${C.purple};color:#fff;font-size:13px;font-weight:700;transform:rotate(-8deg);box-shadow:0 10px 18px -10px rgba(114,67,171,.9);z-index:2}
.hero-sticker .ico{font-size:17px;color:${C.yellow}}
.pick{position:absolute;left:0;bottom:4px;z-index:2;display:flex;flex-direction:column;align-items:flex-start;width:184px;padding:14px 16px 16px;border-radius:26px;background:#fff;box-shadow:0 22px 40px -22px rgba(42,22,64,.5)}
.pick-label{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.muted}}
.pick-label .ico{font-size:15px;color:${C.orange}}
.pick-name{margin-top:6px;font-size:21px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:${C.purple}}
.pick-ar{font-size:14px;font-weight:500;color:${C.ink};margin-top:2px}
.pick-price{position:absolute;right:-18px;top:-16px}
.pick-price b{font-size:20px}

/* chips */
.chips-bar{position:sticky;top:0;z-index:20;padding:10px 0 12px;background:rgba(255,248,231,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.chips{display:flex;gap:8px;overflow-x:auto;padding:2px 16px;scrollbar-width:none;scroll-snap-type:x proximity;scroll-padding:0 16px}
.chips::-webkit-scrollbar{display:none}
.chip{display:inline-flex;align-items:center;gap:8px;flex-shrink:0;height:50px;padding:0 18px 0 16px;border-radius:999px;background:#fff;border:2px solid ${C.line};white-space:nowrap;scroll-snap-align:start}
.chip .cube{width:11px;height:11px}
.chip-en{font-size:14px;font-weight:700;color:${C.ink}}
.chip-ar{font-size:13px;font-weight:500;color:${C.muted}}
.chip.on{background:${C.purple};border-color:${C.purple};box-shadow:0 10px 18px -10px rgba(114,67,171,.9)}
.chip.on .chip-en{color:#fff}
.chip.on .chip-ar{color:${C.yellowSoft}}

/* sections */
.sec{position:relative;padding:30px 16px 8px;scroll-margin-top:72px}
.sec.band{margin-top:30px;padding:30px 16px 34px;border-radius:40px;overflow:hidden}
.sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:18px}
.sec-gems{position:relative;width:64px;height:44px;flex-shrink:0}
.count{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px 0 10px;border-radius:999px;font-size:12px;font-weight:600;color:${C.ink}}
.count .cube{width:9px;height:9px}
.sec-title{margin-top:10px;font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.05;color:${C.ink}}
.sec-title span{padding:0 2px}
.band .count{background:#fff!important}
.band .sec-title span{background-image:linear-gradient(transparent 62%, #fff 62%)!important}
.sec-ar{margin-top:6px;font-size:18px;font-weight:600;color:${C.purple};line-height:1.4}

.dn{font-weight:700;letter-spacing:-.02em;line-height:1.12;color:${C.ink}}
.dn-ar{margin-top:3px;font-size:14px;font-weight:500;color:${C.purple};line-height:1.45}
.note{margin-top:6px;font-size:12.5px;line-height:1.4;color:${C.muted}}

/* signatures: lead card */
.lead-card{display:block;padding:10px;border-radius:34px;background:#fff;box-shadow:0 24px 44px -30px rgba(42,22,64,.55)}
.lead-photo{position:relative;height:300px;border-radius:28px;overflow:hidden;background:${C.yellowSoft}}
.lead-photo img{width:100%;height:100%;object-fit:cover}
.lead-badge{position:absolute;left:12px;top:12px;display:inline-flex;align-items:center;gap:5px;padding:7px 12px 7px 9px;border-radius:999px;background:#fff;color:${C.coral};font-size:12px;font-weight:700;transform:rotate(-4deg);box-shadow:0 8px 16px -10px rgba(42,22,64,.6)}
.lead-badge .ico{font-size:16px}
.lead-price,.zig-price,.tall-price,.juice-price{box-shadow:0 0 0 3px #fff,0 10px 18px -8px rgba(42,22,64,.55)}
.lead-price{position:absolute;right:14px;bottom:16px;padding:9px 14px;border-radius:16px}
.lead-price b{font-size:26px}
.lead-price small{font-size:12px}
.lead-body{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:14px 8px 8px 10px}
.lead-body .dn-ar{font-size:17px}
.go{display:grid;place-items:center;width:46px;height:46px;flex-shrink:0;border-radius:16px;background:${C.purple};color:#fff;transform:rotate(-6deg)}

/* signatures: zig-zag */
.zig{display:flex;flex-direction:column;gap:14px;margin-top:16px}
.zig-card{display:flex;align-items:center;gap:14px;padding:8px;border-radius:30px;background:#fff;box-shadow:0 16px 32px -26px rgba(42,22,64,.55)}
.zig-card.flip{flex-direction:row-reverse}
.zig-card.flip .zig-body{padding:0 0 0 12px}
.zig-photo{position:relative;width:146px;height:146px;flex-shrink:0;border-radius:24px;overflow:hidden;background:${C.yellowSoft}}
.zig-photo img{width:100%;height:100%;object-fit:cover}
.zig-price{position:absolute;right:8px;bottom:9px}
.zig-card.flip .zig-price{right:auto;left:8px}
.zig-body{flex:1;min-width:0;padding:0 12px 0 0}

/* fresh cubes: feature block */
.cube-block{position:relative;display:block;padding:22px 20px 22px;border-radius:38px;background:${C.orangeSoft};overflow:hidden}
.diamond{position:relative;width:204px;height:204px;margin:42px 0 44px 42px;border-radius:28%;overflow:hidden;transform:rotate(45deg);border:6px solid #fff;box-shadow:0 26px 40px -24px rgba(247,148,29,.9);background:${C.yellowSoft}}
.diamond-in{position:absolute;inset:-30%;transform:rotate(-45deg)}
.diamond-in img{width:100%;height:100%;object-fit:cover}
.cube-body{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.cube-body .dn-ar{font-size:18px}
.pill{display:flex;width:fit-content;align-items:center;height:26px;margin-top:10px;padding:0 12px;border-radius:999px;background:#fff;font-size:12px;font-weight:600;color:${C.orange}}
.big-price{padding:9px 14px;border-radius:16px;margin-bottom:4px}
.big-price b{font-size:26px}
.big-price small{font-size:12px}

/* smoothies: tall staggered cards */
.tall-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
.tall-card{display:block;padding:7px;border-radius:28px;background:#fff;box-shadow:0 18px 32px -24px rgba(114,67,171,.7)}
.tall-card.low{margin-top:40px}
.tall-photo{position:relative;height:200px;border-radius:22px;overflow:hidden;background:${C.purpleSoft}}
.tall-photo img{width:100%;height:100%;object-fit:cover}
.tall-price{position:absolute;right:8px;top:9px}
.tall-body{padding:12px 7px 9px}

/* juices: grid */
.juice-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.juice-card{display:block;padding:7px;border-radius:28px;background:#fff;box-shadow:0 16px 30px -26px rgba(42,22,64,.55)}
.juice-photo{position:relative;aspect-ratio:1/1;border-radius:22px;overflow:hidden;background:${C.tealSoft}}
.juice-photo img{width:100%;height:100%;object-fit:cover}
.juice-price{position:absolute;left:8px;bottom:9px}
.juice-body{padding:11px 6px 8px}
.juice-card.wide{grid-column:1 / -1;display:flex;align-items:center;gap:14px}
.juice-card.wide .juice-photo{width:132px;height:132px;flex-shrink:0;aspect-ratio:auto}
.juice-card.wide .juice-body{padding:0 6px 0 0}

/* seasonal: coral band + tickets */
.seasonal .fall .cube,.seasonal .fall .dot{box-shadow:0 6px 12px -8px rgba(42,22,64,.5)}
.seas-head{padding-right:92px}
.limited{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 12px 0 9px;border-radius:999px;background:#fff;color:${C.coral};font-size:12px;font-weight:700}
.limited .ico{font-size:16px}
.seas-title{color:#fff;font-size:34px}
.seas-ar{color:#fff}
.tickets{display:flex;flex-direction:column;gap:14px;margin-top:20px}
.ticket{position:relative;display:flex;align-items:stretch;gap:0;padding:8px;border-radius:30px;background:#fff;box-shadow:0 20px 34px -24px rgba(42,22,64,.6)}
.ticket-photo{width:128px;height:138px;flex-shrink:0;border-radius:24px;overflow:hidden;background:${C.coralSoft}}
.ticket-photo img{width:100%;height:100%;object-fit:cover}
.ticket-body{position:relative;flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding:6px 8px 6px 18px;margin-left:12px;border-left:2px dashed ${C.coralSoft}}
.ticket-body::before,.ticket-body::after{content:'';position:absolute;left:-10px;width:18px;height:18px;border-radius:50%;background:${C.coral}}
.ticket-body::before{top:-18px}
.ticket-body::after{bottom:-18px}
.ticket-price{margin-top:auto}

/* footer */
.foot{position:relative;margin-top:34px;padding:34px 24px 40px;text-align:center;background:#fff;border-radius:40px 40px 0 0;display:flex;flex-direction:column;align-items:center;overflow:hidden}
.foot-gems{position:absolute;inset:0;pointer-events:none}
.foot-ar{margin-top:10px;font-size:20px;font-weight:600;color:${C.purple};line-height:1.5}
.foot-en{margin-top:2px;font-size:14px;font-weight:500;color:${C.teal}}
.foot-meta{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 16px;margin-top:20px;font-size:12.5px;color:${C.muted}}
.foot-meta span{display:inline-flex;align-items:center;gap:4px}
.foot-meta .ico{font-size:16px;color:${C.coral}}
`;
