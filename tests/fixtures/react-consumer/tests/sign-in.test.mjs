import test from 'node:test';
import assert from './assert.mjs';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {act,createElement as h,createRef,StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {userEvent} from '@testing-library/user-event';
import {SignInBlock} from '@dmf-ui/react';
import {SignInProof,renderSignIn} from '../.test-dist/server.mjs';

test('packed SignInBlock preserves native SSR, IDs, localized copy and API boundaries',()=>{
 const html=renderToString(h('div',{},h(SignInBlock,{id:'one',action:'/sign-in',email:'initial@example.test',error:'Coba lagi',errorTitle:'Tidak dapat masuk',fieldErrors:{email:'Periksa email'},fields:h('input',{name:'scope',defaultValue:'docs'}),footer:h('a',{href:'/help'},'Bantuan')}),h(SignInBlock,{id:'two',action:'/sign-in',pending:true})));
 const dom=new JSDOM(html);try{
  const d=dom.window.document,form=d.querySelector('#one');assert.equal(form.method,'post');assert.equal(form.getAttribute('action'),'/sign-in');
  assert.equal(form.querySelector('[type=password]').hasAttribute('value'),false);assert.equal(form.querySelector('[type=password]').autocomplete,'current-password');
  assert.equal(form.querySelector('[name=email]').getAttribute('aria-describedby'),'one-email-error');assert.equal(d.querySelector('#one-email-error').textContent,'Periksa email');
  assert.equal(form.querySelector('[data-slot=alert-title]').textContent,'Tidak dapat masuk');assert.equal(new dom.window.FormData(form).get('scope'),'docs');assert(form.querySelector('a[href="/help"]'));
  assert.equal(d.querySelector('#two fieldset').disabled,true);assert.equal(d.querySelector('#two [role=status]').textContent,'Signing in…');assert.equal(d.querySelector('#two [data-block-submit]').textContent,'Sign in');
  const ids=[...d.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
 }finally{dom.window.close();}
 assert.throws(()=>renderToString(h(SignInBlock,{id:'bad',action:'/sign-in',emailName:'same',passwordName:'same'})),/distinct/);
});

test('packed sign-in hydrates without replacing fields and host owns submission, pending, error and reset',async()=>{
 const dom=new JSDOM(`<div id="root">${renderSignIn()}</div>`,{url:'https://consumer.test/sign-in.html'}),saved=new Map(),warnings=[];
 for(const key of ['window','document','HTMLElement','HTMLInputElement','FormData','navigator','IS_REACT_ACT_ENVIRONMENT']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:key==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[key]});}
 const oldError=console.error;console.error=(...args)=>warnings.push(args.join(' '));let root;
 try{
  const {hydrateRoot}=await import('react-dom/client'),original=document.querySelector('[data-sign-in-proof] input');
  await act(async()=>{root=hydrateRoot(document.querySelector('#root'),h(StrictMode,{},h(SignInProof)),{identifierPrefix:'signin-',onRecoverableError:e=>warnings.push(String(e))});});
  assert.equal(original,document.querySelector('[data-sign-in-proof] input'));
  const form=document.querySelector('[data-sign-in-proof]'),email=form.elements.namedItem('email'),password=form.elements.namedItem('password'),user=userEvent.setup({document});
  const press=async text=>act(async()=>user.click([...document.querySelectorAll('button')].find(b=>b.textContent===text)));
  await act(async()=>user.click(form.querySelector('[type=submit]')));assert.equal(form.checkValidity(),false);assert.equal(document.querySelector('[data-sign-in-result]').textContent,'No request made.');
  await act(async()=>{await user.type(email,'reader@example.test');await user.type(password,'test-only');await user.click(form.querySelector('[type=submit]'));});
  assert.equal(form.querySelector('fieldset').disabled,true);assert.equal(new FormData(form).has('password'),false);assert(document.querySelector('[data-sign-in-result]').textContent.includes('not read'));
  assert.equal(document.querySelectorAll('[data-slot=sign-in-block]')[1].querySelector('fieldset').disabled,true);
  await press('Finish pending');assert.equal(password.value,'test-only');await press('Show local error');assert.equal(form.querySelector('[role=alert]').textContent,'Unable to sign inLocal example error. Try again.');
  await press('Reset sign-in');assert.equal(email.value,'');assert.equal(password.value,'');assert.equal(form.querySelector('[role=alert]'),null);
  await act(async()=>user.selectOptions(document.querySelector('[data-sign-in-language]'),'id'));assert.equal(form.querySelector('h2').textContent,'Masuk ke akun Anda');await press('Show local error');assert.equal(form.querySelector('[data-slot=alert-title]').textContent,'Tidak dapat masuk');
  assert.deepEqual(warnings,[]);
 }finally{if(root)await act(async()=>root.unmount());console.error=oldError;dom.window.close();for(const [key,value]of saved){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}
});

test('packed SignInBlock native form ref, reset and cleanup work without the preview host',async()=>{
 const dom=new JSDOM('<div id="root"></div>'),saved=new Map();
 for(const key of ['window','document','HTMLElement','IS_REACT_ACT_ENVIRONMENT']){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:key==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[key]});}
 let root;try{
  const {createRoot}=await import('react-dom/client'),ref=createRef();root=createRoot(document.querySelector('#root'));
  await act(async()=>root.render(h(SignInBlock,{id:'external',action:'/account',email:'authored@example.test',ref})));
  assert.equal(ref.current.tagName,'FORM');ref.current.elements.namedItem('email').value='changed@example.test';ref.current.reset();assert.equal(ref.current.elements.namedItem('email').value,'authored@example.test');
  await act(async()=>root.unmount());root=null;assert.equal(ref.current,null);
 }finally{if(root)await act(async()=>root.unmount());dom.window.close();for(const [key,value]of saved){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}
});

test('production sign-in preview remains guarded before hydration',async()=>{
 const dom=new JSDOM(await readFile('dist/sign-in.html','utf8'));try{const f=dom.window.document.querySelector('[data-sign-in-proof]');assert(f);assert.equal(f.querySelector('[type=submit]').disabled,true);assert.equal(f.querySelector('[type=password]').hasAttribute('value'),false);}finally{dom.window.close();}
});
