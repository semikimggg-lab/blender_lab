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

test('menus and cards can be added, renamed, hidden and reordered with validated links',()=>{
 const fields=structuredClone(defaults.ko);
 fields.navigation.reverse();fields.navigation[0].name='모터 교육';fields.navigation.push({id:'docs',name:'기술 자료',href:'https://example.com/docs',visible:true});
 fields.equipment[0].visible=false;fields.equipment.push({id:'custom-equipment',name:'새 장비',description:'준비 중',eyebrow:'05 / NEW',href:'',visible:true});
 const result=validateUpdate({locale:'ko',version:3,fields});
 assert.equal(result.fields.navigation[0].name,'모터 교육');assert.equal(result.fields.equipment[0].visible,false);assert.equal(result.fields.equipment.at(-1).href,'');
 for(const href of ['javascript:alert(1)','//evil.test','/\\evil.test','/\n/evil.test','data:text/html,test','http://example.com','https://user:password@example.com','/%5cevil.test']){
  const bad=structuredClone(fields);bad.navigation[0].href=href;assert.throws(()=>validateUpdate({locale:'ko',version:3,fields:bad}));
 }
 const duplicate=structuredClone(fields);duplicate.navigation.push({...duplicate.navigation[0]});assert.throws(()=>validateUpdate({locale:'ko',version:3,fields:duplicate}));
 const hidden=structuredClone(fields);hidden.equipment.forEach(row=>row.visible=false);assert.throws(()=>validateUpdate({locale:'ko',version:3,fields:hidden}));
 const tooMany=structuredClone(fields);tooMany.navigation=Array.from({length:11},(_,i)=>({id:'nav-'+i,name:'Menu',href:'/servo',visible:true}));assert.throws(()=>validateUpdate({locale:'ko',version:3,fields:tooMany}));
});

test('legacy saved library names survive schema upgrade without losing the servo card',async()=>{
 const {normalizeSavedFields}=await import('../lib/library-policy.mjs');
 const upgraded=normalizeSavedFields({'library.title':'내 설비 목록','vacuum-example-01.name':'수정한 진공 장비'},'ko');
 assert.equal(upgraded['library.title'],'내 설비 목록');assert.equal(upgraded.equipment[0].name,'수정한 진공 장비');assert.equal(upgraded.equipment.at(-1).href,'/servo');
 assert.deepEqual(normalizeSavedFields(upgraded,'ko'),upgraded);
});
