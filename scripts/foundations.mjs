import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
export function compileFoundations(source){
 if(source.schemaVersion!==1||!source.tokens)throw Error('Invalid foundation schema');
 const resolved={};
 const resolve=(name,chain=[])=>{
  if(chain.includes(name))throw Error('Foundation alias cycle');
  const token=source.tokens[name];if(!token)throw Error(`Unknown foundation ${name}`);
  if(!/^[a-z][a-z0-9-]*$/.test(name)||!['primitive','semantic','component'].includes(token.layer))throw Error('Invalid foundation metadata');
  const value=token.value;if(typeof value!=='string'||/[;{}\n]/.test(value.replace(/^\{[a-z0-9-]+\}$/,'')))throw Error('Invalid foundation value');
  const match=value.match(/^\{([a-z0-9-]+)\}$/);const result=match?resolve(match[1],[...chain,name]):value;
  if(!/^[-\w\s.,%()]+$/.test(result))throw Error('Unsafe foundation CSS');
  resolved[name]=result;return result;
 };
 for(const name of Object.keys(source.tokens))resolve(name);
 const lines=Object.entries(source.tokens).map(([name,token])=>`  --dmf-${name}: ${token.value.replace(/^\{([a-z0-9-]+)\}$/,'var(--dmf-$1)')};`);
 const css=`/* Generated from tokens/foundations.json; shared DMF values, not brand specifications. */\n.dmf-ui {\n${lines.join('\n')}\n}\n@media (prefers-reduced-motion: reduce) {\n .dmf-ui { --dmf-duration-fast:0ms; --dmf-duration-normal:0ms; --dmf-duration-slow:0ms; }\n}\n`;
 return {'src/styles/dmf-ui-foundations.css':css,'tokens/foundations.resolved.json':JSON.stringify({schemaVersion:1,tokens:resolved},null,2)+'\n'};
}
export async function buildFoundations({check=false}={}){
 const source=JSON.parse(await readFile(new URL('tokens/foundations.json',root),'utf8'));
 for(const [path,content] of Object.entries(compileFoundations(source))){let previous;try{previous=await readFile(new URL(path,root),'utf8');}catch(e){if(e.code!=='ENOENT')throw e;}if(previous===content)continue;if(check)throw Error(`Stale ${path}`);await writeFile(new URL(path,root),content);}
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildFoundations({check:process.argv.includes('--check')});
