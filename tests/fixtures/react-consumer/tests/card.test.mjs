import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {createElement as h,StrictMode,act} from 'react';
import {renderToString} from 'react-dom/server';
import {MerchantCard} from '@dmf-ui/react';
import {CardProof,renderCard} from '../.test-dist/server.mjs';
const icons={verified:'/verified.svg',hours:'/hours.svg',distance:'/distance.svg',star:'/star.svg'},base={id:'card',name:'Authored merchant',href:'#details',photos:[],icons};
test('packed MerchantCard preserves native destination, optional data and validation boundaries',()=>{
 const dom=new JSDOM(renderToString(h(MerchantCard,{...base,verified:true,rating:0,reviewCount:0,priceLevel:1,address:'Complete address'})));
 try{const d=dom.window.document;assert.equal(d.querySelector('article').getAttribute('aria-labelledby'),'card-name');assert.equal(d.querySelectorAll('a').length,1);assert.equal(d.querySelector('a').getAttribute('href'),'#details');assert.equal(d.querySelector('.dmf-merchant-rating').getAttribute('aria-label'),'Rating: 0 / 5; 0 reviews');assert.equal(d.querySelector('.dmf-merchant-address').title,'Complete address');assert.equal(d.querySelector('.dmf-merchant-photo-fallback').textContent,'No photos supplied');}finally{dom.window.close();}
 for(const invalid of [{id:''},{rating:6},{reviewCount:2},{priceLevel:0},{photos:Array(4).fill({src:'/photo.png',alt:''})},{icons:{}}])assert.throws(()=>renderToString(h(MerchantCard,{...base,...invalid})),/MerchantCard/);
});
test('packed MerchantCard hydrates without replacing server nodes',async()=>{
 const dom=new JSDOM(`<div id="root">${renderCard()}</div>`,{url:'https://consumer.test/card.html'}),saved=new Map(),errors=[];
 for(const key of ['window','document','HTMLElement','navigator','IS_REACT_ACT_ENVIRONMENT']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:key==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[key]});}
 let root;try{const image=document.querySelector('#reference-card img'),link=document.querySelector('#reference-card a');const {hydrateRoot}=await import('react-dom/client');await act(async()=>{root=hydrateRoot(document.querySelector('#root'),h(StrictMode,{},h(CardProof)),{identifierPrefix:'card-',onRecoverableError:e=>errors.push(String(e))});});assert.equal(document.querySelector('#reference-card img'),image);assert.equal(document.querySelector('#reference-card a'),link);assert.deepEqual(errors,[]);const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);}finally{if(root)await act(async()=>root.unmount());dom.window.close();for(const [key,value] of saved){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}
});
test('production card and exact supplied assets survive packing',async()=>{
 const dom=new JSDOM(await readFile('dist/card.html','utf8'));try{assert.equal(dom.window.document.querySelector('#reference-card a').getAttribute('href'),'#details');assert(dom.window.document.querySelector('#details'));}finally{dom.window.close();}
 for(const name of ['verified','hours','distance','star'])assert.deepEqual(await readFile(`dist/merchant-card/${name}.svg`),await readFile(`node_modules/dmf-ui/src/assets/merchant-card/${name}.svg`));
 for(const n of [1,2,3])assert.deepEqual(await readFile(`dist/merchant-card/photo-${n}.png`),await readFile(`node_modules/dmf-ui/src/assets/examples/merchant-card/photo-${n}.png`));
});
