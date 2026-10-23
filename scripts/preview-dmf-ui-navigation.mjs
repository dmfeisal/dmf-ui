import { fileURLToPath } from 'node:url';
import { serveBuild } from './dmf-ui-browser/server.mjs';
const server=await serveBuild(fileURLToPath(new URL('../.dmf-ui-test-results/navigation-dist/',import.meta.url)));
console.log(`Read-only navigation fixture: ${server.baseURL}/a/`);
console.log('Open this URL in the browser being checked. Stop this process when finished.');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await server.close();process.exit(0);});
