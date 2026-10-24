import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {render} from '../.test-dist/server.mjs';
const path=new URL('../dist/index.html',import.meta.url);
const html=await readFile(path,'utf8');
const host='<div id="root"></div>';
assert.equal(html.split(host).length,2,'The production document must contain exactly one empty React host');
await writeFile(path,html.replace(host,`<div id="root">${render()}</div>`));
console.log('Server-rendered the packed React app into the production document.');
