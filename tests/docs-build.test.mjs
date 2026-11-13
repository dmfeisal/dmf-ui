import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Checks the built documentation site (CI runs `npm run build` before `npm test`).
const built = existsSync('dist/index.html');
const pages = async () => (await readdir('dist', { recursive: true })).filter(path => path.endsWith('index.html')).map(path => join('dist', path));
// The React proof and Discovery demonstrate the React consumer stylesheet next to the docs build, by design (M11).
const reactProofPages = new Set(['dist/examples/react/index.html', 'dist/examples/discovery/index.html']);
const tokenBlock = '.dmf-ui{--dmf-space-0:';

test('search entries are served once, not inlined into every page', { skip: !built && 'run npm run build first' }, async () => {
  const entries = JSON.parse(await readFile('dist/search-index.json', 'utf8'));
  assert(Array.isArray(entries) && entries.length > 100, 'search index has entries');
  for (const entry of entries) for (const key of ['title', 'description', 'href', 'group', 'keywords']) assert.equal(typeof entry[key], 'string', `${entry.title}: ${key}`);
  let dialogs = 0;
  for (const page of await pages()) {
    const html = await readFile(page, 'utf8');
    assert(!html.includes('docs-search-index'), `${page} inlines the search index`);
    if (html.includes('id="docs-search-dialog"')) { dialogs++; assert(html.includes('data-search-index="/search-index.json"'), `${page} points search at the shared index`); }
  }
  assert(dialogs > 100, 'documentation pages carry the search dialog');
});

test('no page loads two builds of the DMF UI stylesheet', { skip: !built && 'run npm run build first' }, async () => {
  const cache = new Map();
  const hasTokens = async href => { if (!cache.has(href)) cache.set(href, (await readFile(join('dist', href), 'utf8')).includes(tokenBlock)); return cache.get(href); };
  let checked = 0;
  for (const page of await pages()) {
    const html = await readFile(page, 'utf8');
    const sheets = [...new Set([...html.matchAll(/href="\/(_astro\/[^"]+\.css)"/g)].map(match => match[1]))];
    const builds = [];
    for (const sheet of sheets) if (await hasTokens(sheet)) builds.push(sheet);
    if (reactProofPages.has(page)) assert.equal(builds.length, 2, `${page} pairs the docs build with the React stylesheet`);
    else assert(builds.length <= 1, `${page} loads ${builds.length} DMF UI builds: ${builds.join(', ')}`);
    checked++;
  }
  assert(checked > 100);
});
