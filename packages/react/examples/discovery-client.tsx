import {hydrateRoot} from 'react-dom/client';
import {DiscoveryExample} from './discovery';
export function mountDiscovery(){const root=document.querySelector<HTMLElement>('[data-discovery-root]');if(!root)return;const assets=JSON.parse(root.dataset.discoveryAssets!);const app=hydrateRoot(root,<DiscoveryExample assets={assets}/>);document.addEventListener('astro:before-swap',()=>app.unmount(),{once:true});}
