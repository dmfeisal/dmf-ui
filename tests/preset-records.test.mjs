import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Keeps each past-work preset's prose consistent with its record in contracts/brands.json.
const { brands } = JSON.parse(await readFile('contracts/brands.json', 'utf8'));
const docs = { 'cb-ui': 'docs/DMF-UI-CB-PRESET.md', hui: 'docs/DMF-UI-HUI-PRESET.md', qdi: 'docs/DMF-UI-QDI-PRESET.md' };
// Paragraphs and table rows: a statement and its ratio may sit in adjacent sentences.
const blocks = text => text.split(/\n\s*\n|\n(?=\|)/);

test('preset docs describe the recorded primary label and its contrast exception', async () => {
  for (const [id, path] of Object.entries(docs)) {
    const text = await readFile(path, 'utf8'), policy = brands[id].actionTextPolicy;
    assert(!/label is (black|dark)|foreground for readable labels/i.test(text), `${path} contradicts the shipped primary label`);
    if (!policy) continue;
    assert.equal(policy.foreground.toLowerCase(), '#ffffff', `${id} policy is a white label`);
    const ratio = policy.contrastRatio.toFixed(2);
    assert(blocks(text).some(s => /primary/i.test(s) && /white/i.test(s) && s.includes(`${ratio}:1`) && /exception/i.test(s)), `${path} states the white primary label, ${ratio}:1 and that it is an exception`);
  }
});

test('light-only presets record the missing dark-mode source and claim no dark mode', async () => {
  for (const [id, path] of Object.entries(docs)) {
    const brand = brands[id], text = await readFile(path, 'utf8');
    if (brand.modes.join() !== 'light') continue;
    assert(brand.gaps.some(gap => /^No dark-mode source; .*light-only\.$/.test(gap)), `${id} gaps record no dark-mode source`);
    assert(/light[- ]only/i.test(text), `${path} says the preset is light-only`);
    assert(!/data-system="?[a-z-]+"?[^\n]*data-color-mode="dark"/.test(text), `${path} shows no dark usage`);
  }
});

test('HUI ships its Black headline weight and defaults h1 to it', async () => {
  const css = await readFile('src/styles/dmf-ui-hui.css', 'utf8');
  assert.match(css, /mplus-rounded-latin-900\.woff2'\) format\('woff2'\); font-style:normal; font-weight:900;/);
  // The headline is Black; the subheadline (Medium) is not mapped to heading levels, so only h1 gets 900.
  assert.match(brands.hui.typography.headline, /^Rounded Mplus Black\b/);
  assert(css.includes(':where(:root .dmf-ui[data-system="hui"]) h1:is(h1) { font-weight:900; }'), 'h1 defaults to 900 at specificity 0,0,2');
  assert(!brands.hui.gaps.some(gap => /Black headline/.test(gap) && /not/.test(gap)), 'the closed Black-weight gap is removed');
});
