import {useEffect,useState} from 'react';
import {Button,Text,Input,Switch,Card,Badge,Alert,AlertTitle,AlertDescription,AlertAction,Label,Textarea,Checkbox,Separator,CardHeader,CardTitle,CardDescription,CardContent,CardFooter,Field,FieldGroup,FieldContent,FieldLabel,FieldDescription,FieldSet,FieldLegend} from '../src/index';
export function Proof({prefix='react'}:{prefix?:string}) {
 const [checked,setChecked]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 const [result,setResult]=useState('No values submitted.');
 return <Card>
  <CardHeader><CardTitle as="h2">React form proof</CardTitle><CardDescription>Local demonstration. Values stay on this page.</CardDescription></CardHeader>
  <CardContent>
  <form onSubmit={event=>{event.preventDefault();setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));}} onReset={()=>{setChecked(false);setResult('Form reset.');}}>
   <FieldSet disabled={!ready}><FieldLegend>Local preferences</FieldLegend>
   <Label htmlFor={`${prefix}-name`}>Display name</Label>
   <Input id={`${prefix}-name`} name="name" defaultValue="Feisal" required />
   <Switch name="updates" defaultChecked>Enable updates</Switch>
   <Switch name="controlled" checked={checked} onChange={event=>setChecked(event.currentTarget.checked)}>Controlled preference</Switch>
   <Switch name="disabled" disabled defaultChecked>Unavailable preference</Switch>
   <Switch name="consent" required>Required consent</Switch>
   <div className="dmf-react-actions"><Button type="submit">Preview values</Button><Button type="reset" variant="outline">Reset form</Button></div>
   </FieldSet>
  </form>
  </CardContent>
  <CardFooter><Text role="status" size="sm">{result}</Text></CardFooter>
  <Separator/>
  <FieldGroup>
   <Field><FieldLabel htmlFor={`${prefix}-notes`}>Local notes</FieldLabel><FieldContent><Textarea id={`${prefix}-notes`} defaultValue="" aria-describedby={`${prefix}-notes-help`}/><FieldDescription id={`${prefix}-notes-help`}>Notes remain in this local demonstration.</FieldDescription></FieldContent></Field>
   <Field orientation="horizontal"><Checkbox id={`${prefix}-optional`}/><FieldLabel className="min-h-[44px]" htmlFor={`${prefix}-optional`}>Optional local preference</FieldLabel></Field>
  </FieldGroup>
  <Badge variant="secondary">Local preview</Badge>
  <Alert>
   <AlertTitle>Preview values stay here</AlertTitle>
   <AlertDescription>This static notice does not announce itself as an urgent alert.</AlertDescription>
   <AlertAction><Badge as="a" href={`#${prefix}-name`} variant="link">Review display name</Badge></AlertAction>
  </Alert>
 </Card>;
}
