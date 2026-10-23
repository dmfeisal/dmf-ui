import {readFile} from 'node:fs/promises';
export async function run({page,baseURL,navigate}){
 await navigate(`${baseURL}/create/`);
 const read=path=>readFile(new URL(`../../${path}`,import.meta.url),'utf8');
 const [oldDMF,oldCB,newDMF,newCB,resolved]=await Promise.all([read('tests/fixtures/tokens/0.2.0-dmf.css'),read('tests/fixtures/tokens/0.2.0-cb.css'),read('src/styles/dmf-ui-tokens.css'),read('src/styles/dmf-ui-cb.css'),read('tokens/resolved.json')]);
 const groups=JSON.parse(resolved).groups;
 const results=[];
 for(const mode of ['light','dark','system-dark']){
  await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]});
  for(const system of ['dmf','cb-ui']){
   const group=system==='dmf'?(mode==='light'?'dmf.light':'dmf.dark'):'cb.light';
   const result=await page.evaluate(async({oldCSS,newCSS,mode,system,tokens})=>{
    async function sample(css){
     const iframe=document.createElement('iframe');iframe.style.cssText='position:fixed;left:-10000px;width:400px;height:400px';document.body.append(iframe);
     try{
      const doc=iframe.contentDocument;doc.body.innerHTML='<div class="dmf-ui"></div>';
      if(mode!=='system-dark')doc.documentElement.dataset.theme=mode;
      const style=doc.createElement('style');style.textContent=css.replace(/@font-face\s*\{[^}]*\}/g,'');doc.head.append(style);
      const root=doc.querySelector('.dmf-ui');if(system==='cb-ui')root.dataset.system='cb-ui';
      const output={};for(const [name,token] of Object.entries(tokens)){
       const el=doc.createElement('span');const property=({color:'color',dimension:'width',shadow:'box-shadow',fontFamily:'font-family'})[token.type];
       el.style.setProperty(property,`var(--${name})`);root.append(el);output[name]=iframe.contentWindow.getComputedStyle(el).getPropertyValue(property);el.remove();
      }return output;
     }finally{iframe.remove();}
    }
    const before=await sample(oldCSS),after=await sample(newCSS);return {count:Object.keys(before).length,differences:Object.keys(before).filter(key=>before[key]!==after[key]).map(key=>({key,before:before[key],after:after[key]}))};
   },{oldCSS:oldDMF+'\n'+oldCB,newCSS:newDMF+'\n'+newCB,mode,system,tokens:{...groups['dmf.light'],...(mode==='light'?{}:groups['dmf.dark']),...groups[group]}});
   if(result.differences.length)throw new Error(`${mode}/${system} token parity: ${JSON.stringify(result.differences)}`);
   results.push({mode,system,tokens:result.count});
  }
 }
 await page.cdp('Emulation.setEmulatedMedia',{features:[]});console.log('PASS 0.2.0 → 0.3.0 computed token parity:',JSON.stringify(results));
}
