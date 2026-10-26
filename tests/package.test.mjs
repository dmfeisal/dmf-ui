import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

test('package exports exist and npm pack excludes host pages and example layout from core CSS',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const path of Object.values(pkg.exports).filter(path=>!path.includes('*'))) await access(path);
 const css=await readFile('src/styles/dmf-ui.css','utf8');
 assert(!/dmf-pilot-|dmf-system-|dmf-form-example|dmf-tabs-examples/.test(css));
 const pack=JSON.parse(execFileSync('npm',['pack','--dry-run','--ignore-scripts','--json'],{encoding:'utf8'}))[0];
 const paths=pack.files.map(f=>f.path);
 assert(paths.includes('src/assets/fonts/nunito.ttf'));
 assert(paths.includes('src/styles/dmf-ui-hui.css'));
 for(const name of ['inter-latin-variable.woff2','mplus-rounded-latin-500.woff2','mplus-rounded-latin-700.woff2','MPLUS-OFL.txt','INTER-OFL.txt'])assert(paths.includes(`src/assets/fonts/hui/${name}`));
 assert(paths.includes('public/dmf-ui-notices.txt'));
 assert(paths.includes('tokens/design.tokens.json'));
 assert(paths.includes('tokens/resolved.json'));
 assert(paths.includes('contracts/components.json'));
 assert(paths.every(path=>!path.startsWith('src/pages/')&&!path.startsWith('tests/')&&!path.startsWith('src/layouts/')&&!path.startsWith('src/data/')&&!path.startsWith('src/components/docs/')&&!path.startsWith('src/scripts/')&&path!=='src/styles/create.css'&&path!=='src/styles/documentation.css'&&path!=='EXPORT-MANIFEST.json'));
});
