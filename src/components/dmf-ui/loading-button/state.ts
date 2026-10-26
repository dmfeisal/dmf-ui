export function setLoadingButtonState(button:HTMLButtonElement,loading:boolean){
 if(button.dataset.slot!=='loading-button')throw new Error('Expected a LoadingButton element.');
 button.dataset.loading=String(loading);button.disabled=loading||button.dataset.idleDisabled==='true';
 if(loading)button.setAttribute('aria-busy','true');else button.removeAttribute('aria-busy');
 const label=button.dataset.label;button.setAttribute('aria-label',label??'Working…');if(button.dataset.presentation==='icon')button.title=label??'Working…';
 button.querySelector('[data-idle-label]')?.setAttribute('aria-hidden','false');button.querySelector('[data-pending-label]')?.setAttribute('aria-hidden','true');
 const status=button.nextElementSibling;if(status?.hasAttribute('data-loading-status'))status.textContent=loading?(button.dataset.loadingLabel??'Working…'):'';
}
