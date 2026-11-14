#!/usr/bin/env node
/**
 * Assembles the static pages in site/ from the page bodies in src/pages/.
 * The shared head, navigation, drawer, footer and help button live here so every page stays in step.
 *
 *   node tools/build.mjs
 *
 * Output is plain static HTML (no inline scripts or styles: the production CSP forbids them).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = '20261114a';
const WA = 'https://wa.me/263715096121?text=Hi%2C%20I%27m%20interested%20in%20an%20AI%20employee%20for%20my%20business.';
const ARR = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const NAV = [['/how-it-works', 'How it works'], ['/services', 'Services'], ['/pricing', 'Pricing'], ['/about', 'About'], ['/faq', 'FAQ']];

const PAGES = [
  { file: 'index', path: '/', home: true,
    title: 'All AI | Hire an AI employee for your African business',
    desc: 'All AI gives your business an AI employee with its own computer. It does your paperwork, builds your website and app, and takes on the other jobs you give it.' },
  { file: 'how-it-works', path: '/how-it-works', title: 'How it works | All AI',
    desc: 'Three steps, no tech skills needed. Choose a plan, tell your AI employee the first job, and it gets to work.' },
  { file: 'services', path: '/services', title: 'Services | All AI',
    desc: 'Paperwork, your website, your app, and any other job that can be done on a computer.' },
  { file: 'pricing', path: '/pricing', title: 'Pricing | All AI',
    desc: 'Helper $79 and Teammate $200 for small businesses. Expert $300 for small and mid-sized businesses. You can also start with a business audit.' },
  { file: 'about', path: '/about', title: 'About and contact | All AI',
    desc: 'All AI gives African businesses an AI employee. Contact us on WhatsApp or email.' },
  { file: 'faq', path: '/faq', title: 'FAQ | All AI',
    desc: 'Straight answers about what your AI employee can do, your data, tech skills, cost, stopping and language.' },
];

const head = (p) => `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="https://allai.co.zw${p.path === '/' ? '/' : p.path}">
<meta property="og:url" content="https://allai.co.zw${p.path === '/' ? '/' : p.path}">
<meta name="theme-color" content="#080b16">
<meta name="color-scheme" content="dark light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="All AI">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:image" content="https://allai.co.zw/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="All AI. Hire an AI employee for your business.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.desc}">
<meta name="twitter:image" content="https://allai.co.zw/og-image.png">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/dmsans.woff2" as="font" type="font/woff2" crossorigin>
<script src="/static/pub/theme-early.js"></script>
<script src="/assets/js/early.js?v=${V}"></script>
<meta name="allai-waitlist" content="on">
<link rel="stylesheet" href="/fonts.css?v=${V}">
<link rel="stylesheet" href="/assets/css/allai.css?v=${V}">
${p.home ? `<link rel="stylesheet" href="/assets/css/stage.css?v=${V}">
${['word', 'blender', 'code', 'game'].map((s) => `<link rel="stylesheet" href="/assets/css/scenes/${s}.css?v=${V}" data-scene="${s}">`).join('\n')}` : ''}
<link rel="stylesheet" href="/static/pub/mascot.css">
<script src="/assets/js/site.js?v=${V}" defer></script>
${p.home ? `<script src="/assets/js/scenes/manifest.js?v=${V}" defer></script>
<script src="/assets/js/scenes/media.js?v=${V}" defer></script>
<script src="/assets/js/stage.js?v=${V}" defer></script>
${['word', 'blender', 'code', 'game'].map((s) => `<script src="/assets/js/scenes/${s}.js?v=${V}" defer data-scene="${s}"></script>`).join('\n')}
<script src="/assets/js/home.js?v=${V}" defer></script>` : ''}
<script src="/static/pub/public-ui.js" defer></script>
</head>
<body class="pg${p.home ? ' pg--home' : ''}" data-no-arcade>
<a class="skip" href="#main">Skip to content</a>
<header class="nv" data-nav>
 <div class="nv__in">
  <a class="nv__logo" href="/" aria-label="All AI home"><img src="/assets/img/all-ai-logo-white.png" alt="All AI" width="800" height="800"></a>
  <nav class="nv__links" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${h === p.path ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="nv__end">
   <a class="nv__login" href="/login">Log in</a>
   <a class="btn btn--sm" href="/plans">Get started</a>
   <button type="button" class="theme-toggle" data-theme-toggle aria-pressed="true" aria-label="Dark mode" title="Switch between dark and light mode"><svg class="theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg><svg class="theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg></button>
   <button class="nv__burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><i></i></button>
  </div>
 </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
 <nav aria-label="Mobile">${NAV.map(([h, t]) => `<a href="${h}">${t}${ARR}</a>`).join('')}</nav>
 <div class="drawer__alt"><a class="btn" href="/plans">Get started</a><a href="/login">Log in</a><a href="/signup">Create a free account</a></div>
</div>
<main id="main">
`;

const foot = () => `
</main>
<footer class="ft">
 <div class="wrap">
  <div class="ft__grid">
   <div class="ft__brand"><a href="/" aria-label="All AI home"><img src="/assets/img/all-ai-logo-white.png" alt="All AI" width="800" height="800" loading="lazy"></a><p>One AI. Everything you need.</p></div>
   <div class="ft__cols">
    <div><h2 class="ft__h">Company</h2><ul><li><a href="/how-it-works">How it works</a></li><li><a href="/services">Services</a></li><li><a href="/pricing">Pricing</a></li><li><a href="/about">About</a></li></ul></div>
    <div><h2 class="ft__h">Help</h2><ul><li><a href="/faq">FAQ</a></li><li><a href="${WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a href="mailto:hello@allai.co.zw">hello@allai.co.zw</a></li><li><a href="/audit">Business audit</a></li></ul></div>
    <div><h2 class="ft__h">Account</h2><ul><li><a href="/login">Log in</a></li><li><a href="/signup">Sign up</a></li><li><a href="/plans">Plans</a></li></ul></div>
    <div><h2 class="ft__h">Legal</h2><ul><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li><li><a href="/refunds">Refunds</a></li></ul></div>
   </div>
  </div>
  <div class="ft__bot"><span>&copy; 2026 All AI. Built for African businesses.</span><span>WhatsApp: <a href="${WA}" target="_blank" rel="noopener noreferrer">+263 71 509 6121</a></span></div>
 </div>
</footer>
<button type="button" class="help" data-help aria-label="Open the All AI guide" title="Need a hand? Open the guide"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 9.2a2.9 2.9 0 1 1 4.3 2.5c-.9.5-1.5 1.2-1.5 2.3"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="9.4"/></svg></button>
</body>
</html>
`;

/* photo slots: every image in site/assets/img/media/ is listed in media.js; scenes use it in place of drawn art */
const mediaDir = path.join(ROOT, 'site/assets/img/media');
const media = {};
for (const f of (await readdir(mediaDir).catch(() => [])).sort()) { const m = f.match(/^([a-z0-9-]+)\.(jpg|jpeg|png|webp)$/i); if (m) media[m[1]] = f; }
await writeFile(path.join(ROOT, 'site/assets/js/scenes/media.js'), `/* generated by tools/build.mjs from site/assets/img/media/ (do not edit by hand) */\n(window.ALLAI = window.ALLAI || {}).media = ${JSON.stringify(media)};\n`);
console.log('media slots filled:', Object.keys(media).length ? Object.keys(media).join(', ') : 'none (drawn artwork is used)');

for (const p of PAGES) {
  let body = await readFile(path.join(ROOT, 'src/pages', p.file + '.html'), 'utf8');
  body = body.replaceAll('{{ARR}}', ARR).replaceAll('{{WA}}', WA).replaceAll('{{V}}', V);
  const html = head(p) + body.trim() + foot();
  if (/\sstyle=|<style|on(click|load|error)=/i.test(html)) throw new Error(`${p.file}: inline style or handler found (blocked by the production CSP)`);
  await writeFile(path.join(ROOT, 'site', p.file + '.html'), html);
  console.log('built site/' + p.file + '.html', (html.length / 1024).toFixed(1) + ' kB');
}
