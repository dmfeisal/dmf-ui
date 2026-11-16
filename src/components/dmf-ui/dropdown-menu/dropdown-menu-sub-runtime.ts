// Submenus. Data Slot's dropdown menu has no nested menus, so DMF UI runs its own: a trigger opens a role=menu panel
// beside it. The panel is fixed-positioned so the parent menu's scrolling cannot clip it. Keyboard: Enter, Space or
// the forward arrow opens; Escape or the back arrow closes and returns focus to the trigger. Keys handled here stop
// propagating, so Escape closes only the submenu, not the menu around it.
export {};
const owners=new Map<HTMLElement,AbortController>();
const itemSelector='[data-slot=dropdown-menu-item],[role=menuitem]';

// A fixed element is positioned from its containing block, which is the viewport unless an ancestor has a transform
// (Data Slot's positioner does). The offsets are therefore taken from that block's origin.
function containingOrigin(element:HTMLElement){
 for(let node=element.parentElement;node;node=node.parentElement){
  const style=getComputedStyle(node);
  if(style.transform!=='none'||style.perspective!=='none'||style.filter!=='none'||style.contain.includes('paint'))return node.getBoundingClientRect();
 }
 return {left:0,top:0} as DOMRect;
}

function place(trigger:HTMLElement,content:HTMLElement){
 const rect=trigger.getBoundingClientRect();
 const rtl=getComputedStyle(trigger).direction==='rtl';
 const width=content.offsetWidth,height=content.offsetHeight;
 const side=content.dataset.side??'inline-end';
 const sideOffset=Number(content.dataset.sideOffset??4)||0;
 const alignOffset=Number(content.dataset.alignOffset??0)||0;
 const align=content.dataset.align??'start';
 // Logical sides resolve against the reading direction; the panel opens to the right or left of the trigger.
 const physical=side==='left'?'left':side==='right'?'right':side==='inline-start'?(rtl?'right':'left'):(rtl?'left':'right');
 let left=physical==='right'?rect.right+sideOffset:rect.left-width-sideOffset;
 const fits=left>=8&&left+width<=innerWidth-8;
 if(!fits)left=physical==='right'?rect.left-width-sideOffset:rect.right+sideOffset;
 let top=align==='center'?rect.top+rect.height/2-height/2:align==='end'?rect.bottom-height:rect.top;
 top+=alignOffset;
 top=Math.min(top,innerHeight-height-8);
 const origin=containingOrigin(content);
 content.style.left=`${Math.max(8,Math.min(left,innerWidth-width-8))-origin.left}px`;
 content.style.top=`${Math.max(8,top)-origin.top}px`;
}

function initialize(){
 for(const sub of document.querySelectorAll<HTMLElement>('[data-slot=dropdown-menu-sub]')){
  if(owners.has(sub))continue;
  const trigger=sub.querySelector<HTMLElement>('[data-slot=dropdown-menu-sub-trigger]');
  const content=sub.querySelector<HTMLElement>('[data-slot=dropdown-menu-sub-content]');
  if(!trigger||!content)continue;
  const abort=new AbortController();owners.set(sub,abort);const signal=abort.signal;
  let timer=0;
  const items=()=>[...content.querySelectorAll<HTMLElement>(itemSelector)].filter(item=>item.getAttribute('aria-disabled')!=='true'&&!item.hasAttribute('disabled'));
  const rtl=()=>getComputedStyle(trigger).direction==='rtl';
  const open=(focusFirst:boolean)=>{
   if(trigger.getAttribute('aria-disabled')==='true'||trigger.hasAttribute('disabled'))return;
   clearTimeout(timer);content.hidden=false;trigger.setAttribute('aria-expanded','true');place(trigger,content);
   if(focusFirst)items()[0]?.focus();
  };
  const close=(restoreFocus:boolean)=>{
   content.hidden=true;trigger.setAttribute('aria-expanded','false');
   if(restoreFocus)trigger.focus();
  };
  const scheduleClose=()=>{clearTimeout(timer);timer=window.setTimeout(()=>{if(!trigger.matches(':hover')&&!content.matches(':hover')&&!content.contains(document.activeElement))close(false);},120);};

  trigger.addEventListener('click',()=>{if(content.hidden)open(true);else close(true);},{signal});
  trigger.addEventListener('keydown',event=>{
   const forward=rtl()?'ArrowLeft':'ArrowRight';
   if(event.key==='Enter'||event.key===' '||event.key===forward){event.preventDefault();event.stopPropagation();open(true);}
  },{signal});
  trigger.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')open(false);},{signal});
  trigger.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')scheduleClose();},{signal});
  content.addEventListener('pointerenter',()=>clearTimeout(timer),{signal});
  content.addEventListener('pointerleave',scheduleClose,{signal});
  for(const item of items())item.addEventListener('pointerenter',()=>item.focus(),{signal});
  content.addEventListener('keydown',event=>{
   const back=rtl()?'ArrowRight':'ArrowLeft';
   if(event.key==='Escape'||event.key===back){event.preventDefault();event.stopPropagation();close(true);return;}
   // Enter and Space activate the focused item with a click. The menu runtime handles keys only for items it knows,
   // so a submenu item would otherwise never be chosen from the keyboard; the click reaches the menu's own handler.
   if((event.key==='Enter'||event.key===' ')&&items().includes(document.activeElement as HTMLElement)){event.preventDefault();event.stopPropagation();(document.activeElement as HTMLElement).click();return;}
   if(event.key==='ArrowDown'||event.key==='ArrowUp'||event.key==='Home'||event.key==='End'){
    event.preventDefault();event.stopPropagation();
    const list=items();if(!list.length)return;
    const index=list.indexOf(document.activeElement as HTMLElement);
    const next=event.key==='Home'?0:event.key==='End'?list.length-1:event.key==='ArrowDown'?(index+1)%list.length:(index<=0?list.length-1:index-1);
    list[next]?.focus();
   }
  },{signal});
  content.addEventListener('focusout',event=>{
   const next=event.relatedTarget;
   if(!(next instanceof Node)||(!content.contains(next)&&next!==trigger))close(false);
  },{signal});
  window.addEventListener('resize',()=>{if(!content.hidden)place(trigger,content);},{signal});
 }
}
initialize();
document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
