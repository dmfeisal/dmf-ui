import type {ComponentPropsWithRef, ReactNode} from 'react';
import {Card, CardHeader, CardContent, CardFooter, Field, FieldLabel, FieldDescription, FieldError, Input, Button, Alert, AlertTitle, AlertDescription} from '../index';

export type SignUpBlockProps = Omit<ComponentPropsWithRef<'form'>, 'id' | 'action' | 'method' | 'title'> & {
 id:string; action:string; title?:string; description?:string; headingLevel?:'h1'|'h2'|'h3';
 email?:string; emailName?:string; passwordName?:string; emailLabel?:string; passwordLabel?:string;
 passwordHelp?:string; submitLabel?:string; pendingLabel?:string; pending?:boolean; disabled?:boolean; submitDisabled?:boolean;
 error?:string; errorTitle?:string; fieldErrors?:{email?:string;password?:string;confirmPassword?:string};
 confirmPassword?:boolean; confirmPasswordName?:string; confirmPasswordLabel?:string; signinHref?:string; signinLabel?:string; termsHref?:string; termsLabel?:string;
 fields?:ReactNode; footer?:ReactNode;
};

/** Native uncontrolled fields; the host owns transport, validation feedback and pending state. */
export function SignUpBlock({id,action,title='Create account',description='Enter your account details.',headingLevel:Heading='h2',email='',emailName='email',passwordName='password',emailLabel='Email',passwordLabel='Password',passwordHelp,submitLabel='Create account',pendingLabel='Creating account…',pending=false,disabled=false,submitDisabled=false,error,errorTitle='Unable to create account',fieldErrors={},confirmPassword=false,confirmPasswordName='confirmPassword',confirmPasswordLabel='Confirm password',signinHref,signinLabel='Sign in',termsHref,termsLabel='Terms',fields,footer,children,className,...props}:SignUpBlockProps){
 if(!id?.trim()||!action?.trim()||!emailName.trim()||!passwordName.trim()||emailName===passwordName||(confirmPassword&&(!confirmPasswordName.trim()||[emailName,passwordName].includes(confirmPasswordName))))throw Error('SignUpBlock needs an id, host action and distinct field names.');
 return <form {...props} id={id} action={action} method="post" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} aria-busy={pending||undefined} data-slot="sign-up-block" className={['dmf-block dmf-sign-up-block',className].filter(Boolean).join(' ')}>
  <Card><CardHeader><Heading id={`${id}-title`}>{title}</Heading><p id={`${id}-description`}>{description}</p></CardHeader><CardContent>
   {error&&<Alert variant="destructive" role="alert"><AlertTitle>{errorTitle}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
   <fieldset disabled={disabled||pending} className="dmf-block-fields"><legend className="sr-only">{title}</legend>
    <Field data-invalid={fieldErrors.email?'true':undefined}><FieldLabel htmlFor={`${id}-email`}>{emailLabel}</FieldLabel><Input id={`${id}-email`} name={emailName} type="email" autoComplete="email" defaultValue={email} required aria-invalid={fieldErrors.email?'true':undefined} aria-describedby={fieldErrors.email?`${id}-email-error`:undefined}/><FieldError id={`${id}-email-error`} errors={[{message:fieldErrors.email}]}/></Field>
    <Field data-invalid={fieldErrors.password?'true':undefined}><FieldLabel htmlFor={`${id}-password`}>{passwordLabel}</FieldLabel><Input id={`${id}-password`} name={passwordName} type="password" autoComplete="new-password" required aria-invalid={fieldErrors.password?'true':undefined} aria-describedby={[passwordHelp?`${id}-password-help`:'',fieldErrors.password?`${id}-password-error`:''].filter(Boolean).join(' ')||undefined}/>{passwordHelp&&<FieldDescription id={`${id}-password-help`}>{passwordHelp}</FieldDescription>}<FieldError id={`${id}-password-error`} errors={[{message:fieldErrors.password}]}/></Field>
   {confirmPassword&&<>    <Field data-invalid={fieldErrors.confirmPassword?'true':undefined}><FieldLabel htmlFor={`${id}-confirm-password`}>{confirmPasswordLabel}</FieldLabel><Input id={`${id}-confirm-password`} name={confirmPasswordName} type="password" autoComplete="new-password" required aria-invalid={fieldErrors.confirmPassword?'true':undefined} aria-describedby={fieldErrors.confirmPassword?`${id}-confirm-password-error`:undefined}/><FieldError id={`${id}-confirm-password-error`} errors={[{message:fieldErrors.confirmPassword}]}/></Field></>}
    {fields}
    <Button type="submit" disabled={disabled||submitDisabled} aria-busy={pending||undefined} className="w-full dmf-sign-in-submit" data-block-submit><span>{submitLabel}</span>{pending&&<span className="dmf-sign-in-pending" aria-hidden="true"/>}</Button>
   </fieldset>
   <p role="status" className="sr-only">{pending?pendingLabel:''}</p>{children}
  </CardContent>{(signinHref||termsHref||footer)&&<CardFooter>{signinHref&&<a href={signinHref}>{signinLabel}</a>}{termsHref&&<a href={termsHref}>{termsLabel}</a>}{footer}</CardFooter>}</Card>
 </form>;
}
