import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const json=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Nova Neutral profile keeps pinned, licensed primary references and public exports',async()=>{
 const profile=await json('contracts/design-profile.json'),pkg=await json('package.json');
 assert.deepEqual([profile.style,profile.baseColor,profile.theme],['nova','neutral','neutral']);
 assert.equal(profile.references.length,2);
 for(const file of profile.references[0].files)assert.equal(createHash('sha256').update(await readFile(file.path)).digest('hex'),file.sha256);
 assert.match(await readFile('vendor/shadcn/LICENSE.md','utf8'),/MIT License/);
 assert.equal(pkg.exports['./design-profile'],'./contracts/design-profile.json');
 for(const name of ['code-tabs','command-block'])assert(pkg.exports[`./${name}`]);
});
test('Neutral semantic primary roles are achromatic in both modes while preset fills stay owned',async()=>{
 const {groups}=await json('tokens/resolved.json');
 for(const group of ['dmf.light','dmf.dark'])for(const name of ['primary','primary-foreground','secondary','muted','accent']){const color=groups[group][name].value;assert.equal(color.colorSpace,'oklch');assert.equal(color.components[1],0);assert.equal(color.components[2],0);}
 assert.equal(groups['cb.light'].primary.value.hex,'#26ade4');assert.equal(groups['hui.light'].primary.value.hex,'#ec2a00');
});
test('white primary-label contrast exceptions are explicit and separate from palette verification',async()=>{
 const brands=await json('contracts/brands.json'),{groups}=await json('tokens/resolved.json');
 for(const [name,group] of [['cb-ui','cb.light'],['hui','hui.light']]){assert.equal(groups[group]['primary-foreground'].value.hex,'#ffffff');assert.equal(brands.brands[name].actionTextPolicy.status,'known-normal-text-contrast-exception');assert(brands.brands[name].actionTextPolicy.contrastRatio<4.5);}
});
