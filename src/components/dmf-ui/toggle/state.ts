export function setTogglePressed(button:HTMLButtonElement,pressed:boolean){
 if(!button.hasAttribute('data-dmf-toggle'))throw new Error('Expected a Toggle button.');
 const group=button.closest<HTMLElement>('[data-slot=toggle-group]');
 const changed:HTMLButtonElement[]=[];
 const apply=(target:HTMLButtonElement,value:boolean)=>{if(target.getAttribute('aria-pressed')!==String(value)){target.setAttribute('aria-pressed',String(value));changed.push(target);}};
 if(pressed&&group?.dataset.type==='single')for(const other of group.querySelectorAll<HTMLButtonElement>('[data-dmf-toggle]'))if(other!==button)apply(other,false);
 apply(button,pressed);
 for(const target of changed)target.dispatchEvent(new CustomEvent('toggle:change',{bubbles:true,detail:{pressed:target.getAttribute('aria-pressed')==='true',value:target.dataset.value}}));
 if(group&&changed.length)group.dispatchEvent(new CustomEvent('toggle-group:change',{bubbles:true,detail:{values:[...group.querySelectorAll<HTMLButtonElement>('[data-dmf-toggle][aria-pressed=true]')].map(item=>item.dataset.value)}}));
}
