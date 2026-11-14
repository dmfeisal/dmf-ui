// Vendors shadcn/ui base-nova references at the pinned revision (M15).
// `node scripts/shadcn-vendor.mjs --fetch` downloads them (network, run only when updating the pin).
// `node scripts/shadcn-vendor.mjs --check` verifies the vendored files against vendor/shadcn/MANIFEST.json offline.
// TSX sources are stored with a .txt extension so they stay data, never compiled code. Nothing here is packed.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const profile=JSON.parse(await readFile(new URL('contracts/design-profile.json',root),'utf8'));
const revision=profile.references.find(r=>r.name==='shadcn/ui').revision;
const manifestPath=new URL('vendor/shadcn/MANIFEST.json',root);
const hash=value=>createHash('sha256').update(value).digest('hex');

// shadcn base families. Shared ones are audited in M15; the rest are references for M17 and M28.
export const families=['accordion','alert','alert-dialog','aspect-ratio','attachment','avatar','badge','breadcrumb','button','button-group','calendar','card','carousel','chart','checkbox','code-block','collapsible','combobox','command','context-menu','dialog','drawer','dropdown-menu','empty','field','hover-card','input','input-group','input-otp','item','kbd','label','menubar','native-select','navigation-menu','pagination','popover','progress','radio-group','resizable','scroll-area','select','separator','sheet','sidebar','skeleton','slider','sonner','spinner','switch','table','tabs','textarea','toast','toggle','toggle-group','tooltip'];
// Docs-only pages that describe compositions rather than a ui file.
const docsOnly=['data-table','date-picker','typography'];

const sources=[
 ...families.map(f=>({path:`vendor/shadcn/base/${f}.tsx.txt`,source:`apps/v4/registry/bases/base/ui/${f}.tsx`})),
 // Sonner has no base docs page at this revision.
 ...[...families.filter(f=>f!=='sonner'),...docsOnly].map(f=>({path:`vendor/shadcn/docs/${f}.mdx`,source:`apps/v4/content/docs/components/base/${f}.mdx`})),
];

if(process.argv.includes('--fetch')){
 await mkdir(new URL('vendor/shadcn/base/',root),{recursive:true});
 await mkdir(new URL('vendor/shadcn/docs/',root),{recursive:true});
 const files=[];
 for(const file of sources){
  const response=await fetch(`https://raw.githubusercontent.com/shadcn-ui/ui/${revision}/${file.source}`);
  if(!response.ok)throw Error(`${file.source}: HTTP ${response.status}`);
  const body=await response.text();
  await writeFile(new URL(file.path,root),body);
  files.push({...file,sha256:hash(body)});
 }
 await writeFile(manifestPath,JSON.stringify({repository:'https://github.com/shadcn-ui/ui',revision,license:'MIT (vendor/shadcn/LICENSE.md)',style:'base-nova',files},null,1)+'\n');
 console.log(`Vendored ${files.length} files at ${revision}`);
}else if(process.argv.includes('--check')){
 const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
 if(manifest.revision!==revision)throw Error(`MANIFEST revision ${manifest.revision} differs from design-profile ${revision}`);
 const expected=new Set(sources.map(s=>s.path));
 for(const file of manifest.files){
  if(!expected.delete(file.path))throw Error(`Unexpected vendored file ${file.path}`);
  if(hash(await readFile(new URL(file.path,root),'utf8'))!==file.sha256)throw Error(`${file.path} changed; re-run --fetch or restore it`);
 }
 if(expected.size)throw Error(`Missing vendored files: ${[...expected].join(', ')}`);
 console.log(`shadcn vendor check: ${manifest.files.length} files match ${revision}`);
}else{
 console.error('Usage: node scripts/shadcn-vendor.mjs --fetch | --check');process.exit(2);
}
