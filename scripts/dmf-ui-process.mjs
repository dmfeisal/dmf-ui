import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir,open,readFile,unlink} from 'node:fs/promises';
import {join} from 'node:path';
const execFileAsync=promisify(execFile);
const MiB=1024*1024;

export async function acquireVerificationLock(root){
 const directory=join(root,'.dmf-ui-test-results');await mkdir(directory,{recursive:true});
 const path=join(directory,'react-verification.lock');
 for(let attempt=0;attempt<2;attempt++){
  try{const file=await open(path,'wx');await file.writeFile(JSON.stringify({pid:process.pid}));return async()=>{await file.close();await unlink(path).catch(error=>{if(error.code!=='ENOENT')throw error;});};}
  catch(error){
   if(error.code!=='EEXIST')throw error;
   let owner;try{owner=JSON.parse(await readFile(path,'utf8'));}catch{throw Error('React verification lock cannot be read; inspect it before retrying.');}
   if(!Number.isSafeInteger(owner.pid)||owner.pid<1)throw Error('Invalid React verification lock owner.');
   try{process.kill(owner.pid,0);}catch(probe){if(probe.code==='ESRCH'){await unlink(path).catch(e=>{if(e.code!=='ENOENT')throw e;});continue;}throw probe;}
   throw Error(`React verification already running (PID ${owner.pid}); wait for it to finish instead of starting overlapping diagnostics.`);
  }
 }
 throw Error('Could not acquire React verification lock.');
}

/** Bound owned command trees independently of the event loop inside a stuck test worker. */
export async function runBounded(command,args,{cwd,capture=false,input,timeoutMs=180000,maxOutputBytes=2*MiB,maxRssBytes=1024*MiB,pollMs=250,onSample}={}){
 const grouped=process.platform!=='win32';
 const child=spawn(command,args,{cwd,detached:grouped,stdio:[input===undefined?'ignore':'pipe','pipe','pipe']});
 let output='',bytes=0,peakRssBytes=0,failure,checking=false,forceTimer,finished=false;
 const started=Date.now();
 const kill=signal=>{try{if(grouped&&child.pid)process.kill(-child.pid,signal);else child.kill(signal);}catch(error){if(error.code!=='ESRCH')throw error;}};
 const stop=reason=>{if(failure)return;failure=reason;kill('SIGTERM');forceTimer=setTimeout(()=>kill('SIGKILL'),1000);forceTimer.unref();};
 const interrupt=()=>stop('interrupted');
 process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
 const receive=(chunk,stderr=false)=>{bytes+=chunk.length;if(bytes>maxOutputBytes){stop(`command output exceeded ${maxOutputBytes} bytes`);return;}if(capture&&!stderr)output+=chunk;else (stderr?process.stderr:process.stdout).write(chunk);};
 child.stdout.on('data',chunk=>receive(chunk));child.stderr.on('data',chunk=>receive(chunk,true));
 if(input!==undefined){child.stdin.on('error',()=>{});child.stdin.end(input);}
 const deadline=setTimeout(()=>stop(`deadline exceeded ${timeoutMs}ms`),timeoutMs);deadline.unref();
 const sample=async()=>{
  if(!grouped||checking||!child.pid)return;checking=true;
  try{
   const {stdout}=await execFileAsync('ps',['-axo','pid=,pgid=,rss='],{timeout:2000,maxBuffer:2*MiB});
   if(finished)return;
   const rss=stdout.trim().split('\n').reduce((total,line)=>{const [,group,kib]=line.trim().split(/\s+/).map(Number);return total+(group===child.pid?kib*1024:0);},0);
   peakRssBytes=Math.max(peakRssBytes,rss);onSample?.(rss);
   if(rss>maxRssBytes)stop(`owned process-tree RSS exceeded ${Math.round(maxRssBytes/MiB)} MiB`);
  }catch(error){if(!finished)stop(`memory watchdog unavailable (${error.code??'ps error'})`);}finally{checking=false;}
 };
 const monitor=setInterval(()=>{void sample();},pollMs);monitor.unref();
 void sample();
 try{
  const {code,signal}=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal}));});
  const metrics={peakRssBytes,durationMs:Date.now()-started};
  if(failure||code!==0){const error=Error(`${command} failed: ${failure??`exit ${code??signal}`}`);Object.assign(error,metrics,{output:output.slice(-4096)});throw error;}
  return {output,...metrics};
 }finally{
  finished=true;
  clearTimeout(deadline);clearTimeout(forceTimer);clearInterval(monitor);
  process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);
  // npm can exit before its workers. This group belongs only to this invocation.
  kill('SIGKILL');
 }
}
