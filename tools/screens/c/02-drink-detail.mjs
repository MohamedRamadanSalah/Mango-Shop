// 02 Drink detail, Design C "Color Blocks": POV Mango. Responsive, view-only (no cart, no order buttons).
// Structure: top bar (back to menu) > solid category block with photo + names + price
// (stacked on phones, side by side on desktop) > "More in <category>" on the tint > other categories > footer.
// Arabic only via ar() from shared data. Icons only via ic(). Photos only via photo().

import {
  CATEGORIES, drink, drinksIn, photo, ic, ar, catOf, topBar, chip, grid, block, price, footer,
  fonts, colors, baseCss,
} from './theme.mjs';

export { fonts, colors, baseCss };
export const file = '02-drink-detail';
export const title = 'POV Mango';

const d = drink('pov-mango');
const c = catOf(d);
const more = drinksIn(c.id).filter((x) => x.id !== d.id);
const n = CATEGORIES.findIndex((x) => x.id === c.id) + 1;

export const css = `
.dgrid{display:grid;gap:22px}
.dph{position:relative;aspect-ratio:1/1;border-radius:24px;overflow:hidden;background:var(--t)}
.dph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dcat{display:inline-flex;align-items:center;flex-wrap:wrap;gap:4px 10px;min-height:44px;padding:8px 14px;border-radius:14px;background:#fff;color:${colors.ink};font-size:13px;font-weight:600}
.dcat .ar{display:inline-block;font-size:13px;font-weight:500;color:${colors.muted}}
.dcat i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.5}
.d-en{margin-top:16px;font-size:38px;font-weight:700;letter-spacing:-.03em;line-height:1.02}
.d-ar{margin-top:6px;font-size:26px;font-weight:600;line-height:1.35;text-align:left}
.d-desc{margin-top:14px;max-width:46ch;font-size:16px;line-height:1.55}
.d-price{margin-top:20px}
.d-price .price{padding:10px 16px;border-radius:16px;background:#fff;color:${colors.ink}}
.d-price .price b{font-size:30px}
.d-price .price small{font-size:12px}
.d-hint{display:flex;align-items:center;gap:8px;margin-top:16px;font-size:14px;font-weight:500}
.d-hint .ico{font-size:20px}
.sub-t{font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:1.15;margin-bottom:16px}
.sub-t .ar{margin-top:2px;text-align:left;font-size:17px;font-weight:600;color:${colors.muted}}
.others{padding-top:34px;padding-bottom:40px}
.chips{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
@media (min-width:700px){
  .grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
  .chips{grid-template-columns:repeat(2,minmax(0,1fr))}
  .d-en{font-size:48px}
}
@media (min-width:1000px){
  .dgrid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:center}
  .d-en{font-size:60px}
  .d-ar{font-size:32px}
  .d-desc{font-size:17px}
  .chips{grid-template-columns:repeat(4,minmax(0,1fr))}
}
`;

const hero = block(c, `
<div class="dgrid">
  <figure class="dph"><img src="${photo(d.id)}" alt="${d.en}"/></figure>
  <div>
    <a class="dcat" href="01-menu.html#${c.id}">${String(n).padStart(2, '0')} · ${c.en}<i aria-hidden="true"></i>${ar(c.ar)}</a>
    <h1 class="d-en">${d.en}</h1>
    ${ar(d.ar, 'd-ar')}
    <p class="d-desc">Nothing but ripe Egyptian mango, blended to order until thick, cold and silky. No added sugar, no syrups. Just the fruit at its sunniest.</p>
    <div class="d-price">${price(d.price)}</div>
    <p class="d-hint">${ic('storefront')}View-only menu: order at the counter.</p>
  </div>
</div>`, { id: '' });

const related = block(c, `
<h2 class="sub-t">More ${c.en}${ar(c.ar)}</h2>
${grid(more, '02-drink-detail.html', 'grid-4')}`, { tint: true, id: '' });

const others = `
<section class="wrap others">
  <h2 class="sub-t">The rest of the menu</h2>
  <div class="chips">${CATEGORIES.filter((x) => x.id !== c.id).map((x) => chip(x, { href: '01-menu.html' })).join('')}</div>
</section>`;

export const body = `${topBar({ back: true })}${hero}${related}${others}${footer()}`;
