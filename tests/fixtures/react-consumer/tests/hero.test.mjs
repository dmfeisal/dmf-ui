import test from 'node:test';
import assert from './assert.mjs';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {act,createElement as h,createRef,useState,StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {userEvent} from '@testing-library/user-event';
import {HeroBlock} from '@dmf-ui/react';
import {HeroProof,renderHero} from '../.test-dist/server.mjs';

test('packed HeroBlock has native heading associations, optional slots and matching source order',()=>{
 for(const position of ['start','end']){
  const dom=new JSDOM(renderToString(h(HeroBlock,{id:'hero',title:'Authored title',headingLevel:'h2',layout:'split',mediaPosition:position,description:'Authored introduction',actions:h('a',{href:'#destination'},'Read details'),media:h('img',{src:'/illustration.svg',alt:'Authored media',width:640,height:360})},h('p',{},'Extension content'))));
  try{const d=dom.window.document,section=d.querySelector('section'),inner=d.querySelector('.dmf-hero-inner');assert.equal(section.getAttribute('aria-labelledby'),'hero-title');assert.equal(d.querySelector('#hero-title').tagName,'H2');assert.equal(section.getAttribute('aria-describedby'),'hero-description');assert.equal(inner.children[position==='start'?0:1].className,'dmf-hero-media');assert(d.querySelector('a[href="#destination"]'));assert(d.body.textContent.includes('Extension content'));}finally{dom.window.close();}
 }
 const dom=new JSDOM(renderToString(h(HeroBlock,{id:'plain',title:'Plain title'})));try{const d=dom.window.document;assert.equal(d.querySelector('h1').textContent,'Plain title');assert.equal(d.querySelector('section').dataset.layout,'centered');assert.equal(d.querySelector('.dmf-hero-media,.dmf-hero-actions'),null);assert.equal(d.querySelector('section').hasAttribute('aria-describedby'),false);}finally{dom.window.close();}
 assert.throws(()=>renderToString(h(HeroBlock,{id:'hero',title:' '})),/nonempty/);assert.throws(()=>renderToString(h(HeroBlock,{id:'hero',title:'Title',layout:'carousel'})),/unsupported/);
});

async function withDOM(html,run){
 const dom=new JSDOM(`<div id="root">${html}</div>`,{url:'https://consumer.test/hero.html'}),saved=new Map(),warnings=[],oldError=console.error;
 for(const key of ['window','document','HTMLElement','navigator','IS_REACT_ACT_ENVIRONMENT']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:key==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[key]});}
 console.error=(...args)=>warnings.push(args.join(' '));const roots=[];
 try{const {createRoot,hydrateRoot}=await import('react-dom/client');await run({dom,user:userEvent.setup({document}),mount:async element=>{const root=createRoot(document.querySelector('#root'));roots.push(root);await act(async()=>root.render(element));return root;},hydrate:async element=>{let root;await act(async()=>{root=hydrateRoot(document.querySelector('#root'),h(StrictMode,{},element),{identifierPrefix:'hero-',onRecoverableError:e=>warnings.push(String(e))});});roots.push(root);return root;}});assert.deepEqual(warnings,[]);}finally{await act(async()=>{for(const root of roots)root.unmount();});console.error=oldError;dom.window.close();for(const [key,value]of saved){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}
}

test('packed Hero hydration preserves native media/actions and independent instances while hosts replace content',()=>withDOM(renderHero(),async({hydrate,user})=>{
 const image=document.querySelector('#consumer-hero img'),heading=document.querySelector('#consumer-hero-title');await hydrate(h(HeroProof));assert.equal(document.querySelector('#consumer-hero img'),image);assert.equal(document.querySelector('#consumer-hero-title'),heading);
 const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 await act(async()=>user.selectOptions(document.querySelector('[data-hero-layout]'),'centered'));assert.equal(document.querySelector('#consumer-hero').dataset.layout,'centered');
 await act(async()=>user.selectOptions(document.querySelector('[data-hero-language]'),'id'));assert.equal(heading.textContent,'Bangun antarmuka dengan fondasi bersama');assert.equal(document.querySelector('#consumer-centered-title').textContent,'An independent text-only introduction');
 await act(async()=>user.selectOptions(document.querySelector('[data-hero-position]'),'start'));assert.equal(document.querySelector('#consumer-hero .dmf-hero-inner').firstElementChild.className,'dmf-hero-media');
 await act(async()=>user.selectOptions(document.querySelector('[data-hero-media]'),'fallback'));assert(document.querySelector('[data-media-fallback]'));assert.equal(document.querySelector('#consumer-hero img'),null);
 await act(async()=>user.selectOptions(document.querySelector('[data-hero-media]'),'none'));assert.equal(document.querySelector('#consumer-hero .dmf-hero-media'),null);
 const link=document.querySelector('[data-hero-primary]');await act(async()=>{link.focus();await user.keyboard('[Enter]');});assert.equal(window.location.hash,'#details');
}));

test('bare packed Hero forwards a section ref and leaves media failure recovery to its host',()=>withDOM('',async({mount,dom})=>{
 const ref=createRef();function Host(){const [failed,setFailed]=useState(false);return h(HeroBlock,{id:'external',title:'Replaceable content',ref,media:failed?h('p',{'data-fallback':true},'Host fallback'):h('img',{src:'/missing.png',alt:'Authored alternative',onError:()=>setFailed(true)})});}
 const root=await mount(h(Host));assert.equal(ref.current.tagName,'SECTION');const heading=document.querySelector('h1');await act(async()=>document.querySelector('img').dispatchEvent(new dom.window.Event('error')));assert(document.querySelector('[data-fallback]'));assert.equal(document.querySelector('h1'),heading);await act(async()=>root.render(null));assert.equal(ref.current,null);
}));

test('production Hero has usable static links/media before hydration and ships the installed illustration',async()=>{
 const dom=new JSDOM(await readFile('dist/hero.html','utf8'));try{const d=dom.window.document;assert.equal(d.querySelector('#consumer-hero-title').textContent,'Build with a shared foundation');assert.equal(d.querySelector('[data-hero-primary]').getAttribute('href'),'#details');assert(d.querySelector('#details'));assert.equal(d.querySelector('[data-hero-primary]').hasAttribute('aria-disabled'),false);assert.equal(d.querySelector('img').getAttribute('src'),'/component-demo.svg');assert.equal(d.querySelector('[data-hero-layout]').disabled,true);}finally{dom.window.close();}
 assert.deepEqual(await readFile('dist/component-demo.svg'),await readFile('node_modules/dmf-ui/src/assets/examples/component-demo.svg'));
});
