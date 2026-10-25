export function setProgressValue(root:HTMLElement,value?:number){
 const progress=root.querySelector('progress');if(!progress)throw new Error('Expected a Progress root containing a native progress element.');
 if(value!==undefined&&(!Number.isFinite(value)||value<0||value>progress.max))throw new Error('Progress value must be between 0 and max.');
 if(value===undefined)progress.removeAttribute('value');else progress.value=value;
 root.dataset.indeterminate=String(value===undefined);
 let indicator=root.querySelector<HTMLElement>('.dmf-progress-indicator');
 if(value===undefined&&!indicator){indicator=document.createElement('span');indicator.className='dmf-progress-indicator';indicator.setAttribute('aria-hidden','true');root.querySelector('.dmf-progress-track')!.append(indicator);}
 if(indicator)indicator.hidden=value!==undefined;
 const output=root.querySelector('[data-progress-value]');if(output)output.textContent=value===undefined?'Working…':`${Math.round(value/progress.max*100)}%`;
}
