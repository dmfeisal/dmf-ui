import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Button,Text,Input,Switch,Card} from '../.test-dist/index.mjs';
test('server output preserves native semantics and explicit content hierarchy',()=>{
 const html=renderToStaticMarkup(createElement(Card,{},createElement(Text,{as:'h2',size:'title'},'Settings'),createElement(Button,{},'Save')));
 assert.match(html,/<h2[^>]+data-slot="text"/);assert.match(html,/<button[^>]+type="button"/);assert.doesNotMatch(html,/role="button"/);
});
test('native controls retain required, disabled and form value contracts',()=>{
 const html=renderToStaticMarkup(createElement('form',{},createElement(Input,{name:'name',defaultValue:'Feisal',required:true}),createElement(Switch,{name:'updates',defaultChecked:true,disabled:true},'Updates')));
 assert.match(html,/name="name"/);assert.match(html,/required=""/);assert.match(html,/type="checkbox"/);assert.match(html,/role="switch"/);assert.match(html,/checked=""/);assert.match(html,/disabled=""/);assert.doesNotMatch(html,/data-dmf-switch/);
});
