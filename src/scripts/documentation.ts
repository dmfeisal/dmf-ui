type SearchEntry={title:string;description:string;href:string;group:string;keywords:string};
const normalize=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const trigger=document.querySelector<HTMLButtonElement>('#docs-search-trigger');
const dialog=document.querySelector<HTMLDialogElement>('#docs-search-dialog');
const input=document.querySelector<HTMLInputElement>('#docs-search-input');
const results=document.querySelector<HTMLElement>('#docs-search-results');
const count=document.querySelector<HTMLElement>('#docs-search-count');
const source=document.querySelector('#docs-search-index');
if(trigger&&dialog&&input&&results&&count&&source){
 const entries=JSON.parse(source.textContent??'[]') as SearchEntry[];
 let returnFocus:HTMLElement|null=null;
 function render(){
  const query=normalize(input!.value.trim()),terms=query.split(/\s+/).filter(Boolean);
  const matches=entries.map((entry,index)=>({entry,index,text:normalize(`${entry.title} ${entry.description} ${entry.keywords}`)})).filter(item=>terms.every(term=>item.text.includes(term))).sort((a,b)=>{
   const score=(item:typeof a)=>normalize(item.entry.title)===query?3:normalize(item.entry.title).startsWith(query)?2:1;
   return score(b)-score(a)||a.index-b.index;
  });
  results!.replaceChildren();
  count!.textContent=terms.length?`${matches.length} ${matches.length===1?'result':'results'}`:'Browse components and guides';
  if(!matches.length){
   const empty=document.createElement('p');empty.className='docs-search-empty';empty.textContent='No results. Try a component name, a purpose, or a guide topic.';results!.append(empty);return;
  }
  const shown=matches.slice(0,12);
  for(const group of [...new Set(shown.map(item=>item.entry.group))]){
   const section=document.createElement('section'),heading=document.createElement('h3');heading.textContent=group;section.append(heading);
   for(const {entry} of shown.filter(item=>item.entry.group===group)){
    const link=document.createElement('a');link.href=entry.href;link.className='docs-search-result';
    const title=document.createElement('span'),description=document.createElement('small');title.textContent=entry.title;description.textContent=entry.description;link.append(title,description);section.append(link);
   }
   results!.append(section);
  }
  if(matches.length>shown.length){const hint=document.createElement('p');hint.className='docs-search-more';hint.textContent='Showing the first 12 results. Type more to narrow your search.';results!.append(hint);}
 }
 function open(){if(dialog!.open)return;returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:trigger;input!.value='';render();dialog!.showModal();input!.focus();}
 trigger.hidden=false;document.querySelector<HTMLElement>('.docs-search-fallback')!.hidden=true;
 const shortcut=trigger.querySelector('kbd');if(shortcut){shortcut.textContent=/Mac|iPhone|iPad/.test(navigator.platform)?'⌘ K':'Ctrl K';trigger.setAttribute('aria-label',`Search documentation ${shortcut.textContent}`);}
 trigger.addEventListener('click',open);
 input.addEventListener('input',render);
 dialog.querySelector('[data-search-close]')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();else trigger.focus();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();dialog.close();return;}
  if(!['ArrowDown','ArrowUp'].includes(event.key))return;
  const links=[...results.querySelectorAll<HTMLAnchorElement>('a')];if(!links.length)return;
  const active=document.activeElement;if(active!==input&&!links.includes(active as HTMLAnchorElement))return;
  event.preventDefault();const index=links.indexOf(active as HTMLAnchorElement);
  const next=index<0?(event.key==='ArrowDown'?0:links.length-1):(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next].focus();
 });
 document.addEventListener('keydown',event=>{
  const target=event.target as HTMLElement|null,editable=target?.closest('input,textarea,select,[contenteditable]:not([contenteditable=false])');
  if((!event.altKey&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k')||(event.key==='/'&&!editable&&!event.metaKey&&!event.ctrlKey&&!event.altKey)){
   event.preventDefault();open();
  }
 });
}
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-code]')){
 button.hidden=false;
 button.addEventListener('click',async()=>{
  const pre=document.getElementById(button.dataset.copyCode!)!,status=document.getElementById(button.dataset.copyStatus!)!;
  try{await navigator.clipboard.writeText(pre.querySelector('code')?.textContent??'');status.textContent='Code copied.';}
  catch{status.textContent='Copy unavailable. Select the code and copy it manually.';pre.focus();}
 });
}
const media=matchMedia('(prefers-color-scheme: dark)'),modes=['system','light','dark'] as const;
let mode=0;
function apply(){document.documentElement.dataset.theme=modes[mode]==='system'?(media.matches?'dark':'light'):modes[mode];const button=document.getElementById('docs-theme');if(button){const label=`Theme: ${modes[mode][0].toUpperCase()}${modes[mode].slice(1)}`;const next=modes[(mode+1)%modes.length];const description=document.querySelector('[data-theme-description]');if(description)description.textContent=`${label}. Switch to ${next[0].toUpperCase()}${next.slice(1)}.`;button.setAttribute('aria-label',label);for(const icon of button.querySelectorAll<HTMLElement>('[data-theme-icon]'))icon.toggleAttribute('hidden',icon.dataset.themeIcon!==modes[mode]);}}
document.getElementById('docs-theme')?.addEventListener('click',()=>{mode=(mode+1)%modes.length;apply();});media.addEventListener('change',apply);apply();

const github=document.querySelector<HTMLAnchorElement>('.docs-github');
if(github){
 const cacheKey='dmf-ui-github-stars',ttl=5*60*1000;
 const showStars=(stars:number)=>{github.querySelector('[data-github-stars]')!.textContent=new Intl.NumberFormat('en',{notation:stars>=10000?'compact':'standard',maximumFractionDigits:1}).format(stars);github.querySelector('[data-github-stars-label]')!.textContent=` ${stars===1?'star':'stars'}`;github.title=`${stars.toLocaleString('en')} ${stars===1?'star':'stars'} on GitHub`;};
 const valid=(value:unknown):value is number=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0;
 async function refreshStars(){
  try{const cached=JSON.parse(sessionStorage.getItem(cacheKey)??'null');if(cached&&valid(cached.stars)&&Number.isFinite(cached.at)&&Date.now()>=cached.at&&Date.now()-cached.at<ttl){showStars(cached.stars);return;}}catch{}
  try{
   const response=await fetch('https://api.github.com/repos/dmfeisal/dmf-ui',{headers:{Accept:'application/vnd.github+json'},credentials:'omit',signal:AbortSignal.timeout(4000)});
   if(!response.ok)return;const data=await response.json();if(!valid(data.stargazers_count))return;showStars(data.stargazers_count);
   try{sessionStorage.setItem(cacheKey,JSON.stringify({stars:data.stargazers_count,at:Date.now()}));}catch{}
  }catch{}
 }
 void refreshStars();
}

const header=document.querySelector<HTMLElement>('.docs-header');
const footer=document.querySelector<HTMLElement>('.docs-footer');
if(header){
 let measuredHeight=0,measuredFooter=0;
 const measureHeader=()=>{const height=Math.ceil(header.getBoundingClientRect().height);if(height!==measuredHeight){measuredHeight=height;document.documentElement.style.setProperty('--docs-header-height',`${height}px`);}const footerHeight=Math.ceil(footer?.getBoundingClientRect().height??0);if(footerHeight!==measuredFooter){measuredFooter=footerHeight;document.documentElement.style.setProperty('--docs-footer-height',`${footerHeight}px`);}};
 measureHeader();
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(measureHeader);observer.observe(header);if(footer)observer.observe(footer);}
 else window.addEventListener('resize',measureHeader,{passive:true});
 void document.fonts.ready.then(measureHeader);
}
const contentsLinks=[...document.querySelectorAll<HTMLAnchorElement>('.docs-toc a[href^="#"]')];
const contents=contentsLinks.map(link=>({link,target:document.getElementById(decodeURIComponent(link.hash.slice(1)))})).filter((item):item is {link:HTMLAnchorElement;target:HTMLElement}=>!!item.target);
if(contents.length){
 const contentsVisible=matchMedia('(min-width:1281px)');
 let frame=0,current='';
 const updateContents=()=>{
  frame=0;if(!contentsVisible.matches)return;
  const line=(header?.getBoundingClientRect().bottom??0)+32;
  const positions=contents.map(item=>({...item,top:item.target.getBoundingClientRect().top}));
  const atEnd=window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-4;
  let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{}
  const anchored=positions.find(item=>item.target.id===hash&&item.top>=line-32&&item.top<innerHeight*.65);
  const active=anchored??(atEnd?positions.at(-1):positions.filter(item=>item.top<=line).at(-1)??positions[0]);
  if(!active||active.target.id===current)return;current=active.target.id;
  for(const {link,target} of contents){if(target.id===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
 };
 const scheduleContents=()=>{if(contentsVisible.matches&&!frame)frame=requestAnimationFrame(updateContents);};
 window.addEventListener('scroll',scheduleContents,{passive:true});window.addEventListener('resize',scheduleContents,{passive:true});window.addEventListener('hashchange',scheduleContents);updateContents();
}
