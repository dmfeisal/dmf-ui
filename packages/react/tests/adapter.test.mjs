import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Button,Text,Input,Switch,Card,Badge,Alert,AlertTitle,AlertDescription,AlertAction} from '../.test-dist/index.mjs';
test('server output preserves native semantics and explicit content hierarchy',()=>{
 const html=renderToStaticMarkup(createElement(Card,{},createElement(Text,{as:'h2',size:'title'},'Settings'),createElement(Button,{},'Save')));
 assert.match(html,/<h2[^>]+data-slot="text"/);assert.match(html,/<button[^>]+type="button"/);assert.doesNotMatch(html,/role="button"/);
});
test('native controls retain required, disabled and form value contracts',()=>{
 const html=renderToStaticMarkup(createElement('form',{},createElement(Input,{name:'name',defaultValue:'Feisal',required:true}),createElement(Switch,{name:'updates',defaultChecked:true,disabled:true},'Updates')));
 assert.match(html,/name="name"/);assert.match(html,/required=""/);assert.match(html,/type="checkbox"/);assert.match(html,/role="switch"/);assert.match(html,/checked=""/);assert.match(html,/disabled=""/);assert.doesNotMatch(html,/data-dmf-switch/);
});

test('content primitives preserve authored navigation and opt-in live semantics',()=>{
 const badge=renderToStaticMarkup(createElement(Badge,{},'Draft'));
 assert.match(badge,/^<span/);assert.doesNotMatch(badge,/role=|tabindex=/i);
 const link=renderToStaticMarkup(createElement(Badge,{as:'a',href:'#details',variant:'outline'},'Details'));
 assert.match(link,/^<a/);assert.match(link,/href="#details"/);
 const note=renderToStaticMarkup(createElement(Alert,{},createElement(AlertTitle,{},'Notice'),createElement(AlertDescription,{},'Local content'),createElement(AlertAction,{},createElement(Button,{},'Review'))));
 assert.match(note,/role="note"/);assert.doesNotMatch(note,/aria-live|role="alert"/);
 for(const role of ['status','alert'])assert.match(renderToStaticMarkup(createElement(Alert,{role,variant:'destructive'},'Authored update')),new RegExp(`role="${role}"`));
});
