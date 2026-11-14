#!/usr/bin/env node
/**
 * Verification run for the redesigned public site. Needs the preview server (node tools/serve.mjs),
 * which sends the production Content-Security-Policy, and Playwright with Chromium.
 *
 *   node tools/verify.mjs            runs every check and writes docs/screenshots/*.png
 *
 * Exit code 1 if any check fails.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4173';
const SHOTS = path.join(ROOT, 'docs/screenshots');
await mkdir(SHOTS, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  ' + detail : '')); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
async function open(url, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1440, height: 900 }, deviceScaleFactor: opts.dpr || 1, reducedMotion: opts.reduce ? 'reduce' : 'no-preference', ...(opts.device || {}) });
  await ctx.addInitScript((theme) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || e.sourceFile || '')));
    if (theme) { try { localStorage.setItem('allai-theme', theme); } catch (e) { /* ignore */ } }
  }, opts.theme || '');
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/api/')) errs.push(r.status() + ' ' + r.url()); });
  await page.goto(BASE + url, { waitUntil: 'load' });
  return { ctx, page, errs };
}

/* 1. every page, both themes: no console errors, no CSP violations, no horizontal overflow */
for (const p of ['/', '/how-it-works', '/services', '/pricing', '/about', '/faq', '/scene-lab?id=excel']) {
  for (const theme of ['dark', 'light']) {
    const { ctx, page, errs } = await open(p, { theme });
    await sleep(p === '/' ? 3500 : 1200);
    if (p === '/') { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await sleep(1500); await page.evaluate(() => window.scrollTo(0, 0)); }
    const r = await page.evaluate(() => ({ csp: window.__csp, over: document.documentElement.scrollWidth - innerWidth, theme: document.documentElement.getAttribute('data-theme') }));
    check(`page ${p} [${theme}] loads clean`, errs.length === 0 && r.csp.length === 0 && r.over <= 0 && r.theme === theme, [...errs, ...r.csp].slice(0, 3).join(' | ') + (r.over > 0 ? ' overflow ' + r.over : ''));
    await ctx.close();
  }
}

/* 2. hero: autoplay, pause, replay, task selection */
{
  const { ctx, page } = await open('/');
  await sleep(4500);
  const st = () => page.evaluate(() => { const p = window.ALLAI.players[0]; return { id: p.id, k: p.k, n: p.n, state: p.state }; });
  const a = await st();
  check('hero autoplays the first job', a.state === 'playing' && a.id === 'word', JSON.stringify(a));
  check('headline, sub-line and primary CTA are in the first desktop screen', await page.evaluate(() => ['.hero .h1', '.hero__sub', '.hero .btn'].every((s) => { const r = document.querySelector(s).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })));
  await page.click('[data-hero-ctl] [data-act="toggle"]');
  const b1 = await st(); await sleep(1800); const b2 = await st();
  check('hero pause holds the demonstration', b2.state === 'paused' && b1.k === b2.k, JSON.stringify(b2));
  await page.click('[data-hero-ctl] [data-act="replay"]'); await sleep(1500);
  const c = await st();
  check('hero replay restarts the sequence', c.state === 'playing' && c.id === 'word' && c.k <= 2, JSON.stringify(c));
  await page.click('[data-hero-chips] .chip:nth-child(3)'); await sleep(1500);
  const d = await st();
  check('selecting a task interrupts rotation and plays that task', d.id === 'code' && d.state === 'playing' && await page.evaluate(() => document.querySelector('[data-hero-chips] .chip:nth-child(3)').getAttribute('aria-pressed') === 'true'), JSON.stringify(d));
  await page.screenshot({ path: path.join(SHOTS, 'desktop-hero-dark.png') });
  /* full hero sequence length */
  const dur = await page.evaluate(() => { const A = window.ALLAI; let t = 3.8; A.heroOrder.forEach((id) => { let s = 450; A.scenes[id].steps.forEach((x) => { s += x.d || 1200; }); t += s / A.heroSpeed / 1000 + 0.9; }); return t; });
  check('hero sequence runs roughly 28 to 36 seconds', dur >= 28 && dur <= 36, dur.toFixed(1) + ' s');
  await ctx.close();
}

/* 3. guide assistant stays closed until the help button is pressed; FitCheck stays compact */
{
  const { ctx, page } = await open('/');
  await sleep(6000);
  const closed = await page.evaluate(() => { const d = document.querySelector('.mm-dock'); return !!d && getComputedStyle(d).display === 'none'; });
  check('guide assistant is hidden on arrival', closed);
  const fc = await page.evaluate(() => { const b = document.querySelector('.fc-bar'); return b ? b.getBoundingClientRect().height : -1; });
  check('FitCheck announcement is present and compact', fc > 0 && fc <= 40, fc + 'px');
  await page.click('[data-help]'); await sleep(1200);
  const opened = await page.evaluate(() => { const d = document.querySelector('.mm-dock'), b = d && d.querySelector('.mm-bubble'); return !!d && getComputedStyle(d).display !== 'none' && !!b && !b.hidden && (d.querySelector('.mm-text').textContent || '').length > 10; });
  check('help button opens the guide with its introduction', opened);
  await ctx.close();
}

/* 4. scroll story: forward and reverse */
{
  const { ctx, page } = await open('/');
  await sleep(2500);
  const at = async (f) => { await page.evaluate((f) => { const t = document.querySelector('.story__track'), r = t.getBoundingClientRect(); window.scrollTo(0, r.top + scrollY + f * (r.height - innerHeight)); }, f); await sleep(1500); return page.evaluate(() => { const on = [...document.querySelectorAll('.story__t')].findIndex((e) => e.classList.contains('is-on')); const p = window.ALLAI.players.find((x) => x.host.closest('.story__ws')); return { stage: on, k: p ? p.k : -1, n: p ? p.n : -1, req: document.querySelector('[data-story-req]').textContent.length }; }); };
  const s0 = await at(0.02), s1 = await at(0.4), s2 = await at(0.65), s3 = await at(0.97);
  check('story advances through four stages on scroll', s0.stage === 0 && s1.stage === 1 && s2.stage === 2 && s3.stage === 3 && s0.k === 0 && s1.k > 0 && s2.k > s1.k && s3.k === s3.n, JSON.stringify([s0, s1, s2, s3]));
  await page.screenshot({ path: path.join(SHOTS, 'desktop-story-result.png') });
  const b2 = await at(0.65), b1 = await at(0.4), b0 = await at(0.02);
  check('story reverses cleanly when scrolling back', b2.stage === 2 && b1.stage === 1 && b0.stage === 0 && b0.k === 0 && b2.k === s2.k && b1.k === s1.k, JSON.stringify([b2, b1, b0]));
  const sticky = await page.evaluate(() => getComputedStyle(document.querySelector('.story__pin')).position);
  check('story is pinned with CSS sticky on desktop', sticky === 'sticky');
  await page.evaluate(() => document.querySelector('#tasks').scrollIntoView()); await sleep(800);
  const top = await page.evaluate(() => Math.round(document.querySelector('#tasks').getBoundingClientRect().top));
  check('anchor after the pinned section lands accurately', Math.abs(top) < 140, 'top=' + top);
  await ctx.close();
}

/* 5. gallery: 16 tasks, categories, switching, scrubber */
{
  const { ctx, page } = await open('/');
  await page.evaluate(() => document.querySelector('#tasks').scrollIntoView()); await sleep(3000);
  const total = await page.evaluate(() => window.ALLAI.manifest.length);
  let seen = 0;
  for (let i = 1; i <= 4; i++) { await page.click(`[data-gal-tabs] .chip:nth-child(${i})`); await sleep(250); seen += await page.locator('[data-gal-list] .task').count(); }
  check('gallery exposes all 16 scenes in four categories', total === 16 && seen === 16, `${seen}/${total}`);
  await page.click('[data-gal-tabs] .chip:nth-child(2)'); await sleep(300);
  await page.click('[data-gal-list] .task[data-id="video"]'); await sleep(2500);
  const g = await page.evaluate(() => { const p = window.ALLAI.players.find((x) => x.host.closest('.gal__view')); return { id: p.id, state: p.state, req: document.querySelector('[data-gal-request]').textContent, app: document.querySelector('[data-gal-app]').textContent, res: document.querySelector('[data-gal-result]').textContent, status: document.querySelector('[data-gal-status]').textContent, cta: document.querySelector('[data-gal-cta]').getAttribute('href') }; });
  check('selecting a gallery task loads and plays it with request, application and result', g.id === 'video' && g.state === 'playing' && g.req.length > 10 && g.app.length > 3 && g.res.length > 10, g.id + ' ' + g.state);
  check('unconfirmed capabilities are labelled as examples with an ask-us link', /Example of computer work/.test(g.status) && /wa\.me/.test(g.cta));
  await page.locator('[data-gal-ctl] .pl__scrub').fill('3'); await sleep(500);
  const k = await page.evaluate(() => window.ALLAI.players.find((x) => x.host.closest('.gal__view')).k);
  check('gallery scrubber seeks to a step', k === 3, 'k=' + k);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-gallery.png') });
  await ctx.close();
}

/* 6. every scene: seek is deterministic in both directions (idempotent state) */
{
  const { ctx, page } = await open('/scene-lab?id=word&step=0');
  const ids = await page.evaluate(() => window.ALLAI.manifest.map((m) => m.id));
  let bad = [];
  for (const id of ids) {
    await page.goto(`${BASE}/scene-lab?id=${id}&step=0`); await page.waitForSelector('html[data-lab-ready]');
    const res = await page.evaluate(async () => {
      const p = window.__player, snap = () => p.root.className + '|' + [...p.root.querySelectorAll('*')].map((e) => (e.getAttribute('class') || '') + ':' + (e.children.length ? '' : e.textContent)).join('~');
      const wait = () => new Promise((r) => setTimeout(r, 30));
      const fresh = []; for (let k = 0; k <= p.n; k++) { p.seek(k); await wait(); fresh.push(snap()); }
      const fails = [];
      for (let k = p.n; k >= 0; k--) { p.seek(p.n); p.seek(0); p.seek(Math.max(0, k - 2)); p.seek(k); await wait(); if (snap() !== fresh[k]) fails.push(k); }
      return { n: p.n, fails, steps: p.steps.every((s) => s.id && s.label) };
    });
    if (res.fails.length || !res.steps || res.n < 5) bad.push(id + ':' + res.fails.join(','));
  }
  check('all 16 scenes seek deterministically forwards and backwards', bad.length === 0, bad.join(' '));
  await ctx.close();
}

/* 7. pricing toggle, plan links, FAQ accordion, theme switch, onboarding links */
{
  const { ctx, page } = await open('/');
  await page.evaluate(() => document.querySelector('#pricing').scrollIntoView()); await sleep(900);
  await page.click('[data-price-toggle] button[data-v="addon"]'); await sleep(700);
  const pr = await page.evaluate(() => ({ on: document.querySelector('[data-plans]').classList.contains('is-addon'), h: document.querySelector('.plan__addon').getBoundingClientRect().height, prices: [...document.querySelectorAll('.plan__p')].map((e) => e.textContent.trim()), addons: [...document.querySelectorAll('.plan__addon b')].map((e) => e.textContent.trim()), links: [...document.querySelectorAll('.plan .btn')].map((a) => a.getAttribute('href')) }));
  check('pricing toggle reveals the separately billed add-on', pr.on && pr.h > 20);
  check('prices and plan links match the existing pricing', pr.prices.join() === '$79,$200,$300' && pr.addons.join() === '+ $30/mo,+ $100/mo,+ $200/mo' && pr.links.join() === '/plans?plan=helper,/plans?plan=teammate,/plans?plan=expert', pr.prices.join() + ' ' + pr.links.join());
  await page.screenshot({ path: path.join(SHOTS, 'desktop-pricing.png') });
  await page.evaluate(() => document.querySelector('#faq').scrollIntoView()); await sleep(700);
  await page.click('details.qa:nth-of-type(2) summary'); await sleep(700);
  const open2 = await page.evaluate(() => document.querySelector('details.qa:nth-of-type(2)').open);
  await page.click('details.qa:nth-of-type(2) summary'); await sleep(700);
  const closed2 = await page.evaluate(() => !document.querySelector('details.qa:nth-of-type(2)').open);
  check('FAQ items expand and collapse', open2 && closed2);
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(500);
  await page.click('.nv [data-theme-toggle]'); await sleep(500);
  const th = await page.evaluate(() => ({ t: document.documentElement.getAttribute('data-theme'), saved: localStorage.getItem('allai-theme'), bg: getComputedStyle(document.body).backgroundColor }));
  check('theme toggle switches to the light theme and remembers it', th.t === 'light' && th.saved === 'light' && th.bg !== 'rgb(6, 8, 13)', JSON.stringify(th));
  await sleep(2500); await page.screenshot({ path: path.join(SHOTS, 'desktop-hero-light.png') });
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))]);
  const need = ['/plans', '/login', '/signup', '/audit', '/privacy', '/terms', '/refunds', '/how-it-works', '/services', '/pricing', '/about', '/faq', 'mailto:hello@allai.co.zw'];
  const missing = need.filter((h) => !hrefs.includes(h));
  check('account, onboarding, legal and contact links are preserved', missing.length === 0 && hrefs.some((h) => h.startsWith('https://wa.me/263715096121')), missing.join(' '));
  let broken = [];
  for (const h of hrefs.filter((x) => x.startsWith('/'))) { const r = await page.request.get(BASE + h); if (r.status() !== 200) broken.push(h + ' ' + r.status()); }
  check('every internal link resolves', broken.length === 0, broken.join(' '));
  await ctx.close();
}

/* 8. reduced motion: no autoplay, no pinning, finished states shown, controls still work */
{
  const { ctx, page } = await open('/', { reduce: true });
  await sleep(4000);
  const r = await page.evaluate(() => { const p = window.ALLAI.players[0]; return { state: p.state, k: p.k, n: p.n, flat: document.querySelector('[data-story]').classList.contains('is-flat'), split: getComputedStyle(document.querySelector('.hero .h1 .w > span')).transform }; });
  check('reduced motion: hero rests on the finished result, story is unpinned', r.state !== 'playing' && r.k === r.n && r.flat, JSON.stringify(r));
  await page.click('[data-hero-ctl] [data-act="replay"]'); await sleep(2500);
  const r2 = await page.evaluate(() => window.ALLAI.players[0].state);
  check('reduced motion: the visitor can still start the demonstration', r2 === 'playing' || r2 === 'done', r2);
  await ctx.close();
}

/* 9. phone: one screen, unpinned story, no overflow, readable framing, offscreen pause */
{
  const { ctx, page, errs } = await open('/', { device: devices['iPhone 13'], dpr: 2 });
  await sleep(5000);
  const m = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - innerWidth, sides: [...document.querySelectorAll('.hero .mon--side')].every((e) => getComputedStyle(e).display === 'none'), flat: document.querySelector('[data-story]').classList.contains('is-flat'), cta: document.querySelector('.hero .btn').getBoundingClientRect().bottom < innerHeight, zoom: parseFloat(getComputedStyle(document.querySelector('.hero .scr__cam')).getPropertyValue('--cz') || '1') }));
  check('phone: one screen, CTA early, story unpinned, no horizontal overflow', m.over <= 0 && m.sides && m.flat && m.cta && errs.length === 0, JSON.stringify(m) + errs.join());
  check('phone: the screen frames the work area for readability', m.zoom > 1.15, 'zoom ' + m.zoom);
  await page.evaluate(() => document.querySelector('.hero__stage').scrollIntoView()); await sleep(700);
  await page.screenshot({ path: path.join(SHOTS, 'mobile-hero.png') });
  await page.evaluate(() => { document.querySelector('.gal__grid').scrollIntoView(); scrollBy(0, -60); }); await sleep(5000);
  await page.screenshot({ path: path.join(SHOTS, 'mobile-gallery.png') });
  const held = await page.evaluate(() => window.ALLAI.players[0]._held);
  check('offscreen demonstrations are paused', held === true);
  await page.evaluate(() => document.querySelector('#pricing').scrollIntoView()); await sleep(900);
  await page.screenshot({ path: path.join(SHOTS, 'mobile-pricing.png') });
  await ctx.close();
}

/* 10. unchanged vendor bundle, no forbidden markup, lazy loading */
{
  const sha = (f) => readFile(path.join(ROOT, f)).then((b) => createHash('sha256').update(b).digest('hex').slice(0, 16));
  check('existing assistant bundle is byte-for-byte unchanged', (await sha('site/static/pub/public-ui.js')) === '966380599c3d1b34', await sha('site/static/pub/public-ui.js'));
  const html = await readFile(path.join(ROOT, 'site/index.html'), 'utf8');
  check('no inline styles, inline scripts, video or external hosts in the homepage', !/\sstyle=|<style|<video|<audio|<script>(?!<)/.test(html) && !/(src|href)="https?:\/\/(?!allai\.co\.zw|wa\.me)/.test(html));
  const { ctx, page } = await open('/');
  const early = [];
  page.on('request', (r) => { if (/scenes\/(excel|video|social|property|design|support|workflow|slides)\./.test(r.url())) early.push(r.url()); });
  await page.reload(); await sleep(3000);
  check('scenes below the fold are not downloaded on first view', early.length === 0, early.length + ' early requests');
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
