import {containsWithPortals} from '@data-slot/core';
type Entry={content:HTMLElement;overlay:HTMLElement};
const stack:Entry[]=[];
const saved=new Map<Element,{inert:boolean;aria:string|null}>();
let observer:MutationObserver|undefined;
function restore(){for(const [element,state] of saved){element.toggleAttribute('inert',state.inert);if(state.aria===null)element.removeAttribute('aria-hidden');else element.setAttribute('aria-hidden',state.aria);}saved.clear();}
function refresh(){
 restore();const active=stack.at(-1);if(!active)return;
 const allowed=new Set<Element>([active.content,active.overlay]);
 for(const element of document.body.querySelectorAll('*'))if(containsWithPortals(active.content,element))allowed.add(element);
 const ancestors=new Set<Element>();for(const element of allowed)for(let parent=element.parentElement;parent;parent=parent.parentElement)ancestors.add(parent);
 function visit(parent:Element){for(const child of parent.children){if(allowed.has(child))continue;if(ancestors.has(child)){visit(child);continue;}saved.set(child,{inert:child.hasAttribute('inert'),aria:child.getAttribute('aria-hidden')});child.setAttribute('inert','');child.setAttribute('aria-hidden','true');}}
 visit(document.body);
}
export function createModalIsolation(content:HTMLElement,overlay:HTMLElement){
 const entry={content,overlay};
 return {open(){if(stack.includes(entry))return;stack.push(entry);if(!observer){observer=new MutationObserver(refresh);observer.observe(document.body,{childList:true,subtree:true});}refresh();},close(){const index=stack.indexOf(entry);if(index<0)return;stack.splice(index,1);if(!stack.length){observer?.disconnect();observer=undefined;}refresh();}};
}
