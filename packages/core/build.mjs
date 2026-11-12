// Builds @dmf-ui/core from the repository's existing sources; nothing here is a second source.
// Every file is copied byte for byte, except two derived ones:
// - styles/dmf-ui.css: the root stylesheet with its Astro component scan replaced by a scan of Button variants.
// - button/variants.js and .d.ts: compiled from src/components/dmf-ui/button/button-variants.ts.
// Usage: node build.mjs [outDir]   (default: ./dist)
import {cp,mkdir,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const repo=resolve(here,'../..');
const out=resolve(process.argv[2]??join(here,'dist'));
const ts=createRequire(join(repo,'package.json'))('typescript');

export const astroSource='@source "../components/dmf-ui";';
export const coreSource='@source "../button";';
export const stylesheets=['dmf-ui-tokens.css','dmf-ui-foundations.css','dmf-ui-cb.css','dmf-ui-hui.css','dmf-ui-portfolio.css','dmf-ui-qdi.css','dmf-ui-nova.css','dmf-ui-blocks.css','upstream/shadcn.css'];
const variants='src/components/dmf-ui/button/button-variants.ts';

// [source relative to the repository, target relative to the output]
async function copies(){
 const list=[['public/dmf-ui-notices.txt','THIRD-PARTY-NOTICES.txt']];
 for(const dir of ['tokens','contracts'])for(const name of (await readdir(join(repo,dir))).filter(n=>n.endsWith('.json')).sort())list.push([`${dir}/${name}`,`${dir}/${name}`]);
 for(const name of stylesheets)list.push([`src/styles/${name}`,`styles/${name}`]);
 return list;
}
export async function copiedFiles(){
 const list=await copies();
 const walk=async dir=>{for(const e of (await readdir(join(repo,dir),{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:1)){const p=`${dir}/${e.name}`;if(e.isDirectory())await walk(p);else if(e.name!=='.DS_Store')list.push([p,p.replace(/^src\//,'')]);}};
 await walk('src/assets');
 return list;
}

export async function build(target=out){
 await rm(target,{recursive:true,force:true});
 for(const [from,to] of await copiedFiles()){await mkdir(dirname(join(target,to)),{recursive:true});await cp(join(repo,from),join(target,to));}
 const root=await readFile(join(repo,'src/styles/dmf-ui.css'),'utf8');
 if(root.split(astroSource).length!==2)throw new Error(`Expected exactly one ${astroSource} in src/styles/dmf-ui.css`);
 await writeFile(join(target,'styles/dmf-ui.css'),root.replace(astroSource,coreSource));
 const source=await readFile(join(repo,variants),'utf8');
 await mkdir(join(target,'button'),{recursive:true});
 const banner=`// Compiled from dmf-ui ${variants}.\n`;
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,verbatimModuleSyntax:true}}).outputText;
 await writeFile(join(target,'button/variants.js'),banner+js);
 const emitted={};
 const host=ts.createCompilerHost({});
 host.writeFile=(name,text)=>{emitted[name]=text;};
 const program=ts.createProgram([join(repo,variants)],{declaration:true,emitDeclarationOnly:true,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,target:ts.ScriptTarget.ES2022,strict:true,skipLibCheck:true},host);
 const result=program.emit();
 const errors=ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
 if(errors.length)throw new Error(ts.formatDiagnostics(errors,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>repo,getNewLine:()=>'\n'}));
 const dts=Object.entries(emitted).find(([name])=>name.endsWith('button-variants.d.ts'));
 if(!dts)throw new Error('No declaration emitted for Button variants');
 await writeFile(join(target,'button/variants.d.ts'),banner+dts[1]);
 return target;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(`Built @dmf-ui/core in ${await build()}`);
