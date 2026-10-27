// 01 Menu, Design C "Color Blocks". Responsive QR menu (phone, tablet, desktop). Hand-built, no Stitch AI.
// Spec: .stitch/prompts/design-c.md. Tokens + components: ./theme.mjs.
// Structure: top bar + stripe > tagline > sticky colour nav > one solid colour block per category > footer.
// Icons are Material Symbols placeholders; `stitch-icons apply` swaps them for MingCute.

import {
  BRAND, CATEGORIES, drinksIn, ar, topBar, catNav, grid, blockHead, block, footer, navSpyScript,
  fonts, colors, baseCss,
} from './theme.mjs';

export { fonts, colors, baseCss };
export const file = '01-menu';
export const title = 'Menu';

const DETAIL = '02-drink-detail.html';

export const css = '';

const intro = `
<section class="wrap intro">
  <h1 class="tag"><span class="tag-a">Your Choice.</span> <span class="tag-b">Your Point Of View.</span></h1>
  ${ar(BRAND.taglineAr, 'tag-ar')}
  <p class="intro-note">Tap a colour to jump to it · Prices in ${BRAND.currency}</p>
</section>`;

const blocks = CATEGORIES.map((c) => {
  const drinks = drinksIn(c.id);
  return block(c, `${blockHead(c)}${grid(drinks, DETAIL)}`, { solo: drinks.length === 1 });
}).join('');

export const body = `${topBar()}${intro}${catNav({ active: CATEGORIES[0].id })}${blocks}${footer()}${navSpyScript}`;
