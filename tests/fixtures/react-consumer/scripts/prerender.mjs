import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {render,renderSignIn,renderHero,renderListing,renderCard} from '../.test-dist/server.mjs';
const path=new URL('../dist/index.html',import.meta.url);
const html=await readFile(path,'utf8');
const host='<div id="root"></div>';
assert.equal(html.split(host).length,2,'The production document must contain exactly one empty React host');
await writeFile(path,html.replace(host,`<div id="root">${render()}</div>`));
console.log('Server-rendered the packed React app into the production document.');
const signInPath=new URL('../dist/sign-in.html',import.meta.url);
const signInHtml=await readFile(signInPath,'utf8');
assert.equal(signInHtml.split(host).length,2);
await writeFile(signInPath,signInHtml.replace(host,`<div id="root">${renderSignIn()}</div>`));
const heroPath=new URL('../dist/hero.html',import.meta.url),heroHtml=await readFile(heroPath,'utf8');
assert.equal(heroHtml.split(host).length,2);
await writeFile(heroPath,heroHtml.replace(host,`<div id="root">${renderHero()}</div>`));

const listingPath=new URL('../dist/listing.html',import.meta.url),listingHtml=await readFile(listingPath,'utf8');
assert.equal(listingHtml.split(host).length,2);
await writeFile(listingPath,listingHtml.replace(host,`<div id="root">${renderListing()}</div>`));

const cardPath=new URL('../dist/card.html',import.meta.url),cardHtml=await readFile(cardPath,'utf8');
assert.equal(cardHtml.split(host).length,2);
await writeFile(cardPath,cardHtml.replace(host,`<div id="root">${renderCard()}</div>`));
