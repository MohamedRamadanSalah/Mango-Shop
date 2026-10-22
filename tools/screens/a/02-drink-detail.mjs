// 02 Drink detail: the hero drink, POV Mango. View-only (no cart, no order buttons).
// Arabic text comes only from shared.mjs data via ar(). Icons are Material placeholders.

import { C, BRAND, CATEGORIES, drink, drinksIn, photo, ic, ar, cube, dot, priceTag, wordmark } from '../shared.mjs';

export const file = '02-drink-detail';
export const title = 'POV Mango';

const hero = drink('pov-mango');
const cat = CATEGORIES.find((c) => c.id === hero.cat);
const more = drinksIn('signatures').filter((d) => d.id !== hero.id).slice(0, 3);
const tints = ['orangeSoft', 'coralSoft', 'purpleSoft'];
const accents = ['orange', 'coral', 'purple'];

export const css = `
/* ---------- hero colour block ---------- */
.hero{position:relative;height:428px;background:${C.yellow};overflow:hidden}
.hero::after{content:'';position:absolute;left:-40px;right:-40px;bottom:-120px;height:200px;border-radius:50%;background:rgba(255,255,255,.22)}
.fab{position:absolute;top:16px;width:46px;height:46px;border-radius:16px;background:#fff;display:grid;place-items:center;color:${C.purple};box-shadow:0 10px 20px -12px rgba(42,22,64,.55);z-index:5;text-decoration:none}
.fab .ico{font-size:23px}
.fab.l{left:16px}.fab.r{right:16px}
.deco{position:absolute;z-index:1}
.shot{position:absolute;left:50%;top:80px;width:268px;height:268px;margin-left:-134px;border-radius:44px;overflow:hidden;background:${C.yellowSoft};border:6px solid #fff;transform:rotate(-3deg);box-shadow:0 30px 40px -24px rgba(42,22,64,.55);z-index:2}
.shot img{width:100%;height:100%;object-fit:cover;display:block}
.sticker-sig{position:absolute;left:26px;top:86px;z-index:3;display:inline-flex;align-items:center;gap:5px;padding:7px 12px 7px 10px;border-radius:999px;background:${C.teal};color:#fff;font-size:12px;font-weight:600;letter-spacing:.02em;border:3px solid #fff;transform:rotate(-9deg);box-shadow:0 8px 16px -10px rgba(42,22,64,.6)}
.sticker-sig .ico{font-size:16px}
.tag-xl{position:absolute;right:26px;top:300px;z-index:3;padding:10px 16px 11px;border-radius:20px;border:3px solid #fff;gap:5px}
.tag-xl b{font-size:34px;letter-spacing:-.03em}
.tag-xl small{font-size:13px}

/* ---------- title card ---------- */
.sheet{position:relative;z-index:4;margin:-46px 16px 0;background:#fff;border-radius:30px;padding:24px 22px 22px;box-shadow:0 24px 40px -30px rgba(42,22,64,.45);overflow:hidden}
.cat-chip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 12px;border-radius:999px;background:${C.yellowSoft};color:${C.ink};font-size:12.5px;font-weight:600;text-decoration:none;max-width:100%}
.cat-chip .ar{font-size:12.5px;font-weight:500;color:${C.purple}}
.cat-chip .sep{width:4px;height:4px;border-radius:50%;background:${C.orange};flex-shrink:0}
.name-en{margin:14px 0 0;font-size:40px;line-height:1.02;font-weight:700;letter-spacing:-.035em;color:${C.purple}}
.name-ar{display:block;margin-top:6px;font-size:24px;line-height:1.35;font-weight:500;color:${C.ink};text-align:left}
.desc{margin:14px 0 0;font-size:15px;line-height:1.6;color:${C.muted};font-weight:400}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:20px}
.stat{position:relative;overflow:hidden;border-radius:22px;padding:14px 12px 13px;min-height:92px}
.stat b{display:block;font-size:24px;line-height:1;font-weight:700;letter-spacing:-.03em}
.stat span{display:block;margin-top:6px;font-size:12px;line-height:1.3;font-weight:500;color:${C.ink}}
.stat .cube{position:absolute;right:14px;bottom:14px}
.perks{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.perk{display:flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 8px;white-space:nowrap;border-radius:999px;border:1.5px solid ${C.line};font-size:13px;font-weight:500;color:${C.ink};background:#fff}
.perk .ico{font-size:18px}

/* ---------- you might also like ---------- */
.more{position:relative;padding:34px 0 10px}
.more-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:0 20px}
.more-head h2{margin:0;font-size:22px;line-height:1.15;font-weight:700;letter-spacing:-.02em;color:${C.ink}}
.more-sub{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:5px;font-size:12.5px;color:${C.muted};font-weight:500}
.more-sub .ar{color:${C.purple}}
.see-all{display:inline-flex;align-items:center;gap:2px;flex-shrink:0;font-size:13px;font-weight:600;color:${C.purple};text-decoration:none;padding-bottom:2px}
.see-all .ico{font-size:18px}
.rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:16px 20px 30px;scroll-padding:0 20px;scrollbar-width:none}
.rail::-webkit-scrollbar{display:none}
.rec{flex:0 0 152px;scroll-snap-align:start;background:#fff;border-radius:26px;padding:7px 7px 12px;text-decoration:none;color:${C.ink};box-shadow:0 18px 30px -24px rgba(42,22,64,.5)}
.rec-photo{position:relative;aspect-ratio:1/1;border-radius:20px;overflow:hidden}
.rec-photo img{width:100%;height:100%;object-fit:cover;display:block}
.rec-photo .cube{position:absolute;left:10px;top:10px}
.rec .price-tag{position:absolute;right:7px;bottom:8px;border:2.5px solid #fff;padding:5px 9px}
.rec .price-tag b{font-size:16px}
.rec-en{margin:11px 6px 0;font-size:14px;line-height:1.25;font-weight:600;letter-spacing:-.01em}
.rec-ar{display:block;margin:3px 6px 0;font-size:13px;line-height:1.4;font-weight:400;color:${C.muted};text-align:left}

/* ---------- footer ---------- */
.foot{position:relative;overflow:hidden;margin-top:4px;padding:40px 24px 44px;background:${C.yellowSoft};border-radius:36px 36px 0 0;text-align:center}
.mark{position:relative;width:76px;height:76px;margin:0 auto 14px}
.mark .cup{position:absolute;left:12px;bottom:4px;width:52px;height:42px;border:5px solid ${C.purple};border-top:0;border-radius:0 0 18px 18px}
.mark .cube,.mark .dot{position:absolute}
.foot .tag-ar{display:block;margin-top:12px;font-size:19px;line-height:1.5;font-weight:600;color:${C.purple}}
.foot .tag-en{margin:2px 0 0;font-size:13px;color:${C.muted};font-weight:500}
.back-menu{display:inline-flex;align-items:center;gap:8px;margin-top:22px;height:48px;padding:0 20px 0 22px;border-radius:999px;background:#fff;color:${C.purple};font-size:14.5px;font-weight:600;text-decoration:none;box-shadow:0 12px 22px -16px rgba(42,22,64,.55)}
.back-menu .ico{font-size:20px}
`;

const heroBlock = `
<section class="hero">
  <a class="fab l" href="01-menu.html" aria-label="Back to menu">${ic('arrow_back')}</a>
  <a class="fab r" href="#" aria-label="Share">${ic('share')}</a>

  <!-- the logo's big orange cube, sitting behind the cup -->
  ${cube(262, 'orange', 'position:absolute;left:50%;top:83px;margin-left:-131px;z-index:1;border-radius:18%')}
  <!-- tumbling cubes and the dot spray -->
  ${cube(34, 'teal', 'position:absolute;left:18px;top:208px;z-index:1;transform:rotate(28deg)')}
  ${cube(18, 'purple', 'position:absolute;left:44px;top:352px;z-index:1;transform:rotate(62deg)')}
  ${cube(24, '#FFFFFF', 'position:absolute;right:44px;top:84px;z-index:1;transform:rotate(18deg)')}
  ${cube(28, 'teal', 'position:absolute;right:14px;top:226px;z-index:1;transform:rotate(56deg)')}
  ${cube(14, 'coral', 'position:absolute;left:96px;top:66px;z-index:1;transform:rotate(36deg)')}
  ${dot(9, 'coral', 'position:absolute;right:92px;top:56px;z-index:1')}
  ${dot(7, 'teal', 'position:absolute;right:112px;top:76px;z-index:1')}
  ${dot(8, 'orange', 'position:absolute;right:20px;top:150px;z-index:1')}
  ${dot(6, 'purple', 'position:absolute;right:40px;top:178px;z-index:1')}
  ${dot(8, 'coral', 'position:absolute;left:22px;top:300px;z-index:1')}

  <div class="shot"><img src="${photo('pov-mango')}" alt="${hero.en} in a clear cup"/></div>
  <span class="sticker-sig">${ic('star', '', true)}House signature</span>
  ${priceTag(hero.price, { rotate: -8, cls: 'tag-xl' })}
</section>`;

const sheet = `
<section class="sheet">
  <a class="cat-chip" href="01-menu.html#${cat.id}">${cube(10, 'orange')}<span>${cat.en}</span><span class="sep"></span>${ar(cat.ar)}</a>
  <h1 class="name-en">${hero.en}</h1>
  ${ar(hero.ar, 'name-ar')}
  <p class="desc">Nothing but ripe Egyptian mango, blended to order until thick, cold and silky. No added sugar, no syrups. Just the fruit at its sunniest.</p>

  <div class="stats">
    <div class="stat" style="background:${C.yellowSoft}">${cube(13, 'yellow')}<b style="color:${C.purple}">100%</b><span>fresh mango</span></div>
    <div class="stat" style="background:${C.tealSoft}">${cube(13, 'teal')}<b style="color:#0D7F72">0 g</b><span>added sugar</span></div>
    <div class="stat" style="background:${C.coralSoft}">${cube(13, 'coral')}<b style="color:#C9442B">400<small style="font-size:14px;font-weight:600"> ml</small></b><span>cup size</span></div>
  </div>

  <div class="perks">
    <span class="perk"><span style="color:${C.orange}">${ic('schedule')}</span>Made to order</span>
    <span class="perk"><span style="color:${C.teal}">${ic('check_circle')}</span>Served ice-cold</span>
  </div>
</section>`;

const recCard = (d, i) => `
  <a class="rec" href="01-menu.html#signatures">
    <div class="rec-photo" style="background:${C[tints[i % 3]]}">
      <img src="${photo(d.id)}" alt="${d.en}"/>
      ${cube(14, accents[i % 3])}
      ${priceTag(d.price, { rotate: i % 2 ? 5 : -5 })}
    </div>
    <div class="rec-en">${d.en}</div>
    ${ar(d.ar, 'rec-ar')}
  </a>`;

const moreBlock = `
<section class="more">
  <div class="more-head">
    <div>
      <h2>You might also like</h2>
      <div class="more-sub"><span>More ${cat.en}</span>${dot(4, 'orange')}${ar(cat.ar)}</div>
    </div>
    <a class="see-all" href="01-menu.html#signatures">See all${ic('chevron_right')}</a>
  </div>
  <div class="rail">${more.map(recCard).join('')}</div>
</section>`;

const footer = `
<footer class="foot">
  ${cube(46, 'yellow', 'position:absolute;left:-14px;top:30px;transform:rotate(24deg)')}
  ${cube(30, 'teal', 'position:absolute;right:22px;top:24px;transform:rotate(58deg)')}
  ${cube(22, 'coral', 'position:absolute;right:-6px;bottom:46px;transform:rotate(30deg)')}
  ${dot(8, 'orange', 'position:absolute;left:46px;bottom:40px')}

  <div class="mark" aria-hidden="true">
    <span class="cup"></span>
    ${cube(17, 'yellow', 'left:30px;top:12px')}
    ${cube(13, 'teal', 'left:18px;top:28px')}
    ${cube(13, 'teal', 'left:45px;top:28px')}
    ${cube(21, 'orange', 'left:28px;top:36px')}
    ${dot(5, 'coral', 'left:56px;top:2px')}
    ${dot(5, 'teal', 'left:64px;top:10px')}
    ${dot(4, 'coral', 'left:52px;top:14px')}
  </div>
  ${wordmark(46)}
  ${ar(BRAND.taglineAr, 'tag-ar')}
  <p class="tag-en">${BRAND.tagline}</p>
  <a class="back-menu" href="01-menu.html">Back to the full menu${ic('arrow_forward')}</a>
</footer>`;

export const body = `${heroBlock}${sheet}${moreBlock}${footer}`;
