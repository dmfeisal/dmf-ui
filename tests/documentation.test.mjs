import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {join} from 'node:path';
async function htmlFiles(dir){const paths=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory())paths.push(...await htmlFiles(path));else if(path.endsWith('.html'))paths.push(path);}return paths;}
test('documentation catalog covers every exported component family',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 const catalog=await readFile('dist/components/index.html','utf8');
 for(const [key,path] of Object.entries(pkg.exports)){
  if(!/^\.\/[^/]+$/.test(key)||!path.endsWith('/index.ts'))continue;
  const slug=key.slice(2);await access(`dist/components/${slug}/index.html`);
  assert(catalog.includes(`href="/components/${slug}/"`),`Missing catalog entry: ${slug}`);
 }
 for(const path of ['index.html','create/index.html','components/index.html','docs/index.html','docs/installation/index.html','examples/dmf-ui/index.html'])await access(join('dist',path));
});
test('built local documentation links and fragment targets resolve',async()=>{
 for(const file of await htmlFiles('dist')){
  const html=await readFile(file,'utf8');const route='/'+file.slice(5).replace(/index\.html$/,'');
  for(const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
   const raw=match[1].replaceAll('&amp;','&');const url=new URL(raw,`https://dmf-ui.test${route}`);
   if(url.origin!=='https://dmf-ui.test')continue;
   const path=join('dist',decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
   await assert.doesNotReject(access(path),`${file}: ${raw}`);
   if(url.hash&&path.endsWith('.html')){const target=await readFile(path,'utf8');assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${file}: missing fragment ${raw}`);}
  }
 }
});
