import catalog from '../../contracts/catalog.json';
type RuntimeSupport={status:string;entry:string|null;exportName?:string|null};
type Support={astro:RuntimeSupport;react:RuntimeSupport;platform:string;verification:string};
type ComponentRecord={slug:string;name:string;category:string;domains:string[];dependencies:string[];support:Support;gaps:string[]};
type BlockRecord={slug:string;title:string;category:string;components:string[];limitations:string;support:Support};
const componentRecords:ComponentRecord[]=catalog.components,blockRecords:BlockRecord[]=catalog.blocks;
export const supportCounts={astroComponents:componentRecords.length,astroBlocks:blockRecords.length,reactComponents:componentRecords.filter(c=>c.support.react.status==='experimental').length,reactBlocks:blockRecords.filter(b=>b.support.react.status==='experimental').length,reactExports:catalog.react.exports.length};
export function implementationSupport(slug:string,kind:'component'|'block'='component'){
 if(kind==='component'){const record=componentRecords.find(c=>c.slug===slug);if(!record)throw Error(`Missing component support: ${slug}`);return {name:record.name,category:record.category,domains:record.domains,dependencies:record.dependencies,limitations:record.gaps.join(' '),...record.support};}
 const record=blockRecords.find(b=>b.slug===slug);if(!record)throw Error(`Missing Block support: ${slug}`);return {name:record.title,category:record.category,domains:[],dependencies:record.components,limitations:record.limitations,...record.support};
}
