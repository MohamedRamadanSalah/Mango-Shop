// 02 Drink detail, Design B "Viewfinder": POV Mango. View-only QR menu (no cart, no order buttons).
// Layout: photo stage (tint field, big framed photo, camera-HUD caption) -> white bottom sheet
// (kicker, names, price) -> description -> "What's inside" fact tiles -> "Say this at the counter"
// card (the useful bit for a view-only menu) -> related carousel -> fixed thumb-zone bottom bar.
// Arabic only via ar() from shared data. Icons only via ic(). Photos only via photo()/framedPhoto().

import {
  fonts, colors, baseCss, T, tone, catOf, topBar, framedPhoto, viewfinder, price, names,
  drink, drinksIn, ic, ar, cube, BRAND, logoMark,
} from './theme.mjs';

export { fonts, colors, baseCss };

export const file = '02-drink-detail';
export const title = 'POV Mango';

const d = drink('pov-mango');
const c = catOf(d);
const t = tone(c.color);
const siblings = drinksIn(c.id);
const pos = siblings.findIndex((x) => x.id === d.id) + 1;
const nn = (n) => String(n).padStart(2, '0');
const more = siblings.filter((x) => x.id !== d.id);

export const css = `
.screen{padding-bottom:calc(104px + env(safe-area-inset-bottom))}

/* ---------- photo stage ---------- */
.stage{position:relative;z-index:1;padding:18px 20px 52px}
.stage .fp{box-shadow:0 1px 0 rgba(42,22,64,.04)}
.shot{position:relative}
.hud{position:absolute;left:50%;bottom:16px;z-index:2;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 13px 0 11px;border-radius:999px;background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);white-space:nowrap;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.ink};font-variant-numeric:tabular-nums}
.hud-rec{width:7px;height:7px;border-radius:50%;background:${T.coral};box-shadow:0 0 0 3px ${T.coralTint};animation:rec 1.6s ease-in-out infinite}
.hud-sep{width:1px;height:12px;background:${T.hair}}
.hud b{font-weight:700;color:${T.purpleDeep}}
@keyframes rec{50%{opacity:.35}}

/* ---------- bottom sheet ---------- */
.sheet{position:relative;z-index:2;margin-top:-28px;padding:12px 20px 0;background:#fff;border-radius:28px 28px 0 0}
.grab{display:block;width:40px;height:4px;margin:0 auto 18px;border-radius:4px;background:${T.hair}}
.kick{display:inline-flex;align-items:center;flex-wrap:wrap;gap:6px 8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${t.deep}}
.kick .cube{width:9px;height:9px}
.kick .ar{font-size:13px;font-weight:500;letter-spacing:0;text-transform:none;color:${T.muted}}
.kick-dot{width:3px;height:3px;border-radius:50%;background:${T.muted};opacity:.6}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-top:12px}
.head-names{min-width:0}
.d-en{font-size:34px;font-weight:700;letter-spacing:-.025em;line-height:1.02;color:${T.ink}}
.d-ar{display:block;margin-top:6px;font-size:24px;font-weight:600;line-height:1.35;color:${T.purpleDeep};text-align:left}
.head .price-chip{padding:9px 13px 10px;border-radius:16px;margin-bottom:6px}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.meta>span{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px 0 9px;border-radius:999px;background:${T.mist};font-size:12.5px;font-weight:500;color:${T.ink}}
.meta .ico{font-size:17px;display:block}
.meta>span>span{display:grid;place-items:center}
.desc{margin-top:18px;font-size:15.5px;line-height:1.62;color:${T.muted}}

/* ---------- block heads ---------- */
.bh{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:34px 0 14px}
.bh-t{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.ink}}
.bh-t .cube{width:8px;height:8px}
.bh-n{font-size:12px;font-weight:600;color:${T.muted};font-variant-numeric:tabular-nums}

/* ---------- what's inside ---------- */
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.fact{position:relative;min-height:108px;padding:18px 14px 18px;border-radius:20px;display:flex;flex-direction:column;justify-content:flex-end}
.fact b{display:flex;align-items:baseline;gap:2px;font-size:28px;font-weight:700;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
.fact b small{font-size:15px;font-weight:600;letter-spacing:0;margin-left:1px}
.fact span{display:block;margin-top:7px;font-size:12.5px;font-weight:500;line-height:1.3;color:${T.ink}}

/* ---------- say this at the counter ---------- */
.counter{position:relative;margin-top:34px;padding:30px 30px 30px;border-radius:28px;background:${T.yellow};color:${T.ink};overflow:hidden}
.ct-label{display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600;letter-spacing:-.005em;line-height:1.2}
.ct-label .ico{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.55);font-size:19px}
.ct-ar{display:block;margin:20px 0 2px;font-size:56px;font-weight:700;line-height:1.25;text-align:center;color:${T.ink}}
.ct-rule{display:block;height:0;margin:14px 0 14px;border-top:1.5px dashed rgba(42,22,64,.28)}
.ct-foot{display:flex;align-items:center;justify-content:space-between;gap:12px}
.ct-en{font-size:17px;font-weight:700;letter-spacing:-.01em}
.ct-sub{display:block;margin-top:2px;font-size:12px;font-weight:500;color:rgba(42,22,64,.72)}
.counter .price{padding:7px 11px;border-radius:12px;background:#fff}
.counter .price-md b{font-size:20px}

/* ---------- related carousel ---------- */
.more{margin-top:6px}
.more .bh{padding:0 20px}
.see{display:inline-flex;align-items:center;gap:2px;min-height:44px;padding:0 0 0 10px;font-size:13px;font-weight:600;color:${T.purpleDeep}}
.see .ico{font-size:18px}
.car{display:flex;gap:12px;overflow-x:auto;padding:0 20px 6px;scroll-snap-type:x mandatory;scroll-padding:0 20px;scrollbar-width:none;-ms-overflow-style:none}
.car::-webkit-scrollbar{display:none}
.rc{position:relative;flex:0 0 158px;display:flex;flex-direction:column;padding:7px 7px 10px;border-radius:22px;border:1px solid ${T.hair};background:#fff;scroll-snap-align:start;transition:transform .12s ease}
.rc:active{transform:scale(.98)}
.rc-i{font-size:11px;font-weight:600;letter-spacing:.06em;color:${T.muted};font-variant-numeric:tabular-nums}
.rc-i b{font-weight:700;color:${T.purpleDeep}}
.rc-body{padding:10px 4px 0}
.rc-body .nm{font-size:15px}
.rc-body .nm-ar{font-size:13.5px}
.rc-body .nm-note{display:none}
.rc-foot{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:auto;padding:10px 4px 0}

/* ---------- sign-off ---------- */
.sign{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:40px 20px 8px;padding:26px 20px 24px;border-radius:24px;background:${T.mist}}
.sign .ar{font-size:17px;font-weight:600;color:${T.purpleDeep};margin-top:6px}
.sign p{font-size:12.5px;font-weight:500;color:${T.muted}}

/* ---------- thumb-zone bottom bar ---------- */
.bbar{position:fixed;left:0;right:0;bottom:0;z-index:40;width:100%;max-width:430px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid ${T.hair}}
.bb-back{display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 20px 0 16px;border-radius:18px;background:${T.purple};color:#fff;font-size:14.5px;font-weight:600;white-space:nowrap}
.bb-back .ico{font-size:20px}
.bb-mid{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-end;line-height:1.1}
.bb-mid span{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${T.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.bb-mid .price{margin-top:3px}
.bb-mid .price-md b{font-size:20px}
.bb-share{display:grid;place-items:center;flex-shrink:0;width:52px;height:52px;padding:0;border:0;border-radius:18px;background:${T.mist};color:${T.ink};font:inherit;cursor:pointer}

@media (prefers-reduced-motion: reduce){.rc:active{transform:none}.hud-rec{animation:none}}
`;

const stage = `
<section class="stage" style="background:${t.tint}" aria-label="Photo of ${d.en}">
  <div class="shot">
  ${framedPhoto(d, { ratio: '1/1', radius: 28, vfColor: 'purple', vf: { inset: 14, size: 30, stroke: 4 } })}
  <p class="hud"><i class="hud-rec" aria-hidden="true"></i>In focus<i class="hud-sep" aria-hidden="true"></i><span><b>${nn(pos)}</b> / ${nn(siblings.length)}</span></p>
  </div>
</section>`;

const sheet = `
<section class="sheet">
  <i class="grab" aria-hidden="true"></i>
  <p class="kick">${cube(9, c.color)}${c.en}<i class="kick-dot" aria-hidden="true"></i>${ar(c.ar)}</p>
  <div class="head">
    <div class="head-names">
      <h1 class="d-en">${d.en}</h1>
      ${ar(d.ar, 'd-ar')}
    </div>
    ${price(d.price, { size: 'lg', chip: true })}
  </div>
  <div class="meta">
    <span><span style="color:${T.orangeDeep}">${ic('schedule')}</span>Made to order</span>
    <span><span style="color:${T.tealDeep}">${ic('check_circle')}</span>Served ice-cold</span>
  </div>
  <p class="desc">Nothing but ripe Egyptian mango, blended to order until thick, cold and silky. No added sugar, no syrups. Just the fruit at its sunniest.</p>
</section>`;

const fact = (color, num, unit, label) => {
  const f = tone(color);
  return `<div class="fact" style="background:${f.tint}">${viewfinder(color, { inset: 8, size: 10, stroke: 2 })}<b style="color:${f.deep}">${num}${unit ? `<small>${unit}</small>` : ''}</b><span>${label}</span></div>`;
};

const inside = `
<section class="pad">
  <div class="bh"><h2 class="bh-t">${cube(8, 'purple')}What's inside</h2></div>
  <div class="facts">
    ${fact('yellow', '100', '%', 'fresh mango')}
    ${fact('teal', '0', 'g', 'added sugar')}
    ${fact('coral', '400', 'ml', 'cup size')}
  </div>
</section>`;

const counter = `
<section class="pad">
  <div class="counter">
    ${viewfinder('ink', { inset: 12, size: 22, stroke: 3 })}
    <h2 class="ct-label">${ic('storefront')}Show or say this at the counter</h2>
    ${ar(d.ar, 'ct-ar')}
    <i class="ct-rule" aria-hidden="true"></i>
    <div class="ct-foot">
      <div><p class="ct-en">${d.en}</p><span class="ct-sub">${c.en}</span></div>
      ${price(d.price)}
    </div>
  </div>
</section>`;

const card = (x) => {
  const i = siblings.findIndex((s) => s.id === x.id) + 1;
  return `
  <a class="rc" href="02-drink-detail.html">
    ${framedPhoto(x, { ratio: '1/1', radius: 16, vfColor: 'purple', vf: { inset: 8, size: 16, stroke: 3 } })}
    <div class="rc-body">${names(x, { size: 15 })}</div>
    <div class="rc-foot">${price(x.price, { chip: true })}<span class="rc-i"><b>${nn(i)}</b> / ${nn(siblings.length)}</span></div>
  </a>`;
};

const related = `
<section class="more">
  <div class="bh"><h2 class="bh-t">${cube(8, c.color)}Also in ${c.en}</h2><a class="see" href="01-menu.html#${c.id}">See all${ic('chevron_right')}</a></div>
  <div class="car">${more.map(card).join('')}</div>
</section>`;

const sign = `
<footer class="sign">
  ${logoMark(44)}
  ${ar(BRAND.taglineAr)}
  <p>${BRAND.tagline}</p>
</footer>`;

const bar = `
<nav class="bbar" aria-label="Drink actions">
  <a class="bb-back" href="01-menu.html">${ic('arrow_back')}Back to menu</a>
  <div class="bb-mid"><span>${d.en}</span>${price(d.price)}</div>
  <button class="bb-share" type="button" aria-label="Share ${d.en}">${ic('share')}</button>
</nav>
<script>(function(){try{var b=document.querySelector('.bb-share');if(!b)return;b.addEventListener('click',function(){var u=location.href,t=document.title;if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});}else if(navigator.clipboard){navigator.clipboard.writeText(u).catch(function(){});}});}catch(e){}})();</script>`;

export const body = `${topBar({ back: true })}${stage}${sheet}${inside}${counter}${related}${sign}${bar}`;
