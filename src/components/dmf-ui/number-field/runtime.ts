export {};
const owners=new Map<HTMLElement,AbortController>();
function initialize(){for(const root of document.querySelectorAll<HTMLElement>('[data-slot=number-field]')){
 if(owners.has(root))continue;
 const input=root.querySelector<HTMLInputElement>('input[type=number]')!;
 const controls=root.querySelector<HTMLElement>('[data-number-controls]')!;
 const buttons=[...controls.querySelectorAll<HTMLButtonElement>('[data-number-step]')];
 const abort=new AbortController();owners.set(root,abort);const signal=abort.signal;
 function sync(){const value=input.valueAsNumber;for(const button of buttons){const direction=Number(button.dataset.numberStep);button.disabled=input.matches(':disabled')||input.readOnly||input.validity.badInput||(Number.isFinite(value)&&((direction<0&&input.min!==''&&value<=Number(input.min))||(direction>0&&input.max!==''&&value>=Number(input.max))));}}
 for(const button of buttons)button.addEventListener('click',()=>{sync();if(button.disabled)return;const previous=input.value;if(Number(button.dataset.numberStep)>0)input.stepUp();else input.stepDown();sync();if(input.value!==previous){input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}},{signal});
 input.addEventListener('input',sync,{signal});input.addEventListener('change',sync,{signal});
 input.form?.addEventListener('reset',()=>setTimeout(()=>{if(!signal.aborted)sync();},0),{signal});
 controls.hidden=false;sync();
}}
initialize();document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
