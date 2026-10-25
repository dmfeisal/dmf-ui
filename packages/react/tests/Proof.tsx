import {useEffect,useState} from 'react';
import {Button,Text,Input,Switch,Card,Badge,Alert,AlertTitle,AlertDescription,AlertAction} from '../src/index';
export function Proof({prefix='react'}:{prefix?:string}) {
 const [checked,setChecked]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 const [result,setResult]=useState('No values submitted.');
 return <Card>
  <Text as="h2" size="title">React form proof</Text>
  <Text tone="muted">Local demonstration. Values stay on this page.</Text>
  <form onSubmit={event=>{event.preventDefault();setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));}} onReset={()=>{setChecked(false);setResult('Form reset.');}}>
   <fieldset disabled={!ready}><legend>Local preferences</legend>
   <label htmlFor={`${prefix}-name`}>Display name</label>
   <Input id={`${prefix}-name`} name="name" defaultValue="Feisal" required />
   <Switch name="updates" defaultChecked>Enable updates</Switch>
   <Switch name="controlled" checked={checked} onChange={event=>setChecked(event.currentTarget.checked)}>Controlled preference</Switch>
   <Switch name="disabled" disabled defaultChecked>Unavailable preference</Switch>
   <Switch name="consent" required>Required consent</Switch>
   <div className="dmf-react-actions"><Button type="submit">Preview values</Button><Button type="reset" variant="outline">Reset form</Button></div>
   </fieldset>
  </form>
  <Text role="status" size="sm">{result}</Text>
  <Badge variant="secondary">Local preview</Badge>
  <Alert>
   <AlertTitle>Preview values stay here</AlertTitle>
   <AlertDescription>This static notice does not announce itself as an urgent alert.</AlertDescription>
   <AlertAction><Badge as="a" href={`#${prefix}-name`} variant="link">Review display name</Badge></AlertAction>
  </Alert>
 </Card>;
}
