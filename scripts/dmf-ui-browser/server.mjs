import { createServer } from 'node:http';
import { readFile, realpath, access } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.gif':'image/gif', '.ttf':'font/ttf', '.woff':'font/woff', '.woff2':'font/woff2', '.txt':'text/plain' };
export async function serveBuild(directory) {
  await access(resolve(directory, 'index.html')).catch(() => { throw new Error('Build the site first, or run npm run test:dmf-ui.'); });
  const root = await realpath(directory);
  let blockedWrites = 0;
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (!['GET','HEAD'].includes(request.method)) { blockedWrites++; response.writeHead(405); response.end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); }
    catch { response.writeHead(400); response.end(); return; }
    let file = resolve(root, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
    const inside = path => path.startsWith(root + sep);
    if (!inside(file)) { response.writeHead(403); response.end(); return; }
    try {
      file = await realpath(file);
      if (!inside(file)) { response.writeHead(403); response.end(); return; }
      const bytes = await readFile(file);
      response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { baseURL:`http://127.0.0.1:${server.address().port}`, get blockedWrites(){return blockedWrites;}, close:async()=>{server.closeAllConnections(); await new Promise(resolve=>server.close(resolve));} };
}
