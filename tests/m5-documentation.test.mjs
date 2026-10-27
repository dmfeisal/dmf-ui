import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=path=>readFile(`dist/${path}index.html`,'utf8');
test('support comes from exported implementations and never silently promotes maturity',async()=>{
 const catalog=JSON.parse(await readFile('contracts/catalog.json','utf8'));
 for(const c of catalog.components){const name=c.name.replace(/[^a-zA-Z0-9]/g,'');assert.equal(c.support.astro.status,'experimental');assert.equal(c.support.react.status,catalog.react.exports.includes(name)?'experimental':'not-implemented');assert.equal(c.support.platform,'web');assert(Array.isArray(c.dependencies));const page=await html(`components/${c.slug}/`);assert(page.includes('data-implementation-support'));assert(page.includes(`data-runtime="react">${c.support.react.status==='experimental'?'Experimental':'Not implemented'}`));}
 for(const b of catalog.blocks){assert.equal(b.support.astro.status,'experimental');assert.equal(b.support.react.status,'experimental');assert((await html(`blocks/${b.slug}/`)).includes('data-implementation-support'));}
});
test('homepage and examples describe current capabilities with canonical links and compact imagery',async()=>{
 const home=await html(''),examples=await html('examples/');assert(home.includes('Build interfaces across products and brands.'));for(const route of ['/components/','/blocks/','/examples/','/examples/discovery/','/docs/implementation-paths/'])assert(home.includes(`href="${route}"`));assert(home.includes('data-slot="hero-block"'));assert(home.includes('data-slot="merchant-card"'));assert(home.includes('.webp'));assert(!home.includes('photo-1.png'));assert(examples.includes('Merchant discovery'));assert(examples.includes('React web alpha'));assert(examples.includes('/components/merchant-card/'));
});
test('production routing configuration forces the legacy alias past its static fallback',async()=>{
 const redirects=await readFile('dist/_redirects','utf8');assert(redirects.split('\n').includes('/blocks/merchant-card /components/merchant-card/ 301!'));assert(redirects.split('\n').includes('/blocks/merchant-card/ /components/merchant-card/ 301!'));assert(!redirects.includes('/*'));const headers=await readFile('dist/_headers','utf8');assert(headers.includes('/_astro/*'));assert(headers.includes('max-age=31536000, immutable'));assert(!headers.includes('\n/*'));
 for(const path of ['', 'components/button/','blocks/sign-in/','examples/','examples/discovery/','docs/implementation-paths/'])assert((await html(path)).includes(`rel="canonical" href="https://ui.feisal.id/${path}"`));
});
