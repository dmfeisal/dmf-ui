import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {Proof} from './Proof';
export function mountProof() {
 const element=document.querySelector<HTMLElement>('#react-proof');
 if(!element)return;
 const root=hydrateRoot(element,<StrictMode><Proof /></StrictMode>);
 const button=document.querySelector<HTMLButtonElement>('#react-unmount');
 button?.addEventListener('click',()=>{root.unmount();button.disabled=true;const status=document.querySelector('#react-lifecycle');if(status)status.textContent='React root unmounted.';},{once:true});
}
