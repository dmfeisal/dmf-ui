import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compileTokens,buildTokens} from '../scripts/design-tokens.mjs';
const source=JSON.parse(await readFile(new URL('../tokens/design.tokens.json',import.meta.url),'utf8'));
test('committed token outputs are deterministic and up to date',async()=>{
 await buildTokens({check:true});assert.deepEqual(compileTokens(source),compileTokens(structuredClone(source)));
});
test('portable values retain units, color spaces, shadows and CB alias relationships',()=>{
 const outputs=compileTokens(source),resolved=JSON.parse(outputs['tokens/resolved.json']);
 assert.deepEqual(resolved.groups['cb.light'].primary,resolved.groups['cb.light']['dmf-cb-ui-color-primary']);
 assert.equal(resolved.groups['cb.light'].primary.value.hex,'#26ade4');
 assert.equal(resolved.groups['dmf.light'].primary.value.colorSpace,'oklch');
 assert.deepEqual(resolved.groups['dmf.light'].radius.value,{value:.625,unit:'rem'});
 assert.equal(resolved.groups['dmf.dark']['shadow-sm'].value.length,2);
 assert.deepEqual(resolved.groups['cb.light']['font-heading'],resolved.groups['cb.light']['font-sans']);
 assert.match(outputs['src/styles/dmf-ui-cb.css'],/--primary: var\(--dmf-cb-ui-color-primary\)/);
 assert.match(outputs['src/styles/dmf-ui-tokens.css'],/@media \(prefers-color-scheme: dark\)/);
});
test('token generator rejects broken aliases, cycles, type mismatches and invalid values',()=>{
 const invalid=mutate=>{const copy=structuredClone(source);mutate(copy);assert.throws(()=>compileTokens(copy));};
 invalid(s=>s.cb.light.primary.$value='{cb.light.missing}');
 invalid(s=>{s.cb.light.primary.$value='{cb.light.cb-brand}';s.cb.light['cb-brand'].$value='{cb.light.primary}';});
 invalid(s=>s.cb.light.primary.$value='{cb.light.radius}');
 invalid(s=>s.dmf.light.radius.$value.unit='pt');
 invalid(s=>s.dmf.light.primary.$type='unsupported');
 invalid(s=>s.extra={color:{$type:'color',$value:s.dmf.light.primary.$value}});
 invalid(s=>s.cb.light['dmf-cb-ui-color-primary'].$value.components[0]=0);
 invalid(s=>s.cb.light.destructive.$extensions['io.dmf.web'].css='red; } body { color: red');
});
test('migration retains the exact token inventory of the 0.2.0 foundation and CB preset',async()=>{
 const names=css=>[...css.matchAll(/--([a-z0-9-]+):/g)].map(m=>m[1]);
 const outputs=compileTokens(source);
 for(const [fixture,output] of [['0.2.0-dmf.css','src/styles/dmf-ui-tokens.css'],['0.2.0-cb.css','src/styles/dmf-ui-cb.css']]){
  assert.deepEqual(names(outputs[output]),names(await readFile(new URL(`./fixtures/tokens/${fixture}`,import.meta.url),'utf8')));
 }
});
test('HUI preserves brand values with readable action pairs and local exported fonts',async()=>{
 const outputs=compileTokens(source),g=JSON.parse(outputs['tokens/resolved.json']).groups['hui.light'];
 for(const [name,hex] of Object.entries({'off-red':'#ec2a00',amber:'#ffb800',white:'#ffffff','egyptian-blue':'#29329b','kelly-green':'#63c132','eerie-black':'#232323'}))assert.equal(g[`hui-${name}`].value.hex,hex);
 const luminance=value=>value.components.map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const x=luminance(g[a].value),y=luminance(g[b].value);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 for(const [fg,bg] of [['primary-foreground','primary'],['secondary-foreground','secondary'],['muted-foreground','muted'],['fd-link','background']])assert(ratio(fg,bg)>=4.5,`${fg}/${bg}`);
 assert.match(outputs['src/styles/dmf-ui-hui.css'],/:root \.dmf-ui\[data-system="hui"\]/);
 assert(g['font-heading'].value.includes('DMF HUI Rounded Mplus'));
 const pkg=JSON.parse(await readFile('package.json','utf8'));assert.equal(pkg.exports['./presets/hui.css'],'./src/styles/dmf-ui-hui.css');
 for(const font of ['inter-latin-variable','mplus-rounded-latin-500','mplus-rounded-latin-700']){
  const bytes=await readFile(`src/assets/fonts/hui/${font}.woff2`);assert.equal(bytes.subarray(0,4).toString(),'wOF2');
 }
});
