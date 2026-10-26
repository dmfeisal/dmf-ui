import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compileFoundations,buildFoundations} from '../scripts/foundations.mjs';
import {buildContracts} from '../scripts/component-contracts.mjs';
const json=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
test('foundations preserve aliases and reject invalid references, cycles and unsafe CSS',async()=>{
 const source=await json('tokens/foundations.json');await buildFoundations({check:true});
 const outputs=compileFoundations(source),resolved=JSON.parse(outputs['tokens/foundations.resolved.json']);
 assert.equal(resolved.tokens['layout-gap'],resolved.tokens['space-6']);
 assert.match(outputs['src/styles/dmf-ui-foundations.css'],/prefers-reduced-motion/);
 for(const mutate of [s=>s.tokens['layout-gap'].value='{missing}',s=>s.tokens['space-6'].value='{layout-gap}',s=>s.tokens['layout-gap'].value='red; } body { display:none',s=>s.tokens['layout-gap'].layer='brand-official']){const copy=structuredClone(source);mutate(copy);assert.throws(()=>compileFoundations(copy));}
});
test('catalog covers every exported Astro family, without claiming complete state acceptance',async()=>{
 const data=await buildContracts({check:true}),pkg=await json('package.json');
 const publicFamilies=Object.entries(pkg.exports).filter(([key,value])=>key!=='.'&&typeof value==='string'&&value.endsWith('/index.ts')).map(([key])=>key.slice(2)).sort();
 assert.deepEqual(data.components.map(c=>c.slug).sort(),publicFamilies);
 assert.equal(new Set(data.components.map(c=>c.slug)).size,data.components.length);
 for(const component of data.components){assert(component.parts.length);assert.equal(component.status,'partial');assert(component.states.dragging.status);for(const source of component.sources)assert.match(source.sha256,/^[a-f0-9]{64}$/);}
 assert(data.react.exports.includes('Button'));assert(data.react.types.some(t=>t.name==='SwitchProps'&&t.declaration.includes('readOnly')));
 const button=data.components.find(c=>c.slug==='button');assert(button.variants.size.includes('md'));assert(button.variants.size.includes('default'));
});
test('QDI palette stays exact while semantic pairings meet text contrast',async()=>{
 const {groups}=await json('tokens/resolved.json'),q=groups['qdi.light'],brands=await json('contracts/brands.json');
 for(const [family,values] of Object.entries(brands.brands.qdi.palette))values.forEach((value,i)=>assert.equal(q[`qdi-${family}-${i+1}`].value.hex,value.toLowerCase()));
 const luminance=value=>value.components.map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
 for(const [fg,bg] of [['primary-foreground','primary'],['secondary-foreground','secondary'],['accent-foreground','accent'],['muted-foreground','muted'],['fd-link','background']]){const a=luminance(q[fg].value),b=luminance(q[bg].value);assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${fg}/${bg}`);}
 assert.deepEqual(brands.brands.qdi.modes,['light']);assert(!groups['qdi.dark']);
 assert.equal(q['qdi-elevation-4'].value[0].blur.value,50);
 assert.equal(groups['cb.light'].primary.value.hex,'#26ade4');
});
