import {useEffect,useRef,useState} from 'react';
import type {MouseEvent} from 'react';
import {Button,MerchantCard,MerchantListingBlock,SearchFiltersBlock,Select,SelectItem,SelectTrigger,SelectValue,SelectContent} from '../src/index';
import {discoveryOptions,discoveryResults,discoveryURL,emptySelection,readDiscoverySelection} from './discovery-model';
import type {DiscoverySelection} from './discovery-model';
export type DiscoveryAssets={icons:{verified:string;hours:string;distance:string;star:string};photos:readonly {src:string;alt:string}[]};
export function DiscoveryExample({assets,action='/examples/discovery/'}:{assets:DiscoveryAssets;action?:string}){
 const [ready,setReady]=useState(false),[selection,setSelection]=useState<DiscoverySelection>(emptySelection),[formVersion,setFormVersion]=useState(0),[status,setStatus]=useState<'ready'|'loading'|'error'>('ready'),[preset,setPreset]=useState('dmf'),[mode,setMode]=useState('light');
 const focusResults=useRef(false),heading=useRef<HTMLHeadingElement>(null),form=useRef<HTMLFormElement>(null),result=discoveryResults(selection);
 useEffect(()=>{const restore=()=>{const next=readDiscoverySelection(new URLSearchParams(location.search));next.page=discoveryResults(next).page;setSelection(next);setFormVersion(v=>v+1);setStatus('ready');};restore();setReady(true);addEventListener('popstate',restore);return()=>removeEventListener('popstate',restore);},[]);
 useEffect(()=>{if(focusResults.current){focusResults.current=false;heading.current?.focus();}},[selection,status]);
 const apply=(next:DiscoverySelection)=>{next={...next,page:discoveryResults(next).page};const url=discoveryURL(location.href,next);if(url!==location.pathname+location.search+location.hash)history.pushState(null,'',url);setSelection(next);setStatus('ready');focusResults.current=true;};
 const navigate=(event:MouseEvent<HTMLAnchorElement>,page:number)=>{if(!ready||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();apply({...selection,page});};
 const pageHref=(page:number)=>discoveryURL(ready?location.href:action,{...selection,page});
 return <div className="dmf-ui discovery-example" data-system={preset} data-color-mode={preset==='hui'?'light':mode} data-discovery-ready={ready?'true':'false'}>
  <p>Six illustrative records for testing search and filtering. These are not real merchant listings, ratings or availability claims. Photos reuse the supplied card reference.</p>
  {!ready&&<p data-static-discovery>Interactive filtering requires JavaScript in this static example. In an application, the native GET form needs a host endpoint that renders the requested results.</p>}
  <fieldset className="discovery-tools" disabled={!ready}><legend>Example appearance and result states</legend>
   <label>Preset<Select value={preset} onValueChange={v=>setPreset(v as typeof preset)}><SelectTrigger data-discovery-preset><SelectValue/></SelectTrigger><SelectContent><SelectItem value="dmf">Neutral</SelectItem><SelectItem value="hui">HUI</SelectItem></SelectContent></Select></label>
   <label>Appearance<Select disabled={preset==='hui'} value={preset==='hui'?'light':mode} onValueChange={v=>setMode(v as typeof mode)}><SelectTrigger data-discovery-mode><SelectValue/></SelectTrigger><SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent></Select></label>
   <label>Result state preview<Select value={status} onValueChange={v=>setStatus(v as typeof status)}><SelectTrigger data-discovery-state><SelectValue/></SelectTrigger><SelectContent><SelectItem value="ready">Ready</SelectItem><SelectItem value="loading">Loading illustration</SelectItem><SelectItem value="error">Error illustration</SelectItem></SelectContent></Select></label>
   <p>State previews do not send requests.</p>
  </fieldset>
  <SearchFiltersBlock key={formVersion} ref={form} id="discovery-filters" action={action} title="Filter sample merchants" query={selection.q} options={discoveryOptions} selectedValue={selection.category} filters={[{name:'photos',label:'With supplied photos only',value:'yes',checked:selection.photos}]} pending={status==='loading'}
   onSubmit={event=>{if(!ready)return;event.preventDefault();const data=new FormData(event.currentTarget);apply(readDiscoverySelection(new URLSearchParams([...data].map(([key,value])=>[key,String(value)]))));}}
   onReset={event=>{if(!ready)return;event.preventDefault();apply({...emptySelection});setFormVersion(v=>v+1);}}/>
  <h2 ref={heading} tabIndex={-1} className="discovery-result-heading" data-discovery-summary>{status==='ready'?`${result.total} sample ${result.total===1?'result':'results'}`:'Sample results'}</h2>
  <MerchantListingBlock id="discovery-results" title="Sample merchants" items={result.items} getItemKey={item=>item.id} status={status} statusMessage={status==='ready'?`${result.total} sample results. Page ${result.page} of ${result.pages}.`:undefined} loadingLabel="Illustrative loading state. No request is running." emptyTitle="No sample merchants match" emptyDescription="Change the query or category, or reset the filters."
   emptyContent={<><h3>No sample merchants match</h3><p>Change the query or category, or use Reset filters.</p></>}
   errorContent={<><h3>Illustrative search error</h3><p>No request failed. This preview demonstrates host-owned recovery while preserving your applied filters.</p><Button variant="outline" onClick={()=>{setStatus('ready');form.current?.querySelector<HTMLInputElement>('input[type=search]')?.focus();}}>Return to sample results</Button></>}
   renderItem={item=><MerchantCard id={item.id} name={item.name} href="#discovery-sample-details" photos={item.photo?assets.photos:[]} icons={assets.icons} cuisines={item.cuisines}/>}
   pagination={result.pages>1&&<nav aria-label="Sample result pages" className="discovery-pagination">{Array.from({length:result.pages},(_,n)=>n+1).map(page=><a key={page} href={pageHref(page)} onClick={event=>navigate(event,page)} aria-current={page===result.page?'page':undefined}>Page {page}</a>)}</nav>}/>
  <section id="discovery-sample-details"><h2>About the sample cards</h2><p>Card links lead here to explain the illustrative records. A real application supplies a separate merchant destination and data source. Applying filters updates the URL; Back and Forward restore the applied values. Reset filters clears this example's query, category, photo facet and page while preserving unrelated URL parameters.</p></section>
 </div>;
}
