import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, access } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, copiedFiles, astroSource, coreSource } from '../packages/core/build.mjs';

const pkg = JSON.parse(await readFile('packages/core/package.json', 'utf8'));
const rootPkg = JSON.parse(await readFile('package.json', 'utf8'));
const files = async dir => (await readdir(dir, { recursive: true, withFileTypes: true })).filter(e => e.isFile()).map(e => relative(dir, join(e.parentPath, e.name))).sort();

test('@dmf-ui/core is built only from repository sources, byte for byte', async () => {
  // Inside the repository so the compiled variants resolve class-variance-authority from node_modules.
  await mkdir('.dmf-ui-test-results', { recursive: true });
  const out = await mkdtemp(join(process.cwd(), '.dmf-ui-test-results', 'core-'));
  try {
    await build(out);
    const copies = await copiedFiles();
    for (const [from, to] of copies) assert((await readFile(from)).equals(await readFile(join(out, to))), `${to} differs from ${from}`);
    const derived = ['styles/dmf-ui.css', 'button/variants.js', 'button/variants.d.ts'];
    assert.deepEqual(await files(out), [...copies.map(([, to]) => to), ...derived].sort(), 'dist holds only copied and derived files');

    const root = await readFile('src/styles/dmf-ui.css', 'utf8');
    assert.equal(await readFile(join(out, 'styles/dmf-ui.css'), 'utf8'), root.replace(astroSource, coreSource), 'core stylesheet differs from the root one only by its scan');
    for (const [, path] of [...root.matchAll(/@import "\.\/([^"]+)"/g)]) await access(join(out, 'styles', path));
    assert(!/@source[^;]*components/.test(await readFile(join(out, 'styles/dmf-ui.css'), 'utf8')), 'core stylesheet scans no Astro components');

    const { buttonVariants } = await import(pathToFileURL(join(out, 'button/variants.js')));
    const source = await readFile('src/components/dmf-ui/button/button-variants.ts', 'utf8');
    for (const cls of buttonVariants({ variant: 'outline', size: 'sm' }).split(' ')) assert(source.includes(cls), `compiled variant class ${cls} is in the source`);
    assert.match(await readFile(join(out, 'button/variants.d.ts'), 'utf8'), /export declare const buttonVariants/);

    for (const [name, target] of Object.entries(pkg.exports)) {
      const path = typeof target === 'string' ? target : target.import;
      if (name === './package.json' || path.includes('*')) continue;
      await access(join(out, path.replace(/^\.\/dist\//, '')));
      if (typeof target !== 'string') await access(join(out, target.types.replace(/^\.\/dist\//, '')));
    }
  } finally { await rm(out, { recursive: true, force: true }); }
});

test('@dmf-ui/core declares no Astro or component runtime dependency', () => {
  const declared = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.optionalDependencies };
  assert.deepEqual(Object.keys(declared).sort(), ['class-variance-authority', 'tailwindcss', 'tw-animate-css']);
  for (const name of ['class-variance-authority', 'tw-animate-css']) assert.equal(pkg.dependencies[name], rootPkg.dependencies[name], `${name} matches dmf-ui`);
  assert.equal(pkg.peerDependencies.tailwindcss, rootPkg.peerDependencies.tailwindcss);
  assert.equal(pkg.private, true);
  assert.deepEqual(pkg.files, ['dist', 'README.md']);
});


test('the packed React consumer lock installs core without Astro or component runtimes', async () => {
  const lock = JSON.parse(await readFile('tests/fixtures/react-consumer/package-lock.json.template', 'utf8'));
  const names = Object.keys(lock.packages).filter(key => key.startsWith('node_modules/')).map(key => key.slice(key.lastIndexOf('node_modules/') + 13));
  assert(names.includes('@dmf-ui/core') && names.includes('@dmf-ui/react'));
  const forbidden = names.filter(name => name === 'dmf-ui' || name === 'astro' || /^@astrojs\/|^@data-slot\/|^@lucide\/astro$/.test(name));
  assert.deepEqual(forbidden, [], 'React consumers must not install the Astro package graph');
  assert.equal(lock.packages['']?.dependencies?.['dmf-ui'], undefined);
});
