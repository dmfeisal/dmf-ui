const owners=new Map<HTMLDetailsElement,AbortController>();
function initialize(){for(const root of document.querySelectorAll<HTMLDetailsElement>('details[data-dmf-nav-disclosure]')){
 if(owners.has(root))continue;const abort=new AbortController();owners.set(root,abort);
 root.addEventListener('keydown',event=>{if(event.key!=='Escape'||!root.open)return;event.preventDefault();event.stopPropagation();root.open=false;root.querySelector<HTMLElement>('summary')?.focus();},{signal:abort.signal});
}}
initialize();document.addEventListener('astro:page-load',initialize);document.addEventListener('astro:before-swap',()=>{for(const abort of owners.values())abort.abort();owners.clear();});
