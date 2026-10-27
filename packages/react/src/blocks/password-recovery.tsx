import type {ComponentPropsWithRef,ReactNode} from 'react';
import {Card,CardHeader,CardContent,CardFooter,Field,FieldLabel,FieldError,Input,Button,Alert,AlertTitle,AlertDescription} from '../index';
export type PasswordRecoveryBlockProps=Omit<ComponentPropsWithRef<'form'>,'id'|'action'|'method'|'title'> & {
 id:string;action:string;title?:string;description?:string;headingLevel?:'h1'|'h2'|'h3';
 email?:string;emailName?:string;emailLabel?:string;submitLabel?:string;pendingLabel?:string;
 pending?:boolean;disabled?:boolean;submitDisabled?:boolean;complete?:boolean;completionMessage?:string;
 error?:string;errorTitle?:string;fieldErrors?:{email?:string};signinHref?:string;signinLabel?:string;
 fields?:ReactNode;footer?:ReactNode;
};
export function PasswordRecoveryBlock({id,action,title='Request password recovery',description='Enter your email to request recovery instructions.',headingLevel:Heading='h2',email='',emailName='email',emailLabel='Email',submitLabel='Request recovery',pendingLabel='Requesting recovery…',pending=false,disabled=false,submitDisabled=false,complete=false,completionMessage='If recovery is available for this address, follow the instructions provided by your account service.',error,errorTitle='Unable to complete the request',fieldErrors={},signinHref,signinLabel='Return to sign in',fields,footer,children,className,...props}:PasswordRecoveryBlockProps){
 if(!id?.trim()||!action?.trim()||!emailName.trim())throw Error('PasswordRecoveryBlock needs an id, host action and email field name.');
 return <form {...props} id={id} action={action} method="post" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} aria-busy={pending||undefined} data-slot="password-recovery-block" className={['dmf-block dmf-auth-block',className].filter(Boolean).join(' ')}>
 <Card><CardHeader><Heading id={`${id}-title`}>{title}</Heading><p id={`${id}-description`}>{description}</p></CardHeader><CardContent>
 {error&&<Alert variant="destructive" role="alert"><AlertTitle>{errorTitle}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
 <p id={`${id}-completion`} role="status" aria-atomic="true" tabIndex={complete?-1:undefined} data-recovery-completion>{complete?completionMessage:''}</p>
 {!complete&&<fieldset disabled={disabled||pending} className="dmf-block-fields"><legend className="sr-only">{title}</legend>
 <Field data-invalid={fieldErrors.email?'true':undefined}><FieldLabel htmlFor={`${id}-email`}>{emailLabel}</FieldLabel><Input id={`${id}-email`} name={emailName} type="email" autoComplete="email" defaultValue={email} required aria-invalid={fieldErrors.email?'true':undefined} aria-describedby={fieldErrors.email?`${id}-email-error`:undefined}/><FieldError id={`${id}-email-error`} errors={[{message:fieldErrors.email}]}/></Field>
 {fields}<Button type="submit" disabled={disabled||submitDisabled} aria-busy={pending||undefined} className="w-full dmf-sign-in-submit" data-block-submit><span>{submitLabel}</span>{pending&&<span className="dmf-sign-in-pending" aria-hidden="true"/>}</Button>
 </fieldset>}
 <p role="status" className="sr-only">{pending?pendingLabel:''}</p>{children}
 </CardContent>{(signinHref||footer)&&<CardFooter>{signinHref&&<a href={signinHref}>{signinLabel}</a>}{footer}</CardFooter>}</Card>
 </form>;
}
