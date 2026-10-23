import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serveBuild } from '../scripts/dmf-ui-browser/server.mjs';
import { runBrowserSuite, bootstrap } from '../scripts/dmf-ui-browser/runner.mjs';

async function fixture(fn) {
  const root=await mkdtemp(join(tmpdir(),'dmf-ui-browser-'));
  try{await mkdir(join(root,'dist'));await writeFile(join(root,'dist/index.html'),'<h1>Fixture</h1>');await fn(root);}finally{await rm(root,{recursive:true,force:true});}
}
test('browser server is read-only, serves asset MIME types and contains decoded/symlink paths',async()=>fixture(async root=>{
  await writeFile(join(root,'secret.txt'),'outside');await writeFile(join(root,'dist/font.ttf'),'font');await symlink(join(root,'secret.txt'),join(root,'dist/link.txt'));
  const server=await serveBuild(join(root,'dist'));
  try{
    assert.equal(await (await fetch(server.baseURL+'/')).text(),'<h1>Fixture</h1>');
    assert.equal((await fetch(server.baseURL+'/font.ttf')).headers.get('content-type'),'font/ttf');
    assert.equal((await fetch(server.baseURL+'/missing')).status,404);
    assert.equal((await fetch(server.baseURL+'/%2e%2e%2fsecret.txt')).status,403);
    assert.equal((await fetch(server.baseURL+'/link.txt')).status,403);
    assert.equal((await fetch(server.baseURL+'/',{method:'POST',body:'no'})).status,405);
    assert.equal(server.blockedWrites,1);
  }finally{await server.close();}
}));
test('runner propagates browser failures and closes its private server',async()=>fixture(async root=>{
  let base;
  await assert.rejects(runBrowserSuite({root,scenarios:['pilot'],taskName:'unit-fixture',executeBrowser:async source=>{
    const config=JSON.parse(source.match(/^const config=(.*);/)[1]);base=config.baseURL;
    assert.equal(config.scenarios.length,1);assert(!source.includes('4399'));return 7;
  }}),/exit 7/);
  await assert.rejects(fetch(base));
}));
test('bootstrap keeps explicitly managed spaces and preserves failures before finishing',()=>{
  const code=bootstrap({baseURL:'http://127.0.0.1:1',taskName:'fixture',spaceId:123,scenarios:[],runtime:'file:///runtime.mjs',artifacts:'/tmp/results',finish:false});
  assert(code.includes('"finish":false'));assert(code.includes('test space retained'));assert(code.includes('helpers.resetBrowser(page)'));
  assert(code.indexOf('throw error')<code.indexOf('task.finish'));
});

test('runner freezes build files and rejects attempted writes even when the browser reports success',async()=>fixture(async root=>{
  await assert.rejects(runBrowserSuite({root,scenarios:['pilot'],taskName:'unit-fixture',executeBrowser:async source=>{
    const config=JSON.parse(source.match(/^const config=(.*);/)[1]);
    await writeFile(join(root,'dist/index.html'),'Changed during another build');
    assert.equal(await (await fetch(config.baseURL+'/')).text(),'<h1>Fixture</h1>');
    assert.equal((await fetch(config.baseURL+'/',{method:'POST'})).status,405);
    return 0;
  }}),/write request/);
}));

test('empty or unknown filters cannot report a zero-test success',async()=>{
  const previous=process.env.DMF_UI_TEST_FILTER;
  try {
    process.env.DMF_UI_TEST_FILTER=' , ';
    await assert.rejects(runBrowserSuite({root:'/unused',scenarios:['pilot'],taskName:'fixture'}),/at least one/);
    process.env.DMF_UI_TEST_FILTER='typo';
    await assert.rejects(runBrowserSuite({root:'/unused',scenarios:['pilot'],taskName:'fixture'}),/Unknown DMF UI suite/);
  } finally {
    if(previous===undefined)delete process.env.DMF_UI_TEST_FILTER;else process.env.DMF_UI_TEST_FILTER=previous;
  }
});

test('navigation runner serves only its explicitly selected fixture build',async()=>fixture(async root=>{
  const buildDir=join(root,'navigation-dist');await mkdir(buildDir);await writeFile(join(buildDir,'index.html'),'Navigation fixture');
  await runBrowserSuite({root,buildDir,scenarios:['navigation'],taskName:'unit-fixture',executeBrowser:async source=>{
    const config=JSON.parse(source.match(/^const config=(.*);/)[1]);
    assert.equal(await (await fetch(config.baseURL+'/')).text(),'Navigation fixture');return 0;
  }});
}));
