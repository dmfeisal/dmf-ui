import test from 'node:test';
import strict from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {inspect} from 'node:util';
import assert from './assert.mjs';

test('a failed DOM identity check has bounded diagnostics without walking React graphs',()=>{
 const dom=new JSDOM('<main><input id="before"><input id="after"></main>');
 try{
  const [before,after]=dom.window.document.querySelectorAll('input');
  const fiber={stateNode:before};fiber.parent=fiber;before.__reactFiber=fiber;
  before[inspect.custom]=()=>{throw Error('Must not inspect the DOM graph');};
  after[inspect.custom]=before[inspect.custom];
  assert.equal(before,before);
  for(let i=0;i<100;i++)strict.throws(()=>assert.equal(before,after),error=>error.code==='ERR_ASSERTION'&&error.actual===false&&error.message.length<256&&error.message.includes('INPUT#before versus INPUT#after'));
  strict.throws(()=>assert.equal(before,null),/DOM identity mismatch/);
  strict.throws(()=>assert.equal(1,2),{code:'ERR_ASSERTION'});
 }finally{dom.window.close();}
});
