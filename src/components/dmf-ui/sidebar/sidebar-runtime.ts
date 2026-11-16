// Sidebar state (M16 batch 5, M17). Each SidebarTrigger and SidebarRail flips the expanded or collapsed state of the nearest
// SidebarProvider and reports it in aria-expanded. Below the md breakpoint an offcanvas sidebar is an overlay: it starts
// collapsed, opens over the page with a backdrop, and the backdrop closes it. A sidebar with collapsible="none" is always
// shown, as in shadcn/ui. The container carries data-open while
// expanded, and each sidebar carries data-mobile.
export {};
const owners=new Map<HTMLElement,AbortController>();
const mobile=matchMedia('(max-width: 767px)');
const wrappers=new Set<HTMLElement>();
const started=new WeakSet<HTMLElement>();

function apply(wrapper:HTMLElement){
 const open=wrapper.dataset.state!=='collapsed';
 for(const trigger of wrapper.querySelectorAll<HTMLElement>('[data-slot=sidebar-trigger]'))trigger.setAttribute('aria-expanded',String(open));
 for(const sidebar of wrapper.querySelectorAll<HTMLElement>(':scope [data-slot=sidebar]')){
  const isMobile=mobile.matches;
  sidebar.dataset.mobile=String(isMobile);
  const fixed=sidebar.dataset.collapsible==='none';
  const container=sidebar.querySelector<HTMLElement>(':scope > [data-slot=sidebar-container]');
  container?.toggleAttribute('data-open',fixed||open);
  const backdrop=sidebar.querySelector<HTMLElement>(':scope > [data-slot=sidebar-backdrop]');
  if(backdrop)backdrop.hidden=!(isMobile&&open&&!fixed);
 }
}

function initialize(){
 for(const wrapper of document.querySelectorAll<HTMLElement>('[data-slot=sidebar-wrapper]')){
  if(owners.has(wrapper))continue;
  const abort=new AbortController();owners.set(wrapper,abort);const signal=abort.signal;
  wrappers.add(wrapper);
  // On small screens a sidebar that can collapse opens as a sheet, so it starts collapsed.
  if(mobile.matches&&!started.has(wrapper)&&wrapper.querySelector('[data-slot=sidebar]:not([data-collapsible=none])'))wrapper.dataset.state='collapsed';
  started.add(wrapper);
  wrapper.addEventListener('click',event=>{
   const control=event.target instanceof Element?event.target.closest<HTMLElement>('[data-sidebar-toggle]'):null;
   if(!control||control.closest('[data-slot=sidebar-wrapper]')!==wrapper)return;
   wrapper.dataset.state=wrapper.dataset.state==='collapsed'?'expanded':'collapsed';apply(wrapper);
  },{signal});
  apply(wrapper);
 }
}
mobile.addEventListener('change',()=>{for(const wrapper of wrappers)apply(wrapper);});
initialize();
document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();wrappers.clear();});
