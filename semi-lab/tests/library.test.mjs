import test from 'node:test';
import assert from 'node:assert/strict';
import {isAdmin,validateUpdate,sameOrigin} from '../lib/library-policy.mjs';
import defaults from '../lib/library-defaults.json' with {type:'json'};
test('only authenticated owner can bootstrap; durable ID takes precedence',()=>{
 assert.equal(isAdmin(null,null,'owner@example.test'),false);
 assert.equal(isAdmin({userId:'learner',email:'student@example.test'},null,'owner@example.test'),false);
 assert.equal(isAdmin({userId:'owner',email:'owner@example.test'},null,'owner@example.test'),true);
 assert.equal(isAdmin({userId:'other',email:'owner@example.test'},'owner','owner@example.test'),false);
 assert.equal(isAdmin({userId:'owner',email:'updated@example.test'},'owner','owner@example.test'),true);
});
test('allowlisted locale, version and plain text fields only',()=>{
 const good={locale:'ko',version:0,fields:{...defaults.ko}};
 assert.equal(validateUpdate(good).fields['library.title'],defaults.ko['library.title']);
 for(const body of [{...good,locale:'de'},{...good,version:-1},{...good,admin:true},{...good,fields:{...good.fields,role:'owner'}},{...good,fields:{...good.fields,'library.title':''}},{...good,fields:{...good.fields,'library.title':'x'.repeat(81)}},{...good,fields:{...good.fields,'library.title':'line\nbreak'}}])assert.throws(()=>validateUpdate(body));
});
test('mutation requires a same-origin request',()=>{
 const url='https://example.test/api/library';
 assert.equal(sameOrigin(new Request(url,{headers:{Origin:'https://example.test'}})),true);
 assert.equal(sameOrigin(new Request(url,{headers:{Origin:'https://evil.test'}})),false);
 assert.equal(sameOrigin(new Request(url)),false);
});
