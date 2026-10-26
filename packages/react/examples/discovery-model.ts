export type DiscoverySelection={q:string;category:string;photos:boolean;page:number};
export const discoveryOptions=[{value:'grill',label:'Grill'},{value:'cafe',label:'Café'},{value:'bakery',label:'Bakery'}];
export const sampleMerchants=[
 {id:'sample-grill-a',name:'Sample grill A',category:'grill',cuisines:'Illustrative grill',photo:true},
 {id:'sample-cafe-a',name:'Sample café A',category:'cafe',cuisines:'Illustrative café',photo:true},
 {id:'sample-bakery-a',name:'Sample bakery A',category:'bakery',cuisines:'Illustrative bakery',photo:false},
 {id:'sample-grill-b',name:'Sample grill B',category:'grill',cuisines:'Illustrative grill',photo:true},
 {id:'sample-cafe-b',name:'Sample café B',category:'cafe',cuisines:'Illustrative café',photo:false},
 {id:'sample-bakery-b',name:'Sample bakery B',category:'bakery',cuisines:'Illustrative bakery',photo:true},
] as const;
export const emptySelection:DiscoverySelection={q:'',category:'',photos:false,page:1};
export function readDiscoverySelection(params:URLSearchParams):DiscoverySelection{
 const page=Number(params.get('page')),category=params.get('category')??'';
 return {q:(params.get('q')??'').trim(),category:discoveryOptions.some(o=>o.value===category)?category:'',photos:params.get('photos')==='yes',page:Number.isSafeInteger(page)&&page>0?page:1};
}
export function discoveryResults(selection:DiscoverySelection){
 const query=selection.q.toLocaleLowerCase('en');
 const matches=sampleMerchants.filter(item=>(!query||`${item.name} ${item.cuisines}`.toLocaleLowerCase('en').includes(query))&&(!selection.category||item.category===selection.category)&&(!selection.photos||item.photo));
 const pages=Math.max(1,Math.ceil(matches.length/3)),page=Math.min(selection.page,pages);
 return {items:matches.slice((page-1)*3,page*3),total:matches.length,pages,page};
}
export function discoveryURL(base:string,selection:DiscoverySelection){
 const url=new URL(base,'https://example.invalid');
 for(const key of ['q','category','photos','page'])url.searchParams.delete(key);
 if(selection.q)url.searchParams.set('q',selection.q);
 if(selection.category)url.searchParams.set('category',selection.category);
 if(selection.photos)url.searchParams.set('photos','yes');
 if(selection.page>1)url.searchParams.set('page',String(selection.page));
 url.hash='';return url.pathname+url.search;
}
