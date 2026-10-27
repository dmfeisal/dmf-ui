import type {ComponentPropsWithRef, ReactNode} from 'react';
import {Card, CardHeader, CardContent, CardFooter, Field, FieldLabel, FieldDescription, FieldError, Input, Button, Alert, AlertTitle, AlertDescription} from '../index';

export type ResetPasswordBlockProps = Omit<ComponentPropsWithRef<'form'>, 'id' | 'action' | 'method' | 'title'> & {
 id:string; action:string; title?:string; description?:string; headingLevel?:'h1'|'h2'|'h3';
 passwordName?:string; passwordLabel?:string; credentialState?:'unverified'|'ready'|'invalid'|'expired';
 complete?:boolean; completionMessage?:string; unverifiedMessage?:string; invalidMessage?:string; expiredMessage?:string;
 passwordHelp?:string; submitLabel?:string; pendingLabel?:string; pending?:boolean; disabled?:boolean; submitDisabled?:boolean;
 error?:string; errorTitle?:string; fieldErrors?:{password?:string;confirmPassword?:string};
 confirmPassword?:boolean; confirmPasswordName?:string; confirmPasswordLabel?:string; signinHref?:string; signinLabel?:string; recoveryHref?:string; recoveryLabel?:string;
 fields?:ReactNode; footer?:ReactNode;
};

/** Native uncontrolled fields; the host owns transport, validation feedback and pending state. */
export function ResetPasswordBlock({id,action,title='Choose a new password',description='Use this form after your account service validates your recovery link.',headingLevel:Heading='h2',passwordName='password',passwordLabel='New password',credentialState='unverified',complete=false,completionMessage='Follow your account service’s sign-in instructions.',unverifiedMessage='Your account service must validate your recovery link before you enter a new password.',invalidMessage='This recovery link cannot be used. Request new recovery instructions.',expiredMessage='This recovery link has expired. Request new recovery instructions.',passwordHelp,submitLabel='Update password',pendingLabel='Updating password…',pending=false,disabled=false,submitDisabled=false,error,errorTitle='Unable to update password',fieldErrors={},confirmPassword=false,confirmPasswordName='confirmPassword',confirmPasswordLabel='Confirm password',signinHref,signinLabel='Sign in',recoveryHref,recoveryLabel='Request new recovery instructions',fields,footer,children,className,...props}:ResetPasswordBlockProps){
 if(!id?.trim()||!action?.trim()||!passwordName.trim()||(confirmPassword&&(!confirmPasswordName.trim()||passwordName===confirmPasswordName)))throw Error('ResetPasswordBlock needs an id, host action and distinct field names.');
 if(!['unverified','ready','invalid','expired'].includes(credentialState))throw Error('Unsupported ResetPasswordBlock credentialState.');
 const ready=credentialState==='ready'&&!complete;
 const status=complete?completionMessage:credentialState==='ready'?'':credentialState==='expired'?expiredMessage:credentialState==='invalid'?invalidMessage:unverifiedMessage;
 return <form {...props} id={id} action={action} method="post" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} aria-busy={pending&&ready||undefined} data-slot="reset-password-block" className={['dmf-block dmf-auth-block dmf-reset-password-block',className].filter(Boolean).join(' ')}>
  <Card><CardHeader><Heading id={`${id}-title`}>{title}</Heading><p id={`${id}-description`}>{description}</p></CardHeader><CardContent>
   {error&&<Alert variant="destructive" role="alert"><AlertTitle>{errorTitle}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
   <p id={`${id}-status`} role="status" aria-atomic="true" tabIndex={!ready?-1:undefined} data-reset-status>{status}</p>
  {ready&&<fieldset disabled={disabled||pending} className="dmf-block-fields"><legend className="sr-only">{title}</legend>
    <Field data-invalid={fieldErrors.password?'true':undefined}><FieldLabel htmlFor={`${id}-password`}>{passwordLabel}</FieldLabel><Input id={`${id}-password`} name={passwordName} type="password" autoComplete="new-password" required aria-invalid={fieldErrors.password?'true':undefined} aria-describedby={[passwordHelp?`${id}-password-help`:'',fieldErrors.password?`${id}-password-error`:''].filter(Boolean).join(' ')||undefined}/>{passwordHelp&&<FieldDescription id={`${id}-password-help`}>{passwordHelp}</FieldDescription>}<FieldError id={`${id}-password-error`} errors={[{message:fieldErrors.password}]}/></Field>
   {confirmPassword&&<>    <Field data-invalid={fieldErrors.confirmPassword?'true':undefined}><FieldLabel htmlFor={`${id}-confirm-password`}>{confirmPasswordLabel}</FieldLabel><Input id={`${id}-confirm-password`} name={confirmPasswordName} type="password" autoComplete="new-password" required aria-invalid={fieldErrors.confirmPassword?'true':undefined} aria-describedby={fieldErrors.confirmPassword?`${id}-confirm-password-error`:undefined}/><FieldError id={`${id}-confirm-password-error`} errors={[{message:fieldErrors.confirmPassword}]}/></Field></>}
    {fields}
    <Button type="submit" disabled={disabled||submitDisabled} aria-busy={pending||undefined} className="w-full dmf-sign-in-submit" data-block-submit><span>{submitLabel}</span>{pending&&<span className="dmf-sign-in-pending" aria-hidden="true"/>}</Button>
   </fieldset>}
   <p role="status" className="sr-only">{pending&&ready?pendingLabel:''}</p>{children}
  </CardContent>{(signinHref||recoveryHref||footer)&&<CardFooter>{signinHref&&<a href={signinHref}>{signinLabel}</a>}{recoveryHref&&<a href={recoveryHref}>{recoveryLabel}</a>}{footer}</CardFooter>}</Card>
 </form>;
}
