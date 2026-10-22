import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
async function walk(path){const result=[];for(const e of await readdir(path,{withFileTypes:true})){const p=join(path,e.name);result.push(...(e.isDirectory()?await walk(p):[p]));}return result;}
test('independent dependencies and build contain no portfolio runtime',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 assert(!pkg.dependencies['@netlify/blobs']);assert(!pkg.dependencies['html-to-image']);
 const sources=await walk('src');assert(sources.every(p=>!p.includes('Canvas')&&!p.includes('layouts/')));
 const output=await walk('dist');assert(output.some(p=>p.endsWith('examples/dmf-ui/index.html')));
 for(const p of output.filter(p=>/\.(html|js|css)$/.test(p))){const text=await readFile(p,'utf8');assert(!['DMFCanvasTools','canvas-tools.js','/css/global.css','/css/tokens.css','/js/components.js','/js/transition.js'].some(marker=>text.includes(marker)),p);}
 assert(output.some(p=>/nunito.*\.ttf$/.test(p)));assert(output.some(p=>p.endsWith('dmf-ui-notices.txt')));
});
