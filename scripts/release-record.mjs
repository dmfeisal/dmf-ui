#!/usr/bin/env node
// Release records: trace every vendored dmf-ui archive back to its source commit.
//
//   node scripts/release-record.mjs record [--commit <rev>]  Pack <rev> (default HEAD) from a clean
//                                                             Git worktree into releases/<version>/.
//   node scripts/release-record.mjs verify <archive.tgz>...   Compare archives with the recorded SHA-256.
//   node scripts/release-record.mjs check                     Validate the shape of every record.
//
// Archives are packed with --ignore-scripts from committed source only, matching how every
// vendored archive has been produced. Records are immutable: an existing version is never rewritten.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync, copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, join, resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const releases = join(root, 'releases');
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).trim();
const sha256 = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const fail = message => {console.error(message); process.exit(1);};

function record(rev = 'HEAD') {
  const commit = git('rev-parse', '--verify', `${rev}^{commit}`);
  const version = JSON.parse(git('show', `${commit}:package.json`)).version;
  if (!VERSION.test(version)) fail(`Invalid version ${version} at ${commit}.`);
  const dir = join(releases, version);
  if (existsSync(dir)) fail(`releases/${version} already exists. Released versions are immutable; bump package.json and package-lock.json first.`);
  const work = mkdtempSync(join(tmpdir(), 'dmf-ui-release-'));
  const tree = join(work, 'tree');
  try {
    git('worktree', 'add', '--quiet', '--detach', tree, commit);
    const [pack] = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', work], {cwd: tree, encoding: 'utf8'}));
    if (pack.version !== version) fail(`Packed ${pack.version}, expected ${version}.`);
    mkdirSync(dir, {recursive: true});
    copyFileSync(join(work, pack.filename), join(dir, pack.filename));
    writeFileSync(join(dir, 'SHA256SUMS'), `${sha256(join(dir, pack.filename))}  ${pack.filename}\n`);
    writeFileSync(join(dir, 'SOURCE-COMMIT'), `${commit}\n`);
    writeFileSync(join(dir, 'pack.json'), `${JSON.stringify([pack], null, 2)}\n`);
    console.log(`Recorded releases/${version} from ${commit.slice(0, 12)} (${pack.integrity}).`);
  } finally {
    try {git('worktree', 'remove', '--force', tree);} catch {}
    rmSync(work, {recursive: true, force: true});
  }
}

function records() {
  if (!existsSync(releases)) return [];
  return readdirSync(releases, {withFileTypes: true}).filter(e => e.isDirectory()).map(e => {
    const dir = join(releases, e.name);
    const read = name => existsSync(join(dir, name)) ? readFileSync(join(dir, name), 'utf8') : null;
    return {version: e.name, dir, sums: read('SHA256SUMS'), commit: read('SOURCE-COMMIT'), pack: read('pack.json')};
  });
}

function check() {
  const problems = [];
  const all = records();
  for (const r of all) {
    const at = `releases/${r.version}`;
    if (!VERSION.test(r.version)) problems.push(`${at}: folder is not a version`);
    if (!r.sums || !r.commit || !r.pack) {problems.push(`${at}: needs SHA256SUMS, SOURCE-COMMIT and pack.json`); continue;}
    const file = `dmf-ui-${r.version}.tgz`;
    if (!new RegExp(`^[0-9a-f]{64}  ${file.replace(/\./g, '\\.')}\\n$`).test(r.sums)) problems.push(`${at}/SHA256SUMS: expected one "<sha256>  ${file}" line`);
    if (!/^[0-9a-f]{40}\n$/.test(r.commit)) problems.push(`${at}/SOURCE-COMMIT: expected one full commit SHA`);
    let pack;
    try {[pack] = JSON.parse(r.pack);} catch {problems.push(`${at}/pack.json: invalid JSON`); continue;}
    if (pack?.name !== 'dmf-ui' || pack.version !== r.version || pack.filename !== file || !/^sha512-/.test(pack.integrity ?? '')) problems.push(`${at}/pack.json: name, version, filename or integrity does not match`);
  }
  if (problems.length) fail(problems.join('\n'));
  console.log(`${all.length} release record(s) are well formed.`);
}

function verify(files) {
  if (!files.length) fail('Pass one or more archive paths.');
  let ok = true;
  for (const file of files) {
    const name = basename(file);
    const r = records().find(r => r.sums?.endsWith(`  ${name}\n`));
    const actual = sha256(file);
    if (!r) {ok = false; console.error(`${name}: no release record`); continue;}
    if (!r.sums.startsWith(actual)) {ok = false; console.error(`${name}: SHA-256 ${actual} does not match releases/${r.version}`); continue;}
    console.log(`${name}: matches releases/${r.version} (source ${r.commit.trim().slice(0, 12)})`);
  }
  if (!ok) process.exit(1);
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'record') {
  const at = args.indexOf('--commit');
  record(at === -1 ? 'HEAD' : args[at + 1]);
} else if (mode === 'verify') verify(args);
else if (mode === 'check') check();
else fail('Usage: release-record.mjs record [--commit <rev>] | verify <archive.tgz>... | check');
