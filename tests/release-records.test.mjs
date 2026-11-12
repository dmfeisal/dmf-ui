import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readdirSync, readFileSync} from 'node:fs';
test('release records are well formed and cover every recorded version',()=>{
 const out=execFileSync(process.execPath,['scripts/release-record.mjs','check'],{encoding:'utf8'});
 assert.match(out,/release record\(s\) are well formed/);
 const versions=readdirSync('releases',{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name);
 for(const v of ['0.1.0','0.1.1','0.2.0','0.3.0','0.4.0','0.5.0','0.6.0'])assert(versions.includes(v),`missing releases/${v}`);
 for(const v of versions)assert.equal(JSON.parse(readFileSync(`releases/${v}/pack.json`,'utf8'))[0].version,v);
});
