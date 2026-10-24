import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
test('production CSS includes adapter utilities, both presets, focus rules and bundled Nunito',async()=>{
 const assets=await readdir('dist/assets');const css=(await Promise.all(assets.filter(name=>name.endsWith('.css')).map(name=>readFile(join('dist/assets',name),'utf8')))).join('\n');
 for(const selector of ['.dmf-react-switch','.border-input','.text-2xl','.bg-primary','data-system=cb-ui','data-theme=dark','focus-visible'])assert.ok(css.includes(selector),`Missing compiled styling: ${selector}`);
 assert.match(css,/#26ade4/i);assert.match(css,/DMF CB Nunito/);assert.ok(!css.includes('@tailwind'),'Tailwind must be compiled');
 const fontURLs=[...css.matchAll(/url\(([^)]+\.ttf[^)]*)\)/g)].map(match=>match[1].replace(/["']/g,''));assert.ok(fontURLs.length>0,'Bundled font URL missing');
 const original=await readFile('node_modules/dmf-ui/src/assets/fonts/nunito.ttf');
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 for(const url of fontURLs){assert.ok(url.startsWith('/assets/'),'Font must be a local production asset');const bytes=await readFile(join('dist',url));assert.equal(hash(bytes),hash(original));}
 const js=(await Promise.all(assets.filter(name=>name.endsWith('.js')).map(name=>readFile(join('dist/assets',name),'utf8')))).join('\n');
 assert.ok(!js.includes('data-dmf-switch'),'React controls must not use the Astro controller');
 assert.ok(!css.includes('/Users/'),'No checkout path may leak into built CSS');
 const notices=await readFile('node_modules/@dmf-ui/react/dist/THIRD-PARTY-NOTICES.txt','utf8');
 for(const name of ['Fulldev','shadcn','Tailwind','class-variance-authority','clsx'])assert.ok(notices.includes(name),`Missing attribution: ${name}`);
 const dom=new JSDOM(await readFile('dist/index.html','utf8'));
 try{
  const document=dom.window.document,host=document.querySelector('#root');
  assert.equal(host.querySelector('h1').textContent,'React consumer proof','Production HTML must contain server-rendered content');
  assert.equal(host.querySelector('[name=name]').value,'Feisal');
  assert.equal(host.querySelector('fieldset').disabled,true,'No-JavaScript preview must not submit local values');
  assert.equal(document.querySelector('label').control,host.querySelector('[name=name]'));
  assert.equal(host.querySelector('[role=status]').textContent,'No values submitted.');
 }finally{dom.window.close();}
});
