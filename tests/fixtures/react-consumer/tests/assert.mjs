import strict from 'node:assert/strict';

const isNode=value=>value!==null&&typeof value==='object'&&typeof value.nodeType==='number'&&typeof value.nodeName==='string';
const describe=value=>isNode(value)?`${value.nodeName.slice(0,40)}${value.id?`#${String(value.id).slice(0,80)}`:''}`:value===null?'null':typeof value;
function identity(actual,expected,message){
 if(isNode(actual)||isNode(expected))strict.ok(actual===expected,message??`DOM identity mismatch: ${describe(actual)} versus ${describe(expected)}`);
 else if(message===undefined)strict.equal(actual,expected);
 else strict.equal(actual,expected,message);
}
// React attaches cyclic Fiber graphs to DOM nodes. Never hand those graphs to assertion diff formatting.
export default new Proxy(strict,{get(target,key){return key==='equal'||key==='strictEqual'?identity:Reflect.get(target,key);}});
