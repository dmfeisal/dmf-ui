import type {ComponentPropsWithRef,ReactNode} from 'react';
import {Text} from '../index';

export type HeroBlockProps=Omit<ComponentPropsWithRef<'section'>,'id'|'title'> & {
 id:string;title:string;headingLevel?:'h1'|'h2';eyebrow?:string;description?:string;
 layout?:'centered'|'split';mediaPosition?:'start'|'end';actions?:ReactNode;media?:ReactNode;
};

export function HeroBlock({id,title,headingLevel='h1',eyebrow,description,layout='centered',mediaPosition='end',actions,media,children,className,...props}:HeroBlockProps){
 if(!id?.trim()||!title?.trim())throw Error('HeroBlock needs a unique id and nonempty title.');
 if(!['centered','split'].includes(layout)||!['start','end'].includes(mediaPosition)||!['h1','h2'].includes(headingLevel))throw Error('HeroBlock received an unsupported layout, media position or heading level.');
 const hasMedia=media!==undefined&&media!==null&&media!==false;
 return <section {...props} id={id} aria-labelledby={`${id}-title`} aria-describedby={description?`${id}-description`:undefined} data-slot="hero-block" data-layout={layout} data-has-media={hasMedia?'true':undefined} className={['dmf-hero-block',className].filter(Boolean).join(' ')}>
  <div className="dmf-hero-inner">
   {hasMedia&&mediaPosition==='start'&&<div className="dmf-hero-media">{media}</div>}
   <div className="dmf-hero-copy">
    {eyebrow&&<Text size="sm" weight="medium">{eyebrow}</Text>}
    <Text as={headingLevel} id={`${id}-title`} size="title" weight="semibold" className="dmf-hero-title">{title}</Text>
    {description&&<Text id={`${id}-description`} tone="muted" className="dmf-hero-description">{description}</Text>}
    {actions&&<div className="dmf-hero-actions">{actions}</div>}{children}
   </div>
   {hasMedia&&mediaPosition==='end'&&<div className="dmf-hero-media">{media}</div>}
  </div>
 </section>;
}
