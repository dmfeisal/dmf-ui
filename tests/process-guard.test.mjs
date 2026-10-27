import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {runBounded,acquireVerificationLock} from '../scripts/dmf-ui-process.mjs';

test('verification lock rejects overlapping runs and releases cleanly',async()=>{
 const root=await mkdtemp(join(tmpdir(),'dmf-process-lock-'));
 try{const release=await acquireVerificationLock(root);await assert.rejects(acquireVerificationLock(root),/already running/);await release();const second=await acquireVerificationLock(root);await second();}finally{await rm(root,{recursive:true,force:true});}
});
test('external deadline stops a synchronous stuck worker',async()=>{
 const start=Date.now();await assert.rejects(runBounded(process.execPath,['-e','while(true){}'],{timeoutMs:250}),/deadline exceeded/);assert(Date.now()-start<4000);
});
test('bounded commands preserve script input used by browser verification',async()=>{
 const {output}=await runBounded(process.execPath,['-e','let source="";process.stdin.setEncoding("utf8");process.stdin.on("data",part=>source+=part);process.stdin.on("end",()=>process.stdout.write(source));'],{capture:true,input:'verification script\n',timeoutMs:4000});
 assert.equal(output,'verification script\n');
});
test('captured command output is bounded before it can grow without limit',async()=>{
 await assert.rejects(runBounded(process.execPath,['-e','process.stdout.write("x".repeat(4096));setInterval(()=>{},1000)'],{capture:true,maxOutputBytes:512,timeoutMs:4000}),error=>error.message.includes('command output exceeded')&&error.output.length<=512);
});
test('stderr is bounded even when command output is streamed',async()=>{
 await assert.rejects(runBounded(process.execPath,['-e','process.stderr.write("x".repeat(4096));setInterval(()=>{},1000)'],{maxOutputBytes:512,timeoutMs:4000}),/command output exceeded/);
});
test('a successful command cannot leave its own background worker running',{skip:process.platform==='win32'},async()=>{
 const {output}=await runBounded(process.execPath,['-e','const {spawn}=require("node:child_process");const child=spawn(process.execPath,["-e","setInterval(()=>{},1000)"],{stdio:"ignore"});child.unref();console.log(child.pid);'],{capture:true,timeoutMs:4000});
 const pid=Number(output.trim());assert(Number.isSafeInteger(pid)&&pid>0);
 let status='';try{status=execFileSync('ps',['-p',String(pid),'-o','stat='],{encoding:'utf8'}).trim();}catch(error){if(error.status!==1)throw error;}
 assert(!status||status.startsWith('Z'),`Owned background worker ${pid} is still running`);
});
test('RSS watchdog stops only its owned memory-growing process group',{skip:process.platform==='win32'},async()=>{
 await assert.rejects(runBounded(process.execPath,['--max-old-space-size=64','-e','const blocks=[];setInterval(()=>blocks.push(Buffer.alloc(4*1024*1024,1)),30)'],{timeoutMs:5000,maxRssBytes:96*1024*1024,pollMs:50}),error=>error.message.includes('RSS exceeded')&&error.peakRssBytes>96*1024*1024&&error.peakRssBytes<192*1024*1024);
});
