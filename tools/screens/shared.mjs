// Shared tokens, menu data and helpers for the hand-built POV QR menu screens.
// Menu names, Arabic names and prices are copied verbatim from .stitch/prompts/menu-style.md.
// Never invent Arabic: only use the `ar` strings below.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---------- design tokens ("Mango Pop") ----------
export const C = {
  canvas: '#FFF8E7', card: '#FFFFFF', ink: '#2A1640', muted: '#6F6280', line: '#F1E6CC',
  purple: '#7243AB', yellow: '#F9CD18', orange: '#F7941D', teal: '#17AE9D', coral: '#F2654A',
  purpleSoft: '#EFE6FA', yellowSoft: '#FFF1B8', orangeSoft: '#FFE6C7', tealSoft: '#D6F3EE', coralSoft: '#FDE1DA',
};

export const BRAND = {
  name: 'POV', ar: 'بوف',
  tagline: 'Your Choice. Your Point Of View.', taglineAr: 'اختيارك ... وجهة نظرك',
  currency: 'EGP', currencyAr: 'ج.م',
};

// ---------- menu ----------
export const CATEGORIES = [
  { id: 'signatures', en: 'Mango Signatures', ar: 'مانجو بوف المميزة', color: 'yellow' },
  { id: 'cubes', en: 'Fresh Cubes', ar: 'مكعبات فريش', color: 'orange' },
  { id: 'smoothies', en: 'Smoothies & Shakes', ar: 'سموذي وميلك شيك', color: 'purple' },
  { id: 'juices', en: 'Fresh Juices', ar: 'عصائر فريش', color: 'teal' },
  { id: 'seasonal', en: 'Seasonal', ar: 'أصناف الموسم', color: 'coral' },
];

// `note` is the English descriptor from the style block (may be empty).
export const DRINKS = [
  { id: 'pov-mango', cat: 'signatures', en: 'POV Mango', ar: 'مانجو بوف', price: 95, note: '' },
  { id: 'pov-classic', cat: 'signatures', en: 'POV Classic', ar: 'كلاسيك بوف', price: 110, note: 'Mango with milk' },
  { id: 'mango-strawberry', cat: 'signatures', en: 'Mango x Strawberry', ar: 'مانجو فراولة', price: 115, note: '' },
  { id: 'mango-passion', cat: 'signatures', en: 'Mango Passion', ar: 'مانجو باشن', price: 125, note: '' },
  { id: 'pov-cocktail', cat: 'signatures', en: 'POV Cocktail', ar: 'كوكتيل بوف', price: 145, note: 'Layered mango, strawberry, guava, avocado' },
  { id: 'mango-cubes', cat: 'cubes', en: 'Mango Cubes', ar: 'كوب مكعبات مانجو', price: 85, note: 'Cup' },
  { id: 'mango-smoothie', cat: 'smoothies', en: 'Mango Smoothie', ar: 'سموذي مانجو', price: 120, note: '' },
  { id: 'mango-milkshake', cat: 'smoothies', en: 'Mango Milkshake', ar: 'ميلك شيك مانجو', price: 135, note: '' },
  { id: 'fresh-orange', cat: 'juices', en: 'Fresh Orange', ar: 'برتقال فريش', price: 70, note: '' },
  { id: 'strawberry', cat: 'juices', en: 'Strawberry', ar: 'فراولة', price: 85, note: '' },
  { id: 'watermelon-mint', cat: 'juices', en: 'Watermelon Mint', ar: 'بطيخ بالنعناع', price: 75, note: '' },
  { id: 'guava-nectar', cat: 'juices', en: 'Guava Nectar', ar: 'جوافة', price: 80, note: '' },
  { id: 'sugarcane-lime', cat: 'juices', en: 'Sugarcane Lime', ar: 'قصب بالليمون', price: 60, note: '' },
  { id: 'pomegranate-press', cat: 'seasonal', en: 'Pomegranate Press', ar: 'رمان', price: 105, note: '' },
  { id: 'keitt-last-call', cat: 'seasonal', en: 'Keitt Last Call', ar: 'مانجو كيت آخر الموسم', price: 130, note: 'Mango, end of season' },
];

export const drinksIn = (catId) => DRINKS.filter((d) => d.cat === catId);
export const drink = (id) => DRINKS.find((d) => d.id === id);

// ---------- photos ----------
// .stitch/menu-photos.json maps a drink id (or "hero") to a repo-root path (assets/photos/<id>.jpg).
// Photos are self-hosted: Stitch's lh3.googleusercontent.com/aida links expire (403) after a while.
// Screens live in screens/<design>/, so paths are emitted relative to that (works on file:// and Vercel).
// For a Stitch upload, swap the "../../" prefix for the deployed https origin.
const PHOTO_FILE = path.join(ROOT, '.stitch', 'menu-photos.json');
const PHOTOS = fs.existsSync(PHOTO_FILE) ? JSON.parse(fs.readFileSync(PHOTO_FILE, 'utf8')) : {};
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><rect width="4" height="4" fill="${C.yellowSoft}"/></svg>`,
)}`;
export const photo = (key) => (PHOTOS[key] ? `../../${PHOTOS[key]}` : PLACEHOLDER);

// ---------- helpers ----------
// Icons are Material Symbols names (placeholders). `node tools/stitch-icons.mjs apply` swaps them for MingCute.
export const ic = (name, cls = '', fill = false) =>
  `<span class="material-symbols-outlined ico ${cls}"${fill ? ` style="font-variation-settings:'FILL' 1"` : ''}>${name}</span>`;

export const ar = (text, cls = '') => `<span lang="ar" dir="rtl" class="ar ${cls}">${text}</span>`;

// Rounded diamond "mango cube" from the logo. size in px, color is a token name or hex.
export const cube = (size, color, style = '') =>
  `<span class="cube" style="width:${size}px;height:${size}px;background:${C[color] || color};${style}"></span>`;

export const dot = (size, color, style = '') =>
  `<span class="dot" style="width:${size}px;height:${size}px;background:${C[color] || color};${style}"></span>`;

// Sticker-style price tag: rotated, rounded, bold purple on yellow (or coral).
export const priceTag = (price, { color = 'yellow', rotate = -4, cls = '' } = {}) =>
  `<span class="price-tag ${cls}" style="background:${C[color]};transform:rotate(${rotate}deg)"><b>${price}</b><small>${BRAND.currency}</small></span>`;

// Wordmark "POV": P purple, O yellow, V teal.
export const wordmark = (size = 28) =>
  `<span class="wordmark" style="font-size:${size}px"><span style="color:${C.purple}">P</span><span style="color:${C.yellow}">O</span><span style="color:${C.teal}">V</span></span>`;

export const BASE_CSS = `
*{box-sizing:border-box}
html,body{margin:0;background:${C.canvas};color:${C.ink};font-family:'Readex Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.screen{max-width:430px;margin:0 auto;min-height:100vh;position:relative;overflow:hidden}
.ar{font-family:'Readex Pro',sans-serif;unicode-bidi:isolate}
.ico{font-size:22px;line-height:1}
.cube{display:inline-block;border-radius:28%;transform:rotate(45deg);flex-shrink:0}
.dot{display:inline-block;border-radius:50%;flex-shrink:0}
.price-tag{display:inline-flex;align-items:baseline;gap:3px;padding:6px 11px;border-radius:14px;color:${C.purple};font-weight:700;line-height:1;box-shadow:0 6px 14px -8px rgba(42,22,64,.45);white-space:nowrap}
.price-tag b{font-size:17px;font-weight:700}
.price-tag small{font-size:10px;font-weight:600;letter-spacing:.04em}
.wordmark{font-weight:700;letter-spacing:-.04em;line-height:1}
.z{position:relative;z-index:1}
`;
