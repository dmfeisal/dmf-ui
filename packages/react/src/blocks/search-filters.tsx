import type {ComponentPropsWithRef,ReactNode} from 'react';
import {Field,FieldLabel,Input,Select,SelectOption,Checkbox,Button,Alert,AlertDescription} from '../index';

export type SearchFiltersBlockProps=Omit<ComponentPropsWithRef<'form'>,'id'|'action'|'method'|'title'> & {
 id:string;action:string;title?:string;headingLevel?:'h1'|'h2'|'h3';
 query?:string;queryName?:string;queryLabel?:string;queryRequired?:boolean;
 options:readonly {value:string;label:string;disabled?:boolean}[];selectedValue?:string;choiceName?:string;choiceLabel?:string;allLabel?:string;
 filters?:readonly {name:string;label:string;value?:string;checked?:boolean;disabled?:boolean}[];
 submitLabel?:string;resetLabel?:string;pendingLabel?:string;pending?:boolean;disabled?:boolean;submitDisabled?:boolean;error?:string;
 fields?:ReactNode;
};

/** Initial values and native reset are uncontrolled; URL and result state belong to the host. */
export function SearchFiltersBlock({id,action,title='Search and filter',headingLevel:Heading='h2',query='',queryName='q',queryLabel='Search',queryRequired=false,options,selectedValue='',choiceName='category',choiceLabel='Category',allLabel='All categories',filters=[],submitLabel='Apply filters',resetLabel='Reset filters',pendingLabel='Updating results…',pending=false,disabled=false,submitDisabled=false,error,fields,children,className,...props}:SearchFiltersBlockProps){
 if(!id?.trim()||!action?.trim()||!queryName.trim()||!choiceName.trim()||queryName===choiceName)throw Error('SearchFiltersBlock needs an id, host action and distinct field names.');
 if(!['h1','h2','h3'].includes(Heading)||new Set(options.map(o=>o.value)).size!==options.length||options.some(o=>!o.value||!o.label.trim())||(selectedValue&&!options.some(o=>o.value===selectedValue&&!o.disabled)))throw Error('SearchFiltersBlock options need unique nonempty values/labels and an enabled initial choice.');
 if(filters.some(f=>!f.name.trim()||!f.label.trim()||[queryName,choiceName].includes(f.name)))throw Error('Filter names must not collide with query or choice fields.');
 return <form {...props} id={id} action={action} method="get" aria-labelledby={`${id}-title`} aria-busy={pending||undefined} data-slot="search-filters-block" className={['dmf-block dmf-search-filters-block',className].filter(Boolean).join(' ')}>
  <Heading id={`${id}-title`}>{title}</Heading>
  {error&&<Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
  <fieldset disabled={disabled||pending} className="dmf-block-fields"><legend className="sr-only">{title}</legend>
   <div className="dmf-block-filter-grid"><Field><FieldLabel htmlFor={`${id}-query`}>{queryLabel}</FieldLabel><Input type="search" id={`${id}-query`} name={queryName} defaultValue={query} required={queryRequired}/></Field><Field><FieldLabel htmlFor={`${id}-choice`}>{choiceLabel}</FieldLabel><Select id={`${id}-choice`} name={choiceName} defaultValue={selectedValue}><SelectOption value="">{allLabel}</SelectOption>{options.map(option=><SelectOption key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectOption>)}</Select></Field></div>
   {filters.length>0&&<div className="dmf-block-filter-options">{filters.map((filter,index)=><label key={`${filter.name}-${index}`} htmlFor={`${id}-filter-${index}`}><Checkbox id={`${id}-filter-${index}`} name={filter.name} value={filter.value??'on'} defaultChecked={filter.checked} disabled={filter.disabled}/><span>{filter.label}</span></label>)}</div>}
   {fields}<div className="dmf-block-actions"><Button type="submit" disabled={submitDisabled} data-block-submit>{submitLabel}</Button><Button type="reset" variant="outline">{resetLabel}</Button></div>
  </fieldset><p role="status" className="sr-only">{pending?pendingLabel:''}</p>{children}
 </form>;
}
