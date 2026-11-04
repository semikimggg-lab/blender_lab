import test from 'node:test';import assert from 'node:assert/strict';
import {chooseStartupModel,rememberModel,rememberedModel} from '../src/explorer/startup.js';
import {emulationHref} from '../public/site-navigation.js';
test('reopening starts with the last saved model, and a new browser opens the latest server model',()=>{
 const models=[{id:'newest'},{id:'older'}];assert.equal(chooseStartupModel(models,null,'older'),'older');assert.equal(chooseStartupModel(models,null,null),'newest');assert.equal(chooseStartupModel(models,null,'deleted'),'newest');assert.equal(chooseStartupModel([],null,null),'demo');assert.equal(chooseStartupModel(models,'linked','older'),'linked');assert.equal(chooseStartupModel(models,null,'demo'),'demo');
});
test('last model survives a new page instance; unavailable browser storage does not break startup',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};rememberModel(storage,'robot');assert.equal(rememberedModel(storage),'robot');
 const denied={getItem(){throw Error();},setItem(){throw Error();}};assert.doesNotThrow(()=>rememberModel(denied,'robot'));assert.equal(rememberedModel(denied),null);
});
test('legacy library links move under other emulations without rewriting external or model links',()=>{
 assert.equal(emulationHref('/#catalog'),'/library#catalog');assert.equal(emulationHref('/#explorer'),'/library#explorer');assert.equal(emulationHref('/servo'),'/servo');assert.equal(emulationHref('/?model=robot'),'/?model=robot');assert.equal(emulationHref('https://example.com'), 'https://example.com');
});
