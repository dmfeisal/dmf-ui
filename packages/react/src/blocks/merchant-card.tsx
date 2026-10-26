import type {ComponentPropsWithRef} from 'react';
import {Card,Text} from '../index';

export type MerchantCardProps=Omit<ComponentPropsWithRef<'article'>,'id'|'children'> & {
 id:string;name:string;href:string;headingLevel?:'h2'|'h3'|'h4';
 photos:readonly {src:string;alt:string}[];icons:{verified:string;hours:string;distance:string;star:string};
 verified?:boolean;verifiedLabel?:string;statusText?:string;statusTone?:'neutral'|'open'|'closed';distanceText?:string;
 priceLevel?:1|2|3|4|5;priceLabel?:string;cuisines?:string;address?:string;
 rating?:number;reviewCount?:number;ratingLabel?:string;reviewsLabel?:string;locale?:string;photoFallback?:string;
};

export function MerchantCard({id,name,href,headingLevel='h3',photos,icons,verified=false,verifiedLabel='Verified merchant',statusText,statusTone='neutral',distanceText,priceLevel,priceLabel,cuisines,address,rating,reviewCount,ratingLabel='Rating',reviewsLabel='reviews',locale='en',photoFallback='No photos supplied',className,...props}:MerchantCardProps){
 if(!id?.trim()||!name?.trim()||!href?.trim())throw Error('MerchantCard needs a unique id, name and destination.');
 if(photos.length>3||photos.some(p=>!p.src.trim())||[icons?.verified,icons?.hours,icons?.distance,icons?.star].some(src=>!src?.trim()))throw Error('MerchantCard supports up to three authored photos and nonempty icon sources.');
 if(!['h2','h3','h4'].includes(headingLevel)||!['neutral','open','closed'].includes(statusTone)||(priceLevel!==undefined&&(!Number.isInteger(priceLevel)||priceLevel<1||priceLevel>5))||(rating!==undefined&&(!Number.isFinite(rating)||rating<0||rating>5))||(reviewCount!==undefined&&(!Number.isInteger(reviewCount)||reviewCount<0||rating===undefined)))throw Error('MerchantCard received invalid heading, status, price or rating data.');
 const score=rating===undefined?'':new Intl.NumberFormat('en',{maximumFractionDigits:1}).format(rating),reviews=reviewCount===undefined?'':new Intl.NumberFormat(locale).format(reviewCount);
 return <article {...props} id={id} data-slot="merchant-card" className={['dmf-merchant-card',className].filter(Boolean).join(' ')} aria-labelledby={`${id}-name`}>
  <Card><div className="dmf-merchant-photos" data-photo-count={photos.length}>{photos.length?photos.map((photo,index)=><div key={index} className="dmf-merchant-photo"><img src={photo.src} alt={photo.alt} loading="lazy" decoding="async"/></div>):<p className="dmf-merchant-photo-fallback">{photoFallback}</p>}</div>
   <div className="dmf-merchant-footer"><div className="dmf-merchant-title-row"><Text as={headingLevel} id={`${id}-name`} weight="semibold" className="dmf-merchant-name"><a href={href}>{name}</a></Text>{verified&&<img className="dmf-merchant-icon" src={icons.verified} alt={verifiedLabel}/>}</div>
    <div className="dmf-merchant-details"><div className="dmf-merchant-meta">
     {(statusText||distanceText)&&<div className="dmf-merchant-facts">{statusText&&<span data-status-tone={statusTone}><img src={icons.hours} alt=""/>{statusText}</span>}{distanceText&&<span className="dmf-merchant-distance"><img src={icons.distance} alt=""/>{distanceText}</span>}</div>}
     {(priceLevel!==undefined||cuisines)&&<div className="dmf-merchant-category">{priceLevel!==undefined&&<span className="dmf-merchant-price" role="img" aria-label={priceLabel??`Price level ${priceLevel} of 5`}><span aria-hidden="true">{[1,2,3,4,5].map(n=><span key={n} data-active={n<=priceLevel?'true':undefined}>$</span>)}</span></span>}{cuisines&&<span>{cuisines}</span>}</div>}
     {address&&<p className="dmf-merchant-address" title={address}>{address}</p>}
    </div>{rating!==undefined&&<div className="dmf-merchant-rating" role="img" aria-label={`${ratingLabel}: ${score} / 5${reviewCount===undefined?'':`; ${reviews} ${reviewsLabel}`}`}><div className="dmf-merchant-score" aria-hidden="true"><img src={icons.star} alt=""/><span>{score}</span></div>{reviewCount!==undefined&&<div className="dmf-merchant-reviews" aria-hidden="true">{reviews}</div>}</div>}</div>
   </div>
  </Card>
 </article>;
}
