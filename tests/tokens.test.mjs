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
