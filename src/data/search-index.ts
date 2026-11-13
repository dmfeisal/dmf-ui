// Search entries for the documentation dialog. Served once as /search-index.json (src/pages/search-index.json.ts)
// and fetched on first use, instead of being inlined into every page.
import {components,guides} from './documentation';
import {blocks} from './blocks';
import {examples} from './examples';

export type SearchEntry={title:string;description:string;href:string;group:string;keywords:string};

export const searchEntries:SearchEntry[]=[
 ...examples.map(example=>({title:example.title,description:example.description,href:example.href,group:'Examples',keywords:`${example.runtime} ${example.components.join(' ')} ${example.blocks.join(' ')}`})),
 {title:'Working examples',description:'Implemented compositions and adapter proofs.',href:'/examples/',group:'Examples',keywords:'discovery native forms navigation React'},
 ...blocks.map(block=>({title:block.title,description:block.description,href:`/blocks/${block.slug}/`,group:'Blocks',keywords:`${block.category} ${block.components.join(' ')}`})),
 {title:'Blocks',description:'Reusable source-owned Astro compositions.',href:'/blocks/',group:'Blocks',keywords:'authentication search filtering compositions'},
 ...components.map(item=>({title:item.name,description:item.description,href:`/components/${item.slug}/`,group:'Components',keywords:`${item.category} ${item.domains.join(' ')} ${item.slug}`})),
 ...guides.map(item=>({title:item.title,description:item.description,href:`/docs/${item.slug}/`,group:'Guides',keywords:item.sections.map(part=>part.title).join(' ')})),
 {title:'Create a preset',description:'Configure colors, typography, radius and product presets.',href:'/create/',group:'Pages',keywords:'CB UI reconstruction HUI Portfolio Yellow foundation theme export CSS JSON'},
];
