import {mkdtemp,readFile,writeFile,cp,mkdir,rename,lstat,realpath,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url)),scratch=await realpath(await mkdtemp(join(tmpdir(),'dmf-ui-astro-blocks-'))),keep=process.argv.includes('--keep');
const npm=process.platform==='win32'?'npm.cmd':'npm';
async function run(args,cwd,capture=false){const child=spawn(npm,args,{cwd,stdio:['ignore',capture?'pipe':'inherit','inherit']});let output='';child.stdout?.on('data',chunk=>output+=chunk);const code=await new Promise((done,reject)=>{child.on('error',reject);child.on('exit',done);});if(code!==0)throw Error(`npm ${args.join(' ')} exited ${code}`);return output;}
try{
 console.log(`Isolated Astro Blocks consumer: ${scratch}`);
 await cp(join(root,'tests/fixtures/blocks-consumer'),scratch,{recursive:true});await mkdir(join(scratch,'vendor'));
 const [packed]=JSON.parse(await run(['pack','--ignore-scripts','--json','--pack-destination',join(scratch,'vendor')],root,true));await rename(join(scratch,'vendor',packed.filename),join(scratch,'vendor/core.tgz'));
 const source=JSON.parse(await readFile(join(root,'package.json'),'utf8')),lock=JSON.parse(await readFile(join(root,'package-lock.json'),'utf8'));
 // Reuse the source lock's exact toolchain graph; only add the freshly packed core archive.
 const manifest={name:'dmf-ui-astro-blocks-consumer-proof',version:'0.0.0',private:true,type:'module',scripts:{build:'astro build'},dependencies:{...source.dependencies,'dmf-ui':'file:vendor/core.tgz'},devDependencies:source.devDependencies};
 lock.name=manifest.name;lock.version=manifest.version;lock.packages['']={name:manifest.name,version:manifest.version,dependencies:manifest.dependencies,devDependencies:manifest.devDependencies};
 lock.packages['node_modules/dmf-ui']={version:source.version,resolved:'file:vendor/core.tgz',integrity:packed.integrity,dependencies:source.dependencies,peerDependencies:source.peerDependencies,engines:source.engines};
 await writeFile(join(scratch,'package.json'),JSON.stringify(manifest,null,2));await writeFile(join(scratch,'package-lock.json'),JSON.stringify(lock,null,2));
 await run(['ci','--ignore-scripts','--no-audit','--no-fund'],scratch);
 const installed=join(scratch,'node_modules/dmf-ui');assert.equal((await lstat(installed)).isSymbolicLink(),false);assert((await realpath(installed)).startsWith(scratch+'/'));
 await run(['run','build'],scratch);
 const html=await readFile(join(scratch,'dist/index.html'),'utf8');
 assert.match(html,/id="external-sign-in"[^>]*action="\/account\/sign-in"[^>]*method="post"/);assert.match(html,/Tidak dapat masuk/);assert.match(html,/aria-describedby="external-sign-in-email-error"/);assert.match(html,/name="organization"/);assert.match(html,/href="#notes"/);assert.match(html,/id="external-search"[^>]*method="get"/);assert.match(html,/autocomplete="current-password"/);assert(!/<input[^>]*type="password"[^>]*value=/.test(html));assert(!html.includes('/Users/'));assert(!html.includes('data-block-demo'));
 assert.match(html,/data-slot="sign-up-block"/);assert.match(html,/autocomplete="new-password"/);assert.match(html,/name="confirmPassword"/);assert.match(html,/external-signup-confirm-password-error/);assert.match(html,/name="region"/);assert.match(html,/data-slot="password-recovery-block"/);assert.match(html,/If recovery is available/);
 const hero=await readFile(join(scratch,'dist/hero/index.html'),'utf8');assert.match(hero,/data-slot="hero-block"/);assert.match(hero,/aria-labelledby="external-hero-title"/);assert.match(hero,/data-layout="split"/);assert.match(hero,/href="#details"/);assert.match(hero,/width="640"/);assert.match(hero,/alt="Ilustrasi komponen dari sumber proyek"/);assert(!hero.includes('<script'));
 const listing=await readFile(join(scratch,'dist/listing/index.html'),'utf8');assert.match(listing,/aria-labelledby="external-listing-title"/);assert.match(listing,/Contoh kafe A/);assert.match(listing,/Tidak ada contoh hasil/);assert.match(listing,/aria-busy="true"/);assert.match(listing,/role="alert"/);assert(!listing.includes('<script'));assert(!listing.includes('<fragment'));
 const card=await readFile(join(scratch,'dist/card/index.html'),'utf8');assert.match(card,/data-slot="merchant-card"/);assert.match(card,/id="legacy-card"/);assert.match(card,/1\.235/);assert.match(card,/href="#details"/);assert(!card.includes('<script'));
 console.log('PASS separate packed Astro consumer: public imports, native POST/GET, localization, slots, errors and password boundary.');
 if(keep)console.log(`Retained consumer: ${scratch}`);
}finally{if(!keep)await rm(scratch,{recursive:true,force:true});}
