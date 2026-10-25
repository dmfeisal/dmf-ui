import type { ComponentPropsWithRef, ReactNode } from 'react';
import { buttonVariants } from 'dmf-ui/button/variants';
const join = (...parts:(string|undefined|null|false)[]) => parts.filter(Boolean).join(' ');
export type ButtonProps = ComponentPropsWithRef<'button'> & Parameters<typeof buttonVariants>[0];
export function Button({variant,size,className,type='button',...props}:ButtonProps) {
 return <button {...props} type={type} data-slot="button" className={join(buttonVariants({variant,size}),className)} />;
}
export type InputProps = ComponentPropsWithRef<'input'>;
export function Input({className,...props}:InputProps) {
 return <input {...props} data-slot="input" className={join('dmf-react-input border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs focus-visible:ring-3 w-full min-w-0 outline-none disabled:opacity-50',className)} />;
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
 return <div {...props} data-slot="card" data-size={size} className={join('ring-foreground/10 bg-card text-card-foreground min-w-0 max-w-full rounded-xl text-sm shadow-xs ring-1 flex flex-col [overflow-wrap:anywhere]',size==='sm'?'gap-4 p-4':'gap-6 p-6',className)} />;
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
 const classes=join('min-h-5 min-w-0 max-w-full gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-colors inline-flex w-fit items-center justify-center whitespace-normal [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-3',badgeStyles[variant],props.as==='a'&&'min-h-[44px] min-w-[44px]',className);
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
