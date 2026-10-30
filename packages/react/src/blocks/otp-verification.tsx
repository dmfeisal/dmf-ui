import type {ComponentPropsWithRef, ReactNode, Ref} from 'react';
import {Card, CardHeader, CardContent, CardFooter, Field, FieldLabel, FieldDescription, FieldError, Input, Button, Alert, AlertTitle, AlertDescription} from '../index';

export type OTPVerificationBlockProps = Omit<ComponentPropsWithRef<'form'>, 'id' | 'action' | 'method' | 'title'> & {
 id:string; action:string; title?:string; description?:string; headingLevel?:'h1'|'h2'|'h3';
 codeName?:string; codeLabel?:string; codeLength?:number; challengeState?:'unverified'|'ready'|'locked'|'expired';
 complete?:boolean; completionMessage?:string; unverifiedMessage?:string; lockedMessage?:string; expiredMessage?:string;
 codeHelp?:string; submitLabel?:string; pendingLabel?:string; pending?:boolean; disabled?:boolean; submitDisabled?:boolean;
 error?:string; errorTitle?:string; fieldErrors?:{code?:string};
 resendAction?:string; resendLabel?:string; resendPendingLabel?:string; resendPending?:boolean; resendDisabled?:boolean; resendHelp?:string; resendStatus?:string; signinHref?:string; signinLabel?:string; recoveryHref?:string; recoveryLabel?:string;
 fields?:ReactNode; footer?:ReactNode; resendFields?:ReactNode; onResendSubmit?:ComponentPropsWithRef<'form'>['onSubmit']; resendFormRef?:Ref<HTMLFormElement>;
};

/** Native uncontrolled fields; the host owns transport, validation feedback and pending state. */
export function OTPVerificationBlock({id,action,title='Enter a verification code',description='Use the code provided by your account service.',headingLevel:Heading='h2',codeName='code',codeLabel='Verification code',codeLength=6,challengeState='unverified',complete=false,completionMessage='Follow your account service’s sign-in instructions.',unverifiedMessage='Your account service must start a verification challenge before you enter a code.',lockedMessage='This verification attempt is unavailable. Follow your account service’s instructions.',expiredMessage='This code has expired. Request another code if your account service allows it.',codeHelp='Enter the ASCII digits provided by your account service.',submitLabel='Verify code',pendingLabel='Verifying code…',pending=false,disabled=false,submitDisabled=false,error,errorTitle='Unable to verify the code',fieldErrors={},resendAction,resendLabel='Request another code',resendPendingLabel='Requesting another code…',resendPending=false,resendDisabled=false,resendHelp,resendStatus,signinHref,signinLabel='Sign in',recoveryHref,recoveryLabel='Request new recovery instructions',fields,footer,resendFields,onResendSubmit,resendFormRef,children,className,...props}:OTPVerificationBlockProps){
 if(!id?.trim()||!action?.trim()||!codeName.trim()||(resendAction!==undefined&&!resendAction.trim()))throw Error('OTPVerificationBlock needs an id, host action and field name.');
 if(!Number.isInteger(codeLength)||codeLength<1||codeLength>12)throw Error('OTPVerificationBlock codeLength must be an integer from 1 to 12.');
 if(!['unverified','ready','locked','expired'].includes(challengeState))throw Error('Unsupported OTPVerificationBlock challengeState.');
 const ready=challengeState==='ready'&&!complete;
 const status=complete?completionMessage:challengeState==='ready'?'':challengeState==='expired'?expiredMessage:challengeState==='locked'?lockedMessage:unverifiedMessage;
 return <section className="dmf-block dmf-auth-block dmf-otp-verification-block" data-slot="otp-verification-block"><form {...props} id={id} action={action} method="post" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} aria-busy={pending&&ready||undefined} data-slot="otp-form" className={['dmf-otp-form',className].filter(Boolean).join(' ')}>
  <Card><CardHeader><Heading id={`${id}-title`}>{title}</Heading><p id={`${id}-description`}>{description}</p></CardHeader><CardContent>
   {error&&<Alert variant="destructive" role="alert"><AlertTitle>{errorTitle}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
   <p id={`${id}-status`} role="status" aria-atomic="true" tabIndex={!ready?-1:undefined} data-otp-status>{status}</p>
  {ready&&<fieldset disabled={disabled||pending||resendPending} className="dmf-block-fields"><legend className="sr-only">{title}</legend>
   <Field data-invalid={fieldErrors.code?'true':undefined}><FieldLabel htmlFor={`${id}-code`}>{codeLabel}</FieldLabel><Input id={`${id}-code`} name={codeName} type="text" inputMode="numeric" autoComplete="one-time-code" autoCapitalize="none" spellCheck={false} dir="ltr" minLength={codeLength} maxLength={codeLength} pattern={`[0-9]{${codeLength}}`} required aria-invalid={fieldErrors.code?'true':undefined} aria-describedby={[codeHelp?`${id}-code-help`:'',fieldErrors.code?`${id}-code-error`:''].filter(Boolean).join(' ')||undefined}/>{codeHelp&&<FieldDescription id={`${id}-code-help`}>{codeHelp}</FieldDescription>}<FieldError id={`${id}-code-error`} errors={[{message:fieldErrors.code}]}/></Field>
    {fields}
    <Button type="submit" disabled={disabled||submitDisabled} aria-busy={pending||undefined} className="w-full dmf-sign-in-submit" data-block-submit><span>{submitLabel}</span>{pending&&<span className="dmf-sign-in-pending" aria-hidden="true"/>}</Button>
   </fieldset>}
   <p role="status" className="sr-only">{pending&&ready?pendingLabel:''}</p>
  </CardContent>{(signinHref||recoveryHref||footer)&&<CardFooter>{signinHref&&<a href={signinHref}>{signinLabel}</a>}{recoveryHref&&<a href={recoveryHref}>{recoveryLabel}</a>}{footer}</CardFooter>}</Card>
 </form>{resendAction&&<form ref={resendFormRef} onSubmit={onResendSubmit} id={`${id}-resend`} action={resendAction} method="post" aria-label={resendLabel} aria-busy={resendPending||undefined} data-slot="otp-resend-form" className="dmf-otp-resend">
 <fieldset className="dmf-block-fields" disabled={disabled||pending||resendPending||resendDisabled||complete||!['ready','expired'].includes(challengeState)}><legend className="sr-only">{resendLabel}</legend>{resendFields}<Button type="submit" variant="outline" aria-describedby={resendHelp?`${id}-resend-help`:undefined}>{resendLabel}</Button></fieldset>
 {resendHelp&&<p id={`${id}-resend-help`}>{resendHelp}</p>}<p role="status" aria-atomic="true" data-otp-resend-status>{resendPending?resendPendingLabel:resendStatus}</p>
 </form>}{children}
</section>;
}
