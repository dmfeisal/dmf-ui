import {createContext,useCallback,useContext,useEffect,useId,useRef,useState} from 'react';
import type {ComponentPropsWithRef,ReactNode,RefObject} from 'react';

const join = (...parts:(string|undefined|null|false)[]) => parts.filter(Boolean).join(' ');

type SelectContextValue = {
 value:string|undefined;
 choose:(value:string)=>void;
 open:boolean;
 setOpen:(open:boolean)=>void;
 disabled:boolean;
 required:boolean;
 labels:Record<string,ReactNode>;
 register:(value:string,label:ReactNode)=>()=>void;
 rootRef:RefObject<HTMLDivElement|null>;
 triggerRef:RefObject<HTMLButtonElement|null>;
 listRef:RefObject<HTMLDivElement|null>;
 listId:string;
 triggerId:string|undefined;
 setTriggerId:(id:string|undefined)=>void;
};

const SelectContext = createContext<SelectContextValue|null>(null);

function useSelect(){
 const context = useContext(SelectContext);
 if(!context) throw new Error('Select parts must be rendered inside Select.');
 return context;
}

function enabledOptions(list:HTMLElement|null){
 return Array.from(list?.querySelectorAll<HTMLElement>('[role=option]:not([aria-disabled=true])') ?? []);
}

export type SelectProps = {
 value?:string;
 defaultValue?:string;
 onValueChange?:(value:string)=>void;
 name?:string;
 disabled?:boolean;
 required?:boolean;
 children?:ReactNode;
 className?:string;
};

/**
 * Custom listbox. Submits its value through a hidden input (so GET and POST forms receive it),
 * resets with its enclosing form, and moves focus between options with the keyboard.
 */
export function Select({value,defaultValue,onValueChange,name,disabled=false,required=false,children,className}:SelectProps){
 const listId = useId();
 const controlled = value !== undefined;
 const [internal,setInternal] = useState<string|undefined>(defaultValue);
 const current = controlled ? value : internal;
 const [open,setOpen] = useState(false);
 const [labels,setLabels] = useState<Record<string,ReactNode>>({});
 const [triggerId,setTriggerId] = useState<string|undefined>(undefined);
 const rootRef = useRef<HTMLDivElement>(null);
 const triggerRef = useRef<HTMLButtonElement>(null);
 const listRef = useRef<HTMLDivElement>(null);

 const choose = useCallback((next:string)=>{
  if(!controlled) setInternal(next);
  onValueChange?.(next);
 },[controlled,onValueChange]);

 const register = useCallback((itemValue:string,label:ReactNode)=>{
  setLabels(previous=>({...previous,[itemValue]:label}));
  return ()=>setLabels(previous=>{const next={...previous};delete next[itemValue];return next;});
 },[]);

 // A form reset returns an uncontrolled select to its default, as a native select does.
 useEffect(()=>{
  if(controlled) return;
  const form = rootRef.current?.closest('form');
  if(!form) return;
  const onReset = ()=>setInternal(defaultValue);
  form.addEventListener('reset',onReset);
  return ()=>form.removeEventListener('reset',onReset);
 },[controlled,defaultValue]);

 // Pointer presses outside the control close the listbox.
 useEffect(()=>{
  if(!open) return;
  const onPointerDown = (event:PointerEvent)=>{
   if(!rootRef.current?.contains(event.target as Node)) setOpen(false);
  };
  document.addEventListener('pointerdown',onPointerDown);
  return ()=>document.removeEventListener('pointerdown',onPointerDown);
 },[open]);

 return <SelectContext.Provider value={{value:current,choose,open,setOpen,disabled,required,labels,register,rootRef,triggerRef,listRef,listId,triggerId,setTriggerId}}>
  <div ref={rootRef} data-slot="select" className={join('dmf-react-select-root',className)}>
   {children}
   {/* A text input (not hidden) so native required validation applies; focus moves to the visible trigger. */}
   <input type="text" name={name} value={current ?? ''} onChange={()=>undefined} required={required || undefined} disabled={disabled || undefined} tabIndex={-1} aria-hidden="true" data-slot="select-input" onFocus={()=>triggerRef.current?.focus()} style={{position:'absolute',width:1,height:1,opacity:0,pointerEvents:'none'}} />
  </div>
 </SelectContext.Provider>;
}

export type SelectTriggerProps = Omit<ComponentPropsWithRef<'button'>,'type'|'role'> & {size?:'default'|'sm'};
export function SelectTrigger({className,size='default',disabled,onClick,onKeyDown,children,id,ref,...props}:SelectTriggerProps){
 const select = useSelect();
 const setRef = (node:HTMLButtonElement|null)=>{select.triggerRef.current=node;if(typeof ref=='function')ref(node);else if(ref)(ref as {current:HTMLButtonElement|null}).current=node;};
 useEffect(()=>{select.setTriggerId(id);return ()=>select.setTriggerId(undefined);},[id,select.setTriggerId]);
 const isDisabled = select.disabled || disabled;
 return <button {...props} id={id} ref={setRef} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={select.open} aria-controls={select.open ? select.listId : undefined} aria-required={select.required || undefined} disabled={isDisabled} data-slot="select-trigger" data-size={size} data-state={select.open ? 'open' : 'closed'}
  className={join('dmf-react-select dmf-react-select-trigger min-h-9 min-w-0 w-full rounded-md border bg-background px-2.5 py-2 text-left text-base text-foreground disabled:cursor-not-allowed disabled:opacity-50',size==='sm'&&'min-h-7 text-sm',className)}
  onClick={event=>{onClick?.(event);if(!event.defaultPrevented&&!isDisabled)select.setOpen(!select.open);}}
  onKeyDown={event=>{
   onKeyDown?.(event);
   if(event.defaultPrevented||isDisabled) return;
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();select.setOpen(true);}
   if(event.key==='Escape'&&select.open){event.preventDefault();select.setOpen(false);}
  }}>
  {children}
 </button>;
}

export function SelectValue({placeholder}:{placeholder?:ReactNode}){
 const select = useSelect();
 const hasValue = select.value !== undefined && select.value !== '' ? select.labels[select.value] !== undefined : false;
 return <span data-slot="select-value" data-placeholder={hasValue ? undefined : ''}>{hasValue ? select.labels[select.value as string] : placeholder}</span>;
}

export type SelectContentProps = ComponentPropsWithRef<'div'>;
export function SelectContent({className,children,onKeyDown,...props}:SelectContentProps){
 const select = useSelect();
 // Focus the selected option (or the first enabled one) when the listbox opens.
 useEffect(()=>{
  if(!select.open) return;
  const list = select.listRef.current;
  const selected = list?.querySelector<HTMLElement>('[role=option][aria-selected=true]:not([aria-disabled=true])');
  (selected ?? enabledOptions(list)[0] ?? list)?.focus();
 },[select.open]);
 // Items stay mounted while closed so their labels stay registered for SelectValue.
 return <div {...props} data-slot="select-content" hidden={!select.open} className={join('absolute left-0 right-0 top-full z-50 mt-1',className)}>
  <div ref={select.listRef} id={select.listId} role="listbox" tabIndex={-1} aria-labelledby={select.triggerId} data-slot="select-listbox"
   className="max-h-72 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none"
   onKeyDown={event=>{
    onKeyDown?.(event);
    if(event.defaultPrevented) return;
    const list = select.listRef.current;
    const options = enabledOptions(list);
    const index = options.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next:number)=>{options[Math.max(0,Math.min(options.length-1,next))]?.focus();};
    if(event.key==='ArrowDown'){event.preventDefault();focusAt(index<0?0:index+1);}
    else if(event.key==='ArrowUp'){event.preventDefault();focusAt(index<0?options.length-1:index-1);}
    else if(event.key==='Home'){event.preventDefault();focusAt(0);}
    else if(event.key==='End'){event.preventDefault();focusAt(options.length-1);}
    else if(event.key==='Escape'){event.preventDefault();select.setOpen(false);select.triggerRef.current?.focus();}
    else if(event.key==='Tab'){select.setOpen(false);}
    else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
     // Type-ahead: move to the next enabled option whose text starts with the typed character.
     const typed = event.key.toLowerCase();
     const ordered = [...options.slice(index+1),...options.slice(0,index+1)];
     ordered.find(option=>option.textContent?.trim().toLowerCase().startsWith(typed))?.focus();
    }
   }}>
   {children}
  </div>
 </div>;
}

export type SelectItemProps = Omit<ComponentPropsWithRef<'div'>,'value'> & {value:string;disabled?:boolean};
export function SelectItem({value,disabled=false,className,children,onClick,onKeyDown,...props}:SelectItemProps){
 const select = useSelect();
 useEffect(()=>select.register(value,children),[select.register,value,children]);
 const selected = select.value === value;
 const pick = ()=>{select.choose(value);select.setOpen(false);select.triggerRef.current?.focus();};
 return <div {...props} role="option" tabIndex={-1} aria-selected={selected} aria-disabled={disabled || undefined} data-slot="select-item" data-value={value} data-state={selected ? 'checked' : 'unchecked'} data-disabled={disabled || undefined}
  className={join('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50',className)}
  onClick={event=>{onClick?.(event);if(!event.defaultPrevented&&!disabled)pick();}}
  onKeyDown={event=>{
   onKeyDown?.(event);
   if(event.defaultPrevented||disabled) return;
   if(event.key==='Enter'||event.key===' '){event.preventDefault();pick();}
  }}>
  {children}
  {selected && <span aria-hidden="true" className="absolute right-2 text-sm">✓</span>}
 </div>;
}

export type SelectGroupProps = ComponentPropsWithRef<'div'>;
export function SelectGroup({className,...props}:SelectGroupProps){
 return <div {...props} role="group" data-slot="select-group" className={join('flex flex-col',className)} />;
}

export type SelectLabelProps = ComponentPropsWithRef<'div'>;
export function SelectLabel({className,...props}:SelectLabelProps){
 return <div {...props} data-slot="select-label" className={join('px-2 py-1.5 text-xs text-muted-foreground',className)} />;
}

export type SelectSeparatorProps = ComponentPropsWithRef<'div'>;
export function SelectSeparator({className,...props}:SelectSeparatorProps){
 return <div {...props} role="separator" data-slot="select-separator" className={join('-mx-1 my-1 h-px bg-border',className)} />;
}
