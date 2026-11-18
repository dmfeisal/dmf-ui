import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {act,createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '../.test-dist/index.mjs';

function withDom(run){
 const dom = new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
 const saved = new Map();
 const globals = {window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Node:dom.window.Node,IS_REACT_ACT_ENVIRONMENT:true};
 for(const [name,value] of Object.entries(globals)){saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});}
 return Promise.resolve().then(()=>run(dom)).finally(()=>{for(const [name,descriptor] of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}dom.window.close();});
}

const label = element => element.textContent.replace('✓','').trim();
const key = (dom,target,k)=>act(async()=>{target.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));});
const click = (dom,target)=>act(async()=>{target.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true,cancelable:true}));});

test('custom listbox opens, moves focus, selects, closes and resets with its form',()=>withDom(async dom=>{
 const document = dom.window.document;
 const changes = [];
 const root = createRoot(document.getElementById('root'));
 await act(async()=>{root.render(createElement('form',{id:'form'},
  createElement(Select,{name:'pick',defaultValue:'b',onValueChange:v=>changes.push(v)},
   createElement(SelectTrigger,{id:'pick-trigger','aria-label':'Pick'},createElement(SelectValue,{placeholder:'Choose'})),
   createElement(SelectContent,null,
    createElement(SelectItem,{value:'a'},'Alpha'),
    createElement(SelectItem,{value:'b'},'Bravo'),
    createElement(SelectItem,{value:'x',disabled:true},'Disabled'),
    createElement(SelectItem,{value:'c'},'Charlie')))));
 });
 const trigger = document.getElementById('pick-trigger');
 const hidden = () => document.querySelector('input[name=pick]').value;
 assert.equal(trigger.textContent,'Bravo');
 assert.equal(hidden(),'b');
 assert.equal(trigger.getAttribute('aria-expanded'),'false');
 const content = () => document.querySelector('[data-slot=select-content]');
 assert.equal(content().hidden,true,'listbox is hidden while closed');

 await click(dom,trigger);
 const list = document.querySelector('[role=listbox]');
 assert.equal(content().hidden,false,'listbox opens on click');
 assert.equal(trigger.getAttribute('aria-expanded'),'true');
 assert.equal(list.getAttribute('aria-labelledby'),'pick-trigger');
 assert.equal(label(document.activeElement),'Bravo','selected option takes focus');

 await key(dom,document.activeElement,'ArrowDown');
 assert.equal(label(document.activeElement),'Charlie','ArrowDown skips the disabled option');
 await key(dom,document.activeElement,'ArrowUp');
 assert.equal(label(document.activeElement),'Bravo');
 await key(dom,document.activeElement,'a');
 assert.equal(label(document.activeElement),'Alpha','type-ahead moves focus to the matching option');

 await key(dom,document.activeElement,'Enter');
 assert.equal(content().hidden,true,'choosing closes the listbox');
 assert.equal(trigger.textContent,'Alpha');
 assert.equal(hidden(),'a');
 assert.equal(document.activeElement,trigger,'focus returns to the trigger');
 assert.deepEqual(changes,['a']);

 await click(dom,trigger);
 await key(dom,document.activeElement,'Escape');
 assert.equal(content().hidden,true,'Escape closes the listbox');
 assert.equal(hidden(),'a','Escape keeps the value');
 assert.equal(document.activeElement,trigger);

 await act(async()=>{document.getElementById('form').dispatchEvent(new dom.window.Event('reset',{bubbles:true}));});
 await act(async()=>{});
 assert.equal(trigger.textContent,'Bravo','form reset returns an uncontrolled select to its default');
 assert.equal(hidden(),'b');

 await act(async()=>root.unmount());
}));
