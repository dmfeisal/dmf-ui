const form=document.querySelector<HTMLFormElement>('#preset-controls');
if(form){
 const allowed={system:['dmf','cb-ui','horego','portfolio'],accent:['default','blue','violet','teal'],radius:['default','none','small','large'],font:['default','system','nunito'],mode:['light','dark','yellow'],direction:['ltr','rtl']} as const;
 type Key=keyof typeof allowed;
 const defaults={system:'dmf',accent:'default',radius:'default',font:'default',mode:'light',direction:'ltr'};
 const surface=document.querySelector<HTMLElement>('#preset-surface')!;
 const host=document.querySelector<HTMLElement>('#preset-preview')!;
 const code=document.querySelector<HTMLElement>('#preset-code')!;
 const status=document.querySelector<HTMLElement>('#preset-status')!;
 const control=(key:Key)=>form.elements.namedItem(key) as HTMLSelectElement;
 const params=new URLSearchParams(location.search);
 for(const key of Object.keys(allowed) as Key[]){const value=params.get(key);if(value&&(allowed[key] as readonly string[]).includes(value))control(key).value=value;}
 let settings={...defaults};let css='';let link='';
 function update(){
  settings=Object.fromEntries((Object.keys(allowed) as Key[]).map(key=>[key,control(key).value])) as typeof defaults;
  const cb=settings.system==='cb-ui',horego=settings.system==='horego',branded=cb||horego,portfolio=settings.system==='portfolio';
  if(settings.mode==='yellow'&&!portfolio){settings.mode='light';control('mode').value='light';}
  control('mode').querySelector<HTMLOptionElement>('option[value=yellow]')!.disabled=!portfolio;
  if(branded){settings.accent='default';settings.mode='light';control('accent').value='default';control('mode').value='light';}
  if(portfolio){settings.accent='default';control('accent').value='default';}
  control('accent').disabled=branded||portfolio;control('mode').disabled=branded;
  document.querySelector('#accent-note')!.textContent=portfolio?'Portfolio uses its source paper and ink palette.':horego?'Horego keeps Off Red #EC2A00 with black action labels for contrast.':cb?'CB UI keeps its primary color #26ade4.':'Choose a primary accent or keep the foundation default.';
  document.querySelector('#appearance-note')!.textContent=portfolio?'Portfolio supports Light, Dark and Yellow.':branded?'This product preset supports light appearance.':'DMF supports light and dark appearance.';
  document.querySelector<HTMLElement>('#horego-foundations')!.hidden=!horego;
  const values:Record<string,string>={};
  if(settings.accent!=='default'){
   values['--primary']=({blue:'#1d4ed8',violet:'#6d28d9',teal:'#0f766e'} as Record<string,string>)[settings.accent];values['--primary-foreground']='#ffffff';
  }
  if(settings.radius!=='default')values['--radius']=({none:'0rem',small:'0.25rem',large:'1rem'} as Record<string,string>)[settings.radius];
  if(settings.font!=='default'){values['--font-sans']=settings.font==='nunito'?"'DMF CB Nunito', sans-serif":'system-ui, sans-serif';values['--font-heading']='var(--font-sans)';}
  surface.removeAttribute('style');for(const [key,value] of Object.entries(values))surface.style.setProperty(key,value);
  surface.dataset.system=settings.system;surface.dataset.colorMode=branded?'light':settings.mode;surface.dir=settings.direction;host.dataset.theme=settings.mode;
  const scope=':root .dmf-ui[data-preset="custom"]';
  css=`/* DMF UI preset · Astro\n   Import dmf-ui/styles.css first.${portfolio?'\n   Also import dmf-ui/presets/portfolio.css and add data-system="portfolio" and data-color-mode="'+settings.mode+'" to the wrapper.':''}${horego?'\n   Also import dmf-ui/presets/horego.css and add data-system="horego" and data-color-mode="light" to the wrapper.':''}${cb?'\n   Also import dmf-ui/presets/cb-ui.css and add data-system="cb-ui" and data-color-mode="light" to the wrapper.':''}\n   Set the document data-theme to light or dark for DMF UI.\n   Preview: ${settings.mode}; direction: ${settings.direction}. Use dir="${settings.direction}" on your wrapper.\n   Preserve the library license notices. */\n${scope} {\n${Object.entries(values).map(([key,value])=>`  ${key}: ${value};`).join('\n')||'  /* Foundation defaults; no overrides. */'}\n}\n`;
  code.textContent=css;
  document.querySelector('#preset-summary')!.textContent=`${portfolio?'Portfolio':horego?'Horego':cb?'CB UI reconstruction':'DMF UI'} · Astro`;
  const url=new URL(location.href);url.search='';for(const [key,value] of Object.entries(settings))if(value!==defaults[key as Key])url.searchParams.set(key,value);link=url.href;history.replaceState(null,'',url);status.textContent='';
 }
 form.addEventListener('change',update);form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('reset',event=>{event.preventDefault();for(const key of Object.keys(defaults) as Key[])control(key).value=defaults[key];update();});
 async function copy(text:string,success:string){try{await navigator.clipboard.writeText(text);status.textContent=success;}catch{status.textContent='Copy unavailable. Select the generated CSS below and copy it manually.';code.closest('pre')?.focus();}}
 document.querySelector('#preview-primary')?.addEventListener('click',()=>{document.querySelector('#preview-action-status')!.textContent='Primary action previewed. Nothing was created or saved.';});
 document.querySelector('#preset-copy')?.addEventListener('click',()=>copy(css,'CSS copied.'));
 document.querySelector('#preset-link')?.addEventListener('click',()=>copy(link,'Preset link copied.'));
 document.querySelector('#preset-download')?.addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:1,platform:'astro',...settings,css},null,2)],{type:'application/json'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download='dmf-ui-preset.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Preset JSON downloaded.';
 });update();
}
