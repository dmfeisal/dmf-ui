import type { ComponentPropsWithRef, ReactNode } from 'react';
import { buttonVariants } from 'dmf-ui/button/variants';
const join = (...parts:(string|undefined|null|false)[]) => parts.filter(Boolean).join(' ');
export type ButtonProps = ComponentPropsWithRef<'button'> & Parameters<typeof buttonVariants>[0];
export function Button({variant,size,className,type='button',...props}:ButtonProps) {
 return <button {...props} type={type} data-slot="button" className={join(buttonVariants({variant,size}),className)} />;
}
export type InputProps = ComponentPropsWithRef<'input'>;
export function Input({className,...props}:InputProps) {
 return <input {...props} data-slot="input" className={join('border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs focus-visible:ring-3 w-full min-w-0 outline-none disabled:opacity-50',className)} />;
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
