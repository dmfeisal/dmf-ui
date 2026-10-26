import type {ComponentPropsWithRef,ReactNode} from 'react';
import {Text} from '../index';

export type MerchantListingBlockProps<Item> = Omit<ComponentPropsWithRef<'section'>,'id'|'title'> & {
 id:string;title:string;description?:string;headingLevel?:'h1'|'h2'|'h3';
 items:readonly Item[];getItemKey:(item:Item)=>string;renderItem:(item:Item)=>ReactNode;
 status?:'ready'|'loading'|'error';statusMessage?:string;loadingLabel?:string;
 emptyTitle?:string;emptyDescription?:string;errorTitle?:string;errorDescription?:string;
 actions?:ReactNode;pagination?:ReactNode;emptyContent?:ReactNode;errorContent?:ReactNode;loadingContent?:ReactNode;
};

export function MerchantListingBlock<Item>({id,title,description,headingLevel='h2',items,getItemKey,renderItem,status='ready',statusMessage,loadingLabel='Loading merchants…',emptyTitle='No merchants to display',emptyDescription='Try different search or filter choices.',errorTitle='Unable to display merchants',errorDescription='Please try again later.',actions,pagination,emptyContent,errorContent,loadingContent,children,className,...props}:MerchantListingBlockProps<Item>){
 if(!id?.trim()||!title?.trim())throw Error('MerchantListingBlock needs a unique id and nonempty title.');
 if(!['ready','loading','error'].includes(status)||!['h1','h2','h3'].includes(headingLevel))throw Error('MerchantListingBlock received an unsupported status or heading level.');
 const keys=status==='ready'?items.map(item=>getItemKey(item)):[];
 if(keys.some(key=>typeof key!=='string'||!key.trim())||new Set(keys).size!==keys.length)throw Error('MerchantListingBlock needs unique nonempty string item keys.');
 const messageHeading=headingLevel==='h1'?'h2':headingLevel==='h2'?'h3':'h4';
 return <section {...props} id={id} aria-labelledby={`${id}-title`} aria-describedby={description?`${id}-description`:undefined} data-slot="merchant-listing-block" data-status={status} className={['dmf-merchant-listing',className].filter(Boolean).join(' ')}>
  <header className="dmf-listing-header"><div><Text as={headingLevel} size="title" weight="semibold" id={`${id}-title`}>{title}</Text>{description&&<Text id={`${id}-description`} tone="muted">{description}</Text>}</div>{actions&&<div className="dmf-listing-actions">{actions}</div>}</header>
  <p role="status" aria-atomic="true" className="sr-only">{statusMessage??(status==='loading'?loadingLabel:'')}</p>
  <div className="dmf-listing-content" aria-busy={status==='loading'||undefined}>
   {status==='ready'&&(items.length?<ul role="list" className="dmf-listing-grid">{items.map((item,index)=><li key={keys[index]}>{renderItem(item)}</li>)}</ul>:<div className="dmf-listing-message">{emptyContent??<><Text as={messageHeading} weight="semibold">{emptyTitle}</Text><Text tone="muted">{emptyDescription}</Text></>}</div>)}
   {status==='loading'&&(loadingContent??<div aria-hidden="true" className="dmf-listing-grid">{[0,1,2].map(key=><div key={key} className="dmf-skeleton dmf-listing-skeleton" data-animate="false"/>)}</div>)}
   {status==='error'&&<div role="alert" className="dmf-listing-message">{errorContent??<><Text as={messageHeading} weight="semibold">{errorTitle}</Text><Text>{errorDescription}</Text></>}</div>}
  </div>
  {status==='ready'&&items.length>0&&pagination&&<div className="dmf-listing-pagination">{pagination}</div>}{children}
 </section>;
}
