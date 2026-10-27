import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('authentication additions remain Blocks with native password and recovery boundaries',async()=>{
 const catalog=JSON.parse(await readFile('contracts/catalog.json','utf8'));
 for(const [slug,name]of [['sign-up','SignUpBlock'],['password-recovery','PasswordRecoveryBlock']]){
  const b=catalog.blocks.find(b=>b.slug===slug);assert(b);assert.equal(b.category,'Authentication');assert.equal(b.support.react.status,'experimental');assert(catalog.react.exports.includes(name));assert(!catalog.components.some(c=>c.slug===slug));
  const html=await readFile(`dist/blocks/${slug}/index.html`,'utf8');assert(html.includes('method="post"'));assert(html.includes('data-implementation-support'));assert(html.includes(`rel="canonical" href="https://ui.feisal.id/blocks/${slug}/"`));assert(html.includes('/examples/authentication/'));assert(html.includes('data-copy-value'));assert(!/<input[^>]*type="password"[^>]*value=/.test(html));
 }
 const signup=await readFile('dist/blocks/sign-up/index.html','utf8');assert(signup.includes('autocomplete="new-password"'));assert(signup.includes('name="confirmPassword"'));assert(signup.includes('auth-signup-display'));
 const recovery=await readFile('dist/blocks/password-recovery/index.html','utf8');assert(recovery.includes('If recovery is available'));assert(recovery.includes('data-recovery-completion'));assert(recovery.includes('tabindex="-1"'));
 const example=await readFile('dist/examples/authentication/index.html','utf8');for(const name of ['sign-in-block','sign-up-block','password-recovery-block'])assert(example.includes(`data-slot="${name}"`));assert(example.includes('No account')||example.includes('no account'));
});
