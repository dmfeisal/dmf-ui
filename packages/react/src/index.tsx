export {OTPVerificationBlock} from './blocks/otp-verification';
export type {OTPVerificationBlockProps} from './blocks/otp-verification';
export {ResetPasswordBlock} from './blocks/reset-password';
export type {ResetPasswordBlockProps} from './blocks/reset-password';
export {SignUpBlock} from './blocks/sign-up';
export type {SignUpBlockProps} from './blocks/sign-up';
export {PasswordRecoveryBlock} from './blocks/password-recovery';
export type {PasswordRecoveryBlockProps} from './blocks/password-recovery';
import {createContext,useContext,useId} from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
export {SearchFiltersBlock} from './blocks/search-filters';
export type {SearchFiltersBlockProps} from './blocks/search-filters';
export {SignInBlock} from './blocks/sign-in';
export type {SignInBlockProps} from './blocks/sign-in';
export {HeroBlock} from './blocks/hero';
export type {HeroBlockProps} from './blocks/hero';
export {MerchantListingBlock} from './blocks/merchant-listing';
export type {MerchantListingBlockProps} from './blocks/merchant-listing';
export {MerchantCard} from './blocks/merchant-card';
export type {MerchantCardProps} from './blocks/merchant-card';
import { buttonVariants } from 'dmf-ui/button/variants';
const join = (...parts:(string|undefined|null|false)[]) => parts.filter(Boolean).join(' ');
export type ButtonProps = ComponentPropsWithRef<'button'> & Parameters<typeof buttonVariants>[0];
export function Button({variant,size,className,type='button',...props}:ButtonProps) {
 return <button {...props} type={type} data-slot="button" className={join(buttonVariants({variant,size}),className)} />;
}
export type InputProps = ComponentPropsWithRef<'input'>;
export function Input({className,...props}:InputProps) {
 return <input {...props} data-slot="input" className={join('dmf-react-input border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base shadow-xs focus-visible:ring-3 w-full min-w-0 outline-none disabled:opacity-50',className)} />;
}
type TextTag='p'|'span'|'div'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6';
export type TextProps<T extends TextTag='p'> = Omit<ComponentPropsWithRef<T>,'as'|'size'> & {as?:T;size?:'sm'|'default'|'lg'|'title';tone?:'default'|'muted';weight?:'normal'|'medium'|'semibold'};
export function Text<T extends TextTag='p'>({as,size='default',tone='default',weight='normal',className,...props}:TextProps<T>) {
 const Tag=as??'p';
 const sizes={sm:'text-sm leading-relaxed',default:'text-base leading-7',lg:'text-lg leading-relaxed',title:'text-2xl leading-tight tracking-tight font-heading'};
 const tones={default:'text-foreground',muted:'text-muted-foreground'};
 const weights={normal:'font-normal',medium:'font-medium',semibold:'font-semibold'};
 return <Tag {...props as ComponentPropsWithRef<'p'>} data-slot="text" className={join('m-0 min-w-0 max-w-full text-start [overflow-wrap:anywhere]',sizes[size],tones[tone],weights[weight],className)} />;
}
export type CardProps = ComponentPropsWithRef<'div'> & {size?:'default'|'sm'};
export function Card({size='default',className,...props}:CardProps) {
 return <div {...props} data-slot="card" data-size={size} className={join('ring-foreground/10 bg-card text-card-foreground min-w-0 max-w-full rounded-xl text-sm shadow-xs ring-1 flex flex-col [overflow-wrap:anywhere]',size==='sm'?'gap-3 p-3':'gap-4 p-4',className)} />;
}
export type SwitchProps = Omit<ComponentPropsWithRef<'input'>,'type'|'role'|'children'|'size'|'readOnly'> & {children:ReactNode};
export function Switch({children,className,...props}:SwitchProps) {
 return <label className={join('dmf-react-switch',className)}>
  <input {...props} type="checkbox" role="switch" />
  <span className="dmf-react-switch-track" aria-hidden="true"><span className="dmf-react-switch-thumb" /></span>
  <span>{children}</span>
 </label>;
}

export type BadgeVariant='default'|'secondary'|'destructive'|'outline'|'ghost'|'link';
type BadgeStyleProps={variant?:BadgeVariant};
export type BadgeProps=BadgeStyleProps & (
 | (ComponentPropsWithRef<'span'> & {as?:'span';href?:never})
 | (Omit<ComponentPropsWithRef<'a'>,'href'> & {as:'a';href:string})
);
// Matches the core badge contract; the adapter does not import Astro modules.
const badgeStyles:Record<BadgeVariant,string>={
 default:'bg-primary text-primary-foreground hover:bg-primary/95',
 secondary:'bg-secondary text-secondary-foreground hover:bg-secondary/80',
 destructive:'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-[color-mix(in_oklab,var(--destructive)_80%,var(--foreground))] dark:bg-destructive/20',
 outline:'border-border text-foreground hover:bg-muted hover:text-muted-foreground',
 ghost:'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
 link:'text-foreground underline underline-offset-4 hover:decoration-2',
};
export function Badge({variant='default',className,...props}:BadgeProps){
 const classes=join('min-h-5 min-w-0 max-w-full gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-colors inline-flex w-fit items-center justify-center whitespace-normal [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-3',badgeStyles[variant],className);
 if(props.as==='a'){const {as,...native}=props;return <a {...native} data-slot="badge" data-variant={variant} className={classes}/>;}
 const {as,...native}=props;return <span {...native} data-slot="badge" data-variant={variant} className={classes}/>;
}
export type AlertProps=ComponentPropsWithRef<'div'> & {variant?:'default'|'destructive'};
export function Alert({variant='default',role='note',className,...props}:AlertProps){
 return <div {...props} role={role} data-slot="alert" data-variant={variant} className={join('grid min-w-0 gap-0.5 rounded-lg border border-border bg-card px-4 py-3 text-start text-sm has-[>svg]:grid-cols-[auto_minmax(0,1fr)] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=size-])]:size-4 group/alert relative w-full [overflow-wrap:anywhere]',variant==='destructive'?'text-destructive *:data-[slot=alert-description]:text-destructive':'text-card-foreground',className)}/>;
}
export type AlertTitleProps=ComponentPropsWithRef<'div'>;
export function AlertTitle({className,...props}:AlertTitleProps){
 return <div {...props} data-slot="alert-title" className={join('font-medium group-has-[>svg]/alert:col-start-2 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3',className)}/>;
}
export type AlertDescriptionProps=ComponentPropsWithRef<'div'>;
export function AlertDescription({className,...props}:AlertDescriptionProps){
 return <div {...props} data-slot="alert-description" className={join('text-muted-foreground text-sm text-balance md:text-pretty [&_p:not(:last-child)]:mb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3',className)}/>;
}
export type AlertActionProps=ComponentPropsWithRef<'div'>;
export function AlertAction({className,...props}:AlertActionProps){
 return <div {...props} data-slot="alert-action" className={join('col-span-full mt-3 flex flex-wrap gap-2 items-center',className)}/>;
}

export type LabelProps=ComponentPropsWithRef<'label'>;
export function Label({className,...props}:LabelProps){
 return <label {...props} data-slot="label" className={join('flex min-w-0 items-center gap-2 text-sm leading-normal font-medium [overflow-wrap:anywhere] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',className)}/>;
}
export type TextareaProps=ComponentPropsWithRef<'textarea'>;
export function Textarea({className,...props}:TextareaProps){
 return <textarea {...props} data-slot="textarea" className={join('dmf-react-textarea border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs focus-visible:ring-3 placeholder:text-muted-foreground min-h-16 w-full min-w-0 outline-none disabled:cursor-not-allowed disabled:opacity-50',className)}/>;
}
export type CheckboxProps=Omit<ComponentPropsWithRef<'input'>,'type'|'role'|'children'|'size'|'readOnly'>;
export function Checkbox({className,...props}:CheckboxProps){
 return <input {...props} type="checkbox" data-slot="checkbox" className={join('dmf-react-checkbox peer size-4 shrink-0 disabled:cursor-not-allowed disabled:opacity-50',className)}/>;
}
export type SeparatorProps=Omit<ComponentPropsWithRef<'div'>,'role'|'aria-orientation'|'tabIndex'|'children'> & {orientation?:'horizontal'|'vertical';decorative?:boolean};
export function Separator({orientation='horizontal',decorative=true,className,...props}:SeparatorProps){
 return <div {...props} data-slot="separator" data-orientation={orientation} role={decorative?'none':'separator'} aria-orientation={decorative?undefined:orientation} className={join('bg-border shrink-0',orientation==='horizontal'?'h-px w-full':'w-px self-stretch',className)}/>;
}

export type CardHeaderProps=ComponentPropsWithRef<'div'>;
export function CardHeader({className,...props}:CardHeaderProps){
 return <div {...props} data-slot="card-header" className={join('grid min-w-0 gap-1 items-start has-[[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto]',className)}/>;
}
type HeadingTag='div'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6';
export type CardTitleProps<T extends HeadingTag='div'>=Omit<ComponentPropsWithRef<T>,'as'> & {as?:T};
export function CardTitle<T extends HeadingTag='div'>({as,className,...props}:CardTitleProps<T>){
 const Tag=as??'div';return <Tag {...props as ComponentPropsWithRef<'div'>} data-slot="card-title" className={join('m-0 min-w-0 font-heading text-base leading-normal font-medium [overflow-wrap:anywhere]',className)}/>;
}
export type CardDescriptionProps=ComponentPropsWithRef<'div'>;
export function CardDescription({className,...props}:CardDescriptionProps){return <div {...props} data-slot="card-description" className={join('min-w-0 text-muted-foreground text-sm [overflow-wrap:anywhere]',className)}/>;}
export type CardActionProps=ComponentPropsWithRef<'div'>;
export function CardAction({className,...props}:CardActionProps){return <div {...props} data-slot="card-action" className={join('col-start-2 row-span-2 row-start-1 self-start justify-self-end min-w-0 max-w-full',className)}/>;}
export type CardContentProps=ComponentPropsWithRef<'div'>;
export function CardContent({className,...props}:CardContentProps){return <div {...props} data-slot="card-content" className={join('min-w-0 flex flex-col gap-3',className)}/>;}
export type CardFooterProps=ComponentPropsWithRef<'div'>;
export function CardFooter({className,...props}:CardFooterProps){return <div {...props} data-slot="card-footer" className={join('flex min-w-0 flex-wrap items-center gap-3',className)}/>;}

export type FieldProps=ComponentPropsWithRef<'div'> & {orientation?:'vertical'|'horizontal'|'responsive'};
export function Field({orientation='vertical',role='group',className,...props}:FieldProps){
 const layout={vertical:'flex-col',horizontal:'flex-row items-start',responsive:'flex-col @md/field-group:flex-row @md/field-group:items-start'};
 return <div {...props} role={role} data-slot="field" data-orientation={orientation} className={join('group/field flex min-w-0 w-full gap-3 data-[invalid=true]:text-destructive',layout[orientation],className)}/>;
}
export type FieldGroupProps=ComponentPropsWithRef<'div'>;
export function FieldGroup({className,...props}:FieldGroupProps){return <div {...props} data-slot="field-group" className={join('@container/field-group flex min-w-0 w-full flex-col gap-7',className)}/>;}
export type FieldContentProps=ComponentPropsWithRef<'div'>;
export function FieldContent({className,...props}:FieldContentProps){return <div {...props} data-slot="field-content" className={join('flex min-w-0 flex-1 flex-col gap-1 leading-snug',className)}/>;}
export type FieldLabelProps=LabelProps;
export function FieldLabel({className,...props}:FieldLabelProps){return <label {...props} data-slot="field-label" className={join('flex min-w-0 items-center gap-2 text-sm font-medium leading-snug [overflow-wrap:anywhere] group-data-[disabled=true]/field:opacity-50',className)}/>;}
export type FieldTitleProps=ComponentPropsWithRef<'div'>;
export function FieldTitle({className,...props}:FieldTitleProps){return <div {...props} data-slot="field-title" className={join('min-w-0 text-sm font-medium [overflow-wrap:anywhere]',className)}/>;}
export type FieldDescriptionProps=ComponentPropsWithRef<'p'>;
export function FieldDescription({className,...props}:FieldDescriptionProps){return <p {...props} data-slot="field-description" className={join('m-0 min-w-0 text-muted-foreground text-start text-sm leading-normal [overflow-wrap:anywhere] [&_a]:underline [&_a]:underline-offset-4',className)}/>;}
export type FieldErrorProps=ComponentPropsWithRef<'div'> & {errors?:Array<{message?:string}|undefined>};
export function FieldError({errors,children,role='alert',className,...props}:FieldErrorProps){
 const messages=[...new Set((errors??[]).map(error=>error?.message?.trim()).filter((message):message is string=>Boolean(message)))];
 const authored=children!==undefined&&children!==null&&children!==false&&children!=='';
 if(!authored&&!messages.length)return null;
 return <div {...props} role={role} data-slot="field-error" className={join('min-w-0 text-destructive text-sm font-normal [overflow-wrap:anywhere]',className)}>{authored?children:messages.length===1?messages[0]:<ul className="m-0 list-disc ps-4">{messages.map(message=><li key={message}>{message}</li>)}</ul>}</div>;
}
export type FieldSetProps=ComponentPropsWithRef<'fieldset'>;
export function FieldSet({className,...props}:FieldSetProps){return <fieldset {...props} data-slot="field-set" className={join('flex min-w-0 flex-col gap-6',className)}/>;}
export type FieldLegendProps=ComponentPropsWithRef<'legend'> & {variant?:'legend'|'label'};
export function FieldLegend({variant='legend',className,...props}:FieldLegendProps){return <legend {...props} data-slot="field-legend" data-variant={variant} className={join('mb-3 font-medium',variant==='label'?'text-sm':'text-base',className)}/>;}
export type FieldSeparatorProps=ComponentPropsWithRef<'div'>;
export function FieldSeparator({children,className,...props}:FieldSeparatorProps){return <div {...props} data-slot="field-separator" className={join('flex min-w-0 items-center gap-3 text-sm',className)}><Separator className="flex-1 w-auto"/>{children!=null&&children!==false&&children!==''&&<><span className="text-muted-foreground min-w-0 [overflow-wrap:anywhere]">{children}</span><Separator className="flex-1 w-auto"/></>}</div>;}


type RadioState={value:string;defaultValue?:never;onValueChange:(value:string)=>void}|{value?:undefined;defaultValue?:string;onValueChange?:(value:string)=>void};
export type RadioGroupProps=Omit<ComponentPropsWithRef<'fieldset'>,'name'|'defaultValue'|'value'|'role'> & RadioState & {name?:string;required?:boolean;orientation?:'vertical'|'horizontal'};
type RadioContextValue={name:string;value?:string;defaultValue?:string;required:boolean;disabled:boolean;onValueChange?:(value:string)=>void};
const RadioContext=createContext<RadioContextValue|null>(null);
export function RadioGroup({name,value,defaultValue,onValueChange,required=false,disabled=false,orientation='vertical',className,children,...props}:RadioGroupProps){
 const id=useId();
 return <RadioContext.Provider value={{name:name??`dmf-radio-${id}`,value,defaultValue,required,disabled,onValueChange}}><fieldset {...props} disabled={disabled} role="radiogroup" data-slot="radio-group" data-orientation={orientation} className={join('flex min-w-0 gap-3',orientation==='horizontal'?'flex-row flex-wrap':'flex-col',className)}>{children}</fieldset></RadioContext.Provider>;
}
export type RadioGroupItemProps=Omit<ComponentPropsWithRef<'input'>,'name'|'type'|'role'|'checked'|'defaultChecked'|'required'|'readOnly'|'children'|'size'|'value'> & {value:string};
export function RadioGroupItem({value,disabled=false,onChange,className,...props}:RadioGroupItemProps){
 const group=useContext(RadioContext);
 if(!group)throw new Error('RadioGroupItem must be rendered inside RadioGroup.');
 const selection=group.value===undefined?{defaultChecked:group.defaultValue===value}:{checked:group.value===value};
 return <input {...props} {...selection} value={value} type="radio" name={group.name} required={group.required} disabled={group.disabled||disabled} onChange={event=>{onChange?.(event);if(!event.defaultPrevented&&event.currentTarget.checked)group.onValueChange?.(value);}} data-slot="radio-group-item" className={join('dmf-react-radio size-4 shrink-0 disabled:cursor-not-allowed disabled:opacity-50',className)}/>;
}
export type SelectProps=ComponentPropsWithRef<'select'>;
export function Select({className,...props}:SelectProps){return <select {...props} data-slot="select" className={join('dmf-react-select min-h-9 min-w-0 w-full rounded-md border bg-background px-2.5 py-2 text-base text-foreground disabled:cursor-not-allowed disabled:opacity-50',className)}/>;}
export type SelectOptionProps=ComponentPropsWithRef<'option'>;
export function SelectOption(props:SelectOptionProps){return <option {...props} data-slot="select-option"/>;}
export type SelectGroupProps=Omit<ComponentPropsWithRef<'optgroup'>,'label'> & {label:string};
export function SelectGroup(props:SelectGroupProps){return <optgroup {...props} data-slot="select-group"/>;}
