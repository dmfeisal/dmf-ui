import test from 'node:test';
import assert from './assert.mjs';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {createElement as h,createRef,StrictMode,act} from 'react';
import {renderToString} from 'react-dom/server';
import {userEvent} from '@testing-library/user-event';
import {SearchFiltersBlock,Input} from '@dmf-ui/react';
import {DiscoveryProof,renderDiscovery,discoveryResults,readDiscoverySelection,discoveryURL} from '../.test-dist/server.mjs';
const base={id:'search',action:'/catalog/',options:[{value:'cafe',label:'Café'},{value:'closed',label:'Disabled example',disabled:true}]};
async function withDOM(html,run,url='https://consumer.test/discovery.html'){
 const dom=new JSDOM(`<div id="root">${html}</div>`,{url}),saved=new Map(),warnings=[],previous=console.error;
 for(const key of ['window','document','HTMLElement','navigator','FormData','URLSearchParams','location','history','IS_REACT_ACT_ENVIRONMENT']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:key==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[key]});}
 for(const key of ['addEventListener','removeEventListener']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key].bind(dom.window)});}
 console.error=(...args)=>warnings.push(args.join(' '));const roots=[];
 try{const {createRoot,hydrateRoot}=await import('react-dom/client');await run({dom,user:userEvent.setup({document}),mount:async element=>{const root=createRoot(document.querySelector('#root'));roots.push(root);await act(async()=>root.render(element));return root;},hydrate:async()=>{let root;await act(async()=>{root=hydrateRoot(document.querySelector('#root'),h(StrictMode,{},h(DiscoveryProof)),{identifierPrefix:'discovery-',onRecoverableError:e=>warnings.push(String(e))});});roots.push(root);}});assert.deepEqual(warnings,[]);}finally{await act(async()=>{for(const root of roots)root.unmount();});console.error=previous;dom.window.close();for(const [key,value] of saved){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}
}
test('packed search form validates field boundaries and renders native GET before enhancement',()=>{
 const dom=new JSDOM(renderToString(h(SearchFiltersBlock,{...base,query:'kopi',selectedValue:'cafe',filters:[{name:'photos',label:'Dengan foto',value:'yes',checked:true}],pending:true,pendingLabel:'Memperbarui hasil',error:'Contoh kesalahan',fields:h(Input,{name:'region','aria-label':'Wilayah'}),title:'Cari merchant'})));
 try{const d=dom.window.document,form=d.querySelector('form');assert.equal(form.method,'get');assert.equal(form.getAttribute('aria-labelledby'),'search-title');assert(d.querySelector('fieldset').disabled);assert.equal(d.querySelector('[role=status]').textContent,'Memperbarui hasil');assert.equal(d.querySelector('[role=alert]').textContent,'Contoh kesalahan');assert.equal(d.querySelector('select').value,'cafe');assert(d.querySelector('[name=region]'));}finally{dom.window.close();}
 for(const invalid of [{id:''},{queryName:'category'},{selectedValue:'closed'},{options:[{value:'',label:'Empty'}]},{options:[{value:'x',label:'One'},{value:'x',label:'Two'}]},{filters:[{name:'q',label:'Collision'}]}])assert.throws(()=>renderToString(h(SearchFiltersBlock,{...base,...invalid})));
});
test('packed search form forwards native ref/events, captures values and resets authored defaults independently',()=>withDOM('',async({mount,user})=>{
 const ref=createRef(),submissions=[];const root=await mount(h('div',{},h(SearchFiltersBlock,{...base,ref,query:'initial',selectedValue:'cafe',filters:[{name:'photos',label:'Photos',value:'yes',checked:true},{name:'ignored',label:'Disabled',disabled:true}],onSubmit:e=>{e.preventDefault();submissions.push([...new FormData(e.currentTarget)]);}}),h(SearchFiltersBlock,{...base,id:'independent',query:'other'})));
 assert.equal(ref.current.tagName,'FORM');await act(async()=>{await user.clear(document.querySelector('#search-query'));await user.type(document.querySelector('#search-query'),'new draft');await user.selectOptions(document.querySelector('#search-choice'),'');await user.click(document.querySelector('#search-filter-0'));await user.click(document.querySelector('#search [type=submit]'));});assert.deepEqual(submissions,[[['q','new draft'],['category','']]]);
 await act(async()=>user.click(document.querySelector('#search [type=reset]')));assert.equal(document.querySelector('#search-query').value,'initial');assert.equal(document.querySelector('#search-choice').value,'cafe');assert(document.querySelector('#search-filter-0').checked);assert.equal(document.querySelector('#independent-query').value,'other');assert.equal(location.search,'');await act(async()=>root.render(null));assert.equal(ref.current,null);
}));
test('example URL model combines filters, bounds pages and preserves unrelated query parameters',()=>{
 assert.deepEqual(readDiscoverySelection(new URLSearchParams('category=unknown&page=-3&photos=no')),{q:'',category:'',photos:false,page:1});
 const selection=readDiscoverySelection(new URLSearchParams('q=sample&category=cafe&photos=yes&page=999'));const results=discoveryResults(selection);assert.equal(results.total,1);assert.equal(results.page,1);assert.equal(results.items[0].id,'sample-cafe-a');
 assert.equal(discoveryURL('/discovery.html?campaign=keep&q=old&page=2#details',{q:'kopi & teh',category:'',photos:false,page:1}),'/discovery.html?campaign=keep&q=kopi+%26+teh');assert.equal(discoveryResults({q:'no match',category:'',photos:false,page:1}).total,0);
});
test('example hydrates the packed form, restores deep links, applies drafts and recovers without losing applied filters',()=>withDOM(renderDiscovery(),async({hydrate,user})=>{
 const host=document.querySelector('.discovery-example');await hydrate();assert.ok(document.querySelector('.discovery-example')===host,'Hydration retains the example root; URL restoration intentionally remounts defaulted fields.');assert.equal(document.querySelector('#discovery-filters-query').value,'café');assert.equal(document.querySelectorAll('#discovery-results ul>li').length,2);
 await act(async()=>{await user.clear(document.querySelector('#discovery-filters-query'));await user.type(document.querySelector('#discovery-filters-query'),'unmatched');});assert.equal(document.querySelectorAll('#discovery-results ul>li').length,2);
 await act(async()=>user.click(document.querySelector('#discovery-filters [type=submit]')));assert.equal(document.querySelector('#discovery-results ul'),null);assert.equal(new URLSearchParams(location.search).get('q'),'unmatched');assert.equal(document.activeElement,document.querySelector('[data-discovery-summary]'));
 await act(async()=>user.click(document.querySelector('#discovery-filters [type=reset]')));assert.equal(document.querySelector('#discovery-filters-query').value,'');assert.equal(location.search,'?campaign=keep');assert.equal(document.querySelectorAll('#discovery-results ul>li').length,3);
 await act(async()=>user.selectOptions(document.querySelector('[data-discovery-state]'),'error'));assert(document.querySelector('#discovery-results [role=alert]'));await act(async()=>user.click(document.querySelector('#discovery-results button')));assert.equal(document.activeElement,document.querySelector('#discovery-filters-query'));assert.equal(document.querySelectorAll('#discovery-results ul>li').length,3);
 await act(async()=>{history.replaceState(null,'','?category=bakery&photos=yes&page=999');window.dispatchEvent(new window.PopStateEvent('popstate'));});assert.equal(document.querySelector('#discovery-filters-choice').value,'bakery');assert.equal(document.querySelector('#discovery-filters-filter-0').checked,true);assert.equal(document.querySelectorAll('#discovery-results ul>li').length,1);
},'https://consumer.test/discovery.html?q=caf%C3%A9&campaign=keep'));
test('production discovery explains static GET fallback and leaves preview controls disabled before hydration',async()=>{
 const dom=new JSDOM(await readFile('dist/discovery.html','utf8'));try{const d=dom.window.document;assert.match(d.querySelector('[data-static-discovery]').textContent,/requires JavaScript/);assert(d.querySelector('.discovery-tools').disabled);assert.equal(d.querySelector('#discovery-filters [type=submit]').disabled,false);assert.equal(d.querySelector('#discovery-filters').method,'get');assert.equal(d.querySelector('#discovery-filters').getAttribute('action'),'/discovery.html');assert.equal(d.querySelectorAll('#discovery-results ul>li').length,3);assert.equal(d.querySelectorAll('.discovery-pagination a').length,2);}finally{dom.window.close();}
});
test('repeated discovery mounting releases history listeners and keeps retained heap bounded',()=>withDOM('',async({mount})=>{
 const listeners=new Set(),add=globalThis.addEventListener,remove=globalThis.removeEventListener;
 globalThis.addEventListener=(type,listener,...rest)=>{if(type==='popstate')listeners.add(listener);return add(type,listener,...rest);};
 globalThis.removeEventListener=(type,listener,...rest)=>{if(type==='popstate')listeners.delete(listener);return remove(type,listener,...rest);};
 try{
  const root=await mount(h(StrictMode,{},h(DiscoveryProof)));
  const cycle=async()=>{await act(async()=>root.render(null));assert.equal(listeners.size,0);assert.equal(document.querySelector('#root').childElementCount,0);await act(async()=>root.render(h(StrictMode,{},h(DiscoveryProof))));assert.equal(listeners.size,1);};
  for(let n=0;n<5;n++)await cycle();
  assert.equal(typeof globalThis.gc,'function','Run the fixture through its bounded npm test command.');
  globalThis.gc();const baseline=process.memoryUsage().heapUsed;
  for(let n=0;n<25;n++)await cycle();
  await act(async()=>root.render(null));globalThis.gc();const growth=process.memoryUsage().heapUsed-baseline;
  assert.ok(growth<8*1024*1024,`Retained heap grew ${Math.round(growth/1024)} KiB after 25 warmed mount/unmount cycles`);
  assert.equal(listeners.size,0);console.log(`Discovery lifecycle soak: retained heap delta ${Math.round(growth/1024)} KiB; zero retained history listeners.`);
 }finally{globalThis.addEventListener=add;globalThis.removeEventListener=remove;}
}));
