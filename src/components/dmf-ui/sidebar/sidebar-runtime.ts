// Sidebar toggle (M16 batch 5). Each SidebarTrigger and SidebarRail flips the expanded or collapsed state of the nearest
// SidebarProvider, and reports it in aria-expanded on the trigger.
export {};
const owners=new Map<HTMLElement,AbortController>();
function initialize(){
 for(const wrapper of document.querySelectorAll<HTMLElement>('[data-slot=sidebar-wrapper]')){
  if(owners.has(wrapper))continue;
  const abort=new AbortController();owners.set(wrapper,abort);const signal=abort.signal;
  const sync=()=>{const open=wrapper.dataset.state!=='collapsed';for(const trigger of wrapper.querySelectorAll<HTMLElement>('[data-slot=sidebar-trigger]'))trigger.setAttribute('aria-expanded',String(open));};
  wrapper.addEventListener('click',event=>{
   const control=event.target instanceof Element?event.target.closest<HTMLElement>('[data-sidebar-toggle]'):null;
   if(!control||control.closest('[data-slot=sidebar-wrapper]')!==wrapper)return;
   wrapper.dataset.state=wrapper.dataset.state==='collapsed'?'expanded':'collapsed';sync();
  },{signal});
  sync();
 }
}
initialize();
document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
