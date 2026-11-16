// Navigation menu panels (M16 batch 5). Each trigger opens the panel in its own item. Only one panel is open at a time.
// Pointer: hovering a trigger opens its panel; leaving both trigger and panel closes it after a short delay.
// Keyboard: Enter, Space or ArrowDown opens and focuses the panel's first link; ArrowLeft and ArrowRight move between
// triggers (reversed in right-to-left text); Escape closes and returns focus to the trigger.
export {};
const owners=new Map<HTMLElement,AbortController>();

// A fixed panel is positioned from its containing block; take that origin into account (see the submenu runtime).
function containingOrigin(element:HTMLElement){
 for(let node=element.parentElement;node;node=node.parentElement){
  const style=getComputedStyle(node);
  if(style.transform!=='none'||style.perspective!=='none'||style.filter!=='none'||style.contain.includes('paint'))return node.getBoundingClientRect();
 }
 return {left:0,top:0} as DOMRect;
}

function initialize(){
 for(const root of document.querySelectorAll<HTMLElement>('[data-slot=navigation-menu]')){
  if(owners.has(root))continue;
  const pairs=[...root.querySelectorAll<HTMLElement>('[data-slot=navigation-menu-item]')].flatMap(item=>{
   const trigger=item.querySelector<HTMLElement>(':scope > [data-slot=navigation-menu-trigger]');
   const content=item.querySelector<HTMLElement>(':scope > [data-slot=navigation-menu-positioner] > [data-slot=navigation-menu-content], :scope > [data-slot=navigation-menu-content]');
   return trigger&&content?[{item,trigger,content}]:[];
  });
  if(!pairs.length)continue;
  const abort=new AbortController();owners.set(root,abort);const signal=abort.signal;
  const triggers=pairs.map(pair=>pair.trigger);
  let timer=0;
  const rtl=()=>getComputedStyle(root).direction==='rtl';
  const place=(trigger:HTMLElement,content:HTMLElement)=>{
   const rect=trigger.getBoundingClientRect();
   // Placement comes from the positioner that holds the panel, when there is one.
   const holder=content.parentElement?.dataset.slot==='navigation-menu-positioner'?content.parentElement:content;
   const side=holder.dataset.side??'bottom',align=holder.dataset.align??'start';
   const sideOffset=Number(holder.dataset.sideOffset??6)||0,alignOffset=Number(holder.dataset.alignOffset??0)||0;
   const origin=containingOrigin(content);
   const width=content.offsetWidth,height=content.offsetHeight;
   let left=align==='center'?rect.left+rect.width/2-width/2:align==='end'?rect.right-width:rect.left;
   left+=alignOffset;
   let top=rect.bottom+sideOffset;
   if(side==='top')top=rect.top-height-sideOffset;
   if(side==='left')left=rect.left-width-sideOffset;
   if(side==='right')left=rect.right+sideOffset;
   content.style.left=`${Math.max(8,Math.min(left,innerWidth-width-8))-origin.left}px`;
   content.style.top=`${Math.max(8,top)-origin.top}px`;
  };
  const setOpen=(pair:{item:HTMLElement;trigger:HTMLElement;content:HTMLElement},open:boolean)=>{
   const state=open?'open':'closed';
   pair.trigger.setAttribute('aria-expanded',String(open));
   pair.trigger.dataset.state=state;
   pair.content.dataset.state=state;
   if(open){pair.content.hidden=false;place(pair.trigger,pair.content);}
   else pair.content.hidden=true;
   pair.item.toggleAttribute('data-open',open);
  };
  const open=(index:number)=>{
   clearTimeout(timer);
   pairs.forEach((pair,i)=>{if(i!==index&&pair.trigger.getAttribute('aria-expanded')==='true')setOpen(pair,false);});
   setOpen(pairs[index],true);
  };
  const close=(index:number,restoreFocus:boolean)=>{
   setOpen(pairs[index],false);
   if(restoreFocus)pairs[index].trigger.focus();
  };
  const scheduleClose=(index:number)=>{clearTimeout(timer);timer=window.setTimeout(()=>{const pair=pairs[index];if(!pair.trigger.matches(':hover')&&!pair.content.matches(':hover')&&!pair.content.contains(document.activeElement))close(index,false);},150);};
  // A pointer press follows the hover that opened the panel; that click keeps the panel open.
  const hoverOpened=new Set<number>();
  const links=(index:number)=>[...pairs[index].content.querySelectorAll<HTMLElement>('a,button')].filter(el=>!el.hasAttribute('disabled'));

  pairs.forEach((pair,index)=>{
   const {trigger,content}=pair;
   trigger.addEventListener('click',()=>{if(hoverOpened.has(index)){hoverOpened.delete(index);return;}if(trigger.getAttribute('aria-expanded')==='true')close(index,false);else open(index);},{signal});
   trigger.addEventListener('keydown',event=>{
    const forward=rtl()?'ArrowLeft':'ArrowRight',back=rtl()?'ArrowRight':'ArrowLeft';
    if(event.key==='Enter'||event.key===' '||event.key==='ArrowDown'){event.preventDefault();open(index);links(index)[0]?.focus();}
    else if(event.key===forward||event.key===back){event.preventDefault();const next=triggers[(index+(event.key===forward?1:triggers.length-1))%triggers.length];next.focus();}
    else if(event.key==='Escape'){close(index,false);}
   },{signal});
   trigger.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;if(trigger.getAttribute('aria-expanded')!=='true'){open(index);hoverOpened.add(index);}},{signal});
   trigger.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')scheduleClose(index);},{signal});
   content.addEventListener('pointerenter',()=>clearTimeout(timer),{signal});
   content.addEventListener('pointerleave',()=>scheduleClose(index),{signal});
   content.addEventListener('keydown',event=>{
    const list=links(index),current=list.indexOf(document.activeElement as HTMLElement);
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(index,true);}
    else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(!list.length)return;const next=event.key==='ArrowDown'?(current+1)%list.length:(current<=0?list.length-1:current-1);list[next]?.focus();}
   },{signal});
   content.addEventListener('focusout',event=>{const next=event.relatedTarget;if(!(next instanceof Node)||(!content.contains(next)&&next!==trigger))close(index,false);},{signal});
   trigger.addEventListener('focusout',event=>{const next=event.relatedTarget;if(!(next instanceof Node)||(!content.contains(next)&&next!==trigger))close(index,false);},{signal});
  });
  document.addEventListener('pointerdown',event=>{if(event.target instanceof Node&&!root.contains(event.target))pairs.forEach((_,i)=>close(i,false));},{signal});
  window.addEventListener('resize',()=>pairs.forEach(pair=>{if(!pair.content.hidden)place(pair.trigger,pair.content);}),{signal});
 }
}
initialize();
document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
