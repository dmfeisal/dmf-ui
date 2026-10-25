import {setTogglePressed} from './state';
const owners=new Map<HTMLButtonElement,AbortController>();
function initialize(){for(const button of document.querySelectorAll<HTMLButtonElement>('[data-dmf-toggle]')){
 if(owners.has(button))continue;
 const abort=new AbortController();owners.set(button,abort);
 button.addEventListener('click',()=>setTogglePressed(button,button.getAttribute('aria-pressed')!=='true'),{signal:abort.signal});
 button.disabled=button.dataset.toggleDisabled==='true';
}}
initialize();document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
