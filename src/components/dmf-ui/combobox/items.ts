// Combobox parts mode builds its no-JavaScript <select> from the items it renders. Astro gives a parent its children
// only as HTML, so the items are read back from their own markup: data-value, data-label and aria-disabled.
export type ComboboxOption={value:string;label:string;disabled:boolean};

const entities:Record<string,string>={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'",'#x27':"'"};
export const decode=(text:string)=>text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi,(match,name:string)=>{
 if(entities[name.toLowerCase()])return entities[name.toLowerCase()];
 if(name.startsWith('#'))return String.fromCodePoint(name[1]==='x'||name[1]==='X'?parseInt(name.slice(2),16):parseInt(name.slice(1),10));
 return match;
});
// The visible text of rendered markup, for an item's label.
export const textOf=(html:string)=>decode(html.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();

export function readOptions(html:string):ComboboxOption[]{
 const options:ComboboxOption[]=[];
 for(const [tag] of html.matchAll(/<[a-z]+\b[^>]*\bdata-slot="combobox-item"[^>]*>/g)){
  const attr=(name:string)=>{const m=tag.match(new RegExp(`\\s${name}="([^"]*)"`));return m?decode(m[1]):undefined;};
  const value=attr('data-value')??'';
  if(!value)continue;// The clear-selection item maps to the select's empty option.
  options.push({value,label:attr('data-label')??value,disabled:attr('aria-disabled')==='true'});
 }
 return options;
}
