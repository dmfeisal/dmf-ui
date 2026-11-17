export {};
const owners=new Map<HTMLElement,AbortController>();
function initialize(){for(const root of document.querySelectorAll<HTMLElement>('[data-slot=combobox]')){
 if(owners.has(root))continue;
 const fallback=root.querySelector<HTMLElement>('[data-combobox-fallback]')!;
 const enhanced=root.querySelector<HTMLElement>('[data-combobox-enhanced]')!;
 const select=root.querySelector<HTMLSelectElement>('[data-combobox-select]')!;
 const input=root.querySelector<HTMLInputElement>('[role=combobox]')!;
 const popup=root.querySelector<HTMLElement>('[data-combobox-popup]')!;
 const list=root.querySelector<HTMLElement>('[role=listbox]')!;
 const options=[...list.querySelectorAll<HTMLElement>('[role=option]')];
 // ComboboxEmpty is optional in parts mode.
 const empty=root.querySelector<HTMLElement>('[data-combobox-empty]');
 const status=root.querySelector<HTMLElement>('[data-combobox-status]')!;
 const multi=root.dataset.comboboxMultiple==='true';
 const chips=[...root.querySelectorAll<HTMLElement>('[data-slot=combobox-chip]')];
 const triggers=[...root.querySelectorAll<HTMLButtonElement>('[data-combobox-trigger]')];
 const clears=[...root.querySelectorAll<HTMLButtonElement>('[data-combobox-clear]')];
 const values=[...root.querySelectorAll<HTMLElement>('[data-combobox-value]')];
 const groups=[...list.querySelectorAll<HTMLElement>('[data-slot=combobox-group]')];
 const separators=[...list.querySelectorAll<HTMLElement>('[data-slot=combobox-separator]')];
 // Parts mode leaves ids and relationships to the runtime: the parts cannot see the root's id.
 const base=root.dataset.comboboxId??'';
 if(!input.id&&base)input.id=base;
 if(!list.id)list.id=`${base}-list`;
 input.setAttribute('aria-controls',list.id);
 if(!list.hasAttribute('aria-label')&&!list.hasAttribute('aria-labelledby'))list.setAttribute('aria-label',`${root.dataset.comboboxLabel??''} options`);
 options.forEach((option,index)=>{if(!option.id)option.id=`${base}-option-${index}`;});
 groups.forEach((group,index)=>{const label=group.querySelector<HTMLElement>('[data-slot=combobox-label]');if(label&&!group.hasAttribute('aria-labelledby')){if(!label.id)label.id=`${base}-group-${index}`;group.setAttribute('aria-labelledby',label.id);}});
 const abort=new AbortController();owners.set(root,abort);const signal=abort.signal;
 let active:HTMLElement|undefined;let composing=false;
 const selectedLabel=()=>select.selectedOptions[0]?.value?select.selectedOptions[0].textContent??'':'';
 const available=()=>options.filter(option=>!option.hidden&&option.getAttribute('aria-disabled')!=='true');
 function highlight(option?:HTMLElement){if(active)delete active.dataset.active;active=option;if(active){active.dataset.active='true';input.setAttribute('aria-activedescendant',active.id);const optionRect=active.getBoundingClientRect(),listRect=list.getBoundingClientRect();if(optionRect.top<listRect.top)list.scrollTop-=listRect.top-optionRect.top;else if(optionRect.bottom>listRect.bottom)list.scrollTop+=optionRect.bottom-listRect.bottom;}else input.removeAttribute('aria-activedescendant');}
 function filter(query:string){const needle=query.trim().toLocaleLowerCase();for(const option of options)option.hidden=!option.dataset.label!.toLocaleLowerCase().includes(needle);for(const group of groups)group.hidden=![...group.querySelectorAll<HTMLElement>('[role=option]')].some(option=>!option.hidden);for(const separator of separators)separator.hidden=!!needle;highlight();const count=available().length;const matches=options.some(option=>!option.hidden);if(empty)empty.hidden=matches;list.hidden=!matches&&!!empty;status.textContent=count?`${count} option${count===1?'':'s'} available.`:'No available options.';}
 function position(){
  const rect=root.getBoundingClientRect();
  const below=Math.max(0,window.innerHeight-rect.bottom);
  const safeTop=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
  const above=Math.max(0,rect.top-safeTop);
  const side=below<180&&above>below?'top':'bottom';
  popup.dataset.side=side;
  const style=getComputedStyle(popup);
  const offset=parseFloat(side==='top'?style.bottom:style.top);
  const gap=Number.isFinite(offset)?Math.max(0,offset-rect.height):0;
  const edges=[style.marginBlockStart,style.marginBlockEnd,style.paddingBlockStart,style.paddingBlockEnd,style.borderTopWidth,style.borderBottomWidth].reduce((sum,value)=>sum+(parseFloat(value)||0),0);
  const height=Math.max(0,Math.min(240,(side==='top'?above:below)-gap-edges-8));
  popup.style.setProperty('--combobox-available-height',`${height}px`);
 }
 function open(query=''){
  if(input.disabled||input.matches(':disabled'))return;
  const rect=input.getBoundingClientRect();
  const safeTop=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
  if(rect.bottom>innerHeight-8||rect.top<safeTop+8)input.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
  filter(query);
  popup.hidden=false;
  position();
  input.setAttribute('aria-expanded',String(!list.hidden));
 }
 const chosen=()=>[...select.selectedOptions].filter(o=>o.value);
 function syncChips(){for(const option of options)option.setAttribute('aria-selected',String(chosen().some(o=>o.value===option.dataset.value)));for(const chip of chips)chip.hidden=!chosen().some(o=>o.value===chip.dataset.value);for(const value of values)value.textContent=chosen().map(o=>o.textContent).join(', ');}
 function announce(){select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));}
 function close(){popup.hidden=true;input.setAttribute('aria-expanded','false');highlight();status.textContent='';input.value=multi?'':selectedLabel();input.setCustomValidity('');}
 function sync(){if(multi){input.disabled=select.disabled;input.value='';syncChips();for(const trigger of triggers)trigger.disabled=select.disabled;close();return;}input.disabled=select.disabled;input.value=selectedLabel();input.required=select.dataset.comboboxRequired==='true';for(const option of options)option.setAttribute('aria-selected',String(option.dataset.value===select.value));for(const trigger of triggers)trigger.disabled=select.disabled;for(const clear of clears){clear.disabled=select.disabled;clear.hidden=!select.value;}for(const value of values)value.textContent=selectedLabel();close();}
 function commit(option:HTMLElement){if(option.getAttribute('aria-disabled')==='true')return;if(multi){const o=[...select.options].find(x=>x.value===option.dataset.value);if(o){o.selected=!o.selected;syncChips();announce();input.value='';filter('');input.focus();}return;}select.value=option.dataset.value!;sync();select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));input.focus();}
 input.addEventListener('click',()=>{if(popup.hidden)open();},{signal});
 input.addEventListener('compositionstart',()=>{composing=true;},{signal});input.addEventListener('compositionend',()=>{composing=false;open(input.value);},{signal});
 input.addEventListener('input',()=>{if(!composing){open(input.value);input.setCustomValidity(input.value&&input.value!==selectedLabel()?'Choose an option from the list.':'');}},{signal});
 input.addEventListener('keydown',event=>{
  if(event.isComposing||composing||input.disabled)return;
  if(multi&&event.key==='Backspace'&&input.value===''){const last=chosen().at(-1);if(last){last.selected=false;sync();announce();}event.preventDefault();return;}
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();if(popup.hidden)open();const items=available();const index=active?items.indexOf(active):-1;const next=event.key==='ArrowDown'?Math.min(index+1,items.length-1):(index<0?items.length-1:Math.max(index-1,0));highlight(items[next]);
  }else if(event.key==='Enter'&&!popup.hidden){event.preventDefault();if(active)commit(active);}
  else if(event.key==='Escape'&&!popup.hidden){event.preventDefault();event.stopPropagation();close();}
  else if(event.key==='Tab')close();
 },{signal});
 list.addEventListener('pointerdown',event=>event.preventDefault(),{signal});
 for(const trigger of triggers){trigger.addEventListener('pointerdown',event=>event.preventDefault(),{signal});trigger.addEventListener('click',()=>{if(popup.hidden)open();else close();input.focus();},{signal});}
 for(const clear of clears)clear.addEventListener('click',()=>{select.value='';sync();select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));input.focus();},{signal});
 list.addEventListener('click',event=>{const option=event.target instanceof Element?event.target.closest<HTMLElement>('[role=option]'):null;if(option&&options.includes(option))commit(option);},{signal});
 root.addEventListener('focusout',event=>{if(!(event.relatedTarget instanceof Node)||!root.contains(event.relatedTarget))close();},{signal});
 document.addEventListener('pointerdown',event=>{if(event.target instanceof Node&&!root.contains(event.target))close();},{signal});
 select.addEventListener('change',sync,{signal});
 select.form?.addEventListener('reset',()=>setTimeout(()=>{if(!signal.aborted)sync();},0),{signal});
 for(const chip of chips)chip.querySelector('[data-slot=combobox-chip-remove]')?.addEventListener('click',event=>{event.preventDefault();const o=[...select.options].find(x=>x.value===chip.dataset.value);if(o){o.selected=false;sync();announce();}input.focus();},{signal});
 window.addEventListener('resize',()=>{if(!popup.hidden)position();},{signal});
 document.addEventListener('scroll',()=>{if(!popup.hidden)position();},{signal,capture:true,passive:true});
 select.dataset.comboboxRequired=String(select.required);select.required=false;fallback.hidden=true;enhanced.hidden=false;sync();
}}
initialize();document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
