import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Button,Text,Input,Switch,Card,Badge,Alert,AlertTitle,AlertDescription,AlertAction,Label,Textarea,Checkbox,Separator,CardTitle,Field,FieldError,FieldSet,FieldLegend} from '../.test-dist/index.mjs';
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

test('basic form primitives preserve labels, native values and separator semantics',()=>{
 const html=renderToStaticMarkup(createElement('form',{},createElement(Label,{htmlFor:'notes'},'Notes'),createElement(Textarea,{id:'notes',name:'notes',defaultValue:'Local notes',required:true}),createElement(Checkbox,{name:'accepted',defaultChecked:true,required:true})));
 assert.match(html,/for="notes"/);assert.match(html,/<textarea[^>]*name="notes"[^>]*>Local notes<\/textarea>/);assert.match(html,/type="checkbox"/);assert.doesNotMatch(html,/role="switch"/);
 const decorative=renderToStaticMarkup(createElement(Separator,{}));assert.match(decorative,/role="none"/);assert.doesNotMatch(decorative,/aria-orientation|tabindex/i);
 const semantic=renderToStaticMarkup(createElement(Separator,{decorative:false,orientation:'vertical'}));assert.match(semantic,/role="separator"/);assert.match(semantic,/aria-orientation="vertical"/);
});

test('Field errors are authored, deduplicated and absent when empty',()=>{
 assert.equal(renderToStaticMarkup(createElement(FieldError,{errors:[undefined,{message:' '}]})),'');
 const html=renderToStaticMarkup(createElement(FieldError,{errors:[{message:' Required '},{message:'Required'},{message:'Too short'}]}));assert.equal((html.match(/<li>/g)||[]).length,2);assert.match(html,/role="alert"/);
 assert.equal(renderToStaticMarkup(createElement(FieldError,{errors:[{message:'Ignored'}]},'Authored')).includes('Ignored'),false);
 const grouped=renderToStaticMarkup(createElement(FieldSet,{disabled:true},createElement(FieldLegend,{},'Group'),createElement(Field,{orientation:'horizontal'},createElement(CardTitle,{as:'h3'},'Heading'))));assert.match(grouped,/<fieldset[^>]*disabled/);assert.match(grouped,/<legend/);assert.match(grouped,/<h3/);assert.match(grouped,/data-orientation="horizontal"/);
});
