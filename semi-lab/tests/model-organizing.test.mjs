import test from 'node:test';import assert from 'node:assert/strict';
import {canManageModels,validateFolder,folderLabel} from '../lib/model-organizing.mjs';
import {validateModelUpdate} from '../lib/model-policy.mjs';
const admin={userId:'admin-id',email:'admin@example.test'},viewer={userId:'viewer-id',email:'viewer@example.test'};
test('only authenticated owner or a server-recorded admin can manage/delete models',()=>{
 assert.equal(canManageModels(null,'admin','owner-id',''),false);assert.equal(canManageModels(viewer,'viewer','owner-id',''),false);assert.equal(canManageModels(admin,'admin','owner-id',''),true);assert.equal(canManageModels({userId:'owner-id',email:'changed@example.test'},null,'owner-id',''),true);assert.equal(canManageModels(viewer,null,'owner-id','viewer@example.test'),false);assert.equal(canManageModels(admin,null,null,'admin@example.test'),true);
});
test('folder names and category IDs are validated and a selected model folder is preserved',()=>{
 const category='11111111-1111-4111-8111-111111111111',folder='22222222-2222-4222-8222-222222222222';
 assert.deepEqual(validateFolder({name:' 로봇 ',parentId:null}),{name:'로봇',parentId:null,version:undefined});
 for(const body of [{name:'',parentId:null},{name:'bad\nname',parentId:null},{name:'Folder',parentId:'bad'},{name:'Folder',parentId:category,version:-1}])assert.throws(()=>validateFolder(body));
 assert.equal(folderLabel([{id:category,name:'로봇',parent_id:null},{id:folder,name:'샌딩 셀',parent_id:category}],folder),'로봇 / 샌딩 셀');assert.equal(folderLabel([],null),'미분류');
 const result=validateModelUpdate({version:2,title:'Robot',folderId:folder,parts:[{node:1,name:'Part',description:'',url:''}]},[{index:1}]);assert.equal(result.folderId,folder);
});
