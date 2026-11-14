#!/usr/bin/env node
/**
 * Renders the finished state of every scene to site/assets/img/posters/<id>.jpg.
 * Posters are the still-image fallback (no JS, slow connections, reduced data) and feed the hero
 * "finished work" tray, the work examples and the closing section.
 *
 * Needs the preview server running (node tools/serve.mjs) and Playwright with Chromium.
 *   node tools/posters.mjs [id ...]
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4173';
const manifest = await readFile(path.join(ROOT, 'site/assets/js/scenes/manifest.js'), 'utf8');
const all = [...manifest.matchAll(/\{ id: '([a-z]+)', cat:/g)].map((m) => m[1]);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 1 });
for (const id of ids) {
  await page.goto(`${BASE}/scene-lab?id=${id}&step=end&w=650`);
  await page.waitForSelector('html[data-lab-ready]', { timeout: 10000 });
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.querySelectorAll('.toast, .cur').forEach((e) => e.remove()));
  await page.waitForTimeout(120);
  await (await page.$('.mon__screen')).screenshot({ path: path.join(ROOT, 'site/assets/img/posters', id + '.jpg'), type: 'jpeg', quality: 80 });
  console.log('poster', id);
}
await browser.close();
