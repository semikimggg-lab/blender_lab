import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {defaults,simulate,atTime,profile,validate} from '../src/servo/physics.js';
const reference=JSON.parse(fs.readFileSync(new URL('./servo-blender-reference.json',import.meta.url)));
test('matches evaluated Blender stable and electronic gear endpoints',()=>{
 const stable=simulate({...defaults,...reference.parameters});assert.ok(Math.abs(atTime(stable,359/30).x*1000-reference.stable.actual_position_mm)<.01);
 const doubled=simulate({...defaults,...reference.parameters,numerator:2097152});assert.equal(doubled.requested,320);assert.ok(Math.abs(atTime(doubled,359/30).x*1000-reference.double_egear.actual_position_mm)<.01);
});
test('ringing and forced hunting match Blender reference samples',()=>{
 for(const [key,params] of [['ringing',{kp:80,kv:.4}],['hunting',{kp:80,kv:8,ripple:1000}]]){
  const run=simulate({...defaults,...reference.parameters,...params});
  for(const r of reference[key]){const actual=atTime(run,(r.frame-1)/30);assert.ok(Math.abs(actual.x*1000-r.actual_position_mm)<.05,`${key} frame ${r.frame}`);}
 }
});
test('invalid ratios rejected; travel clamped and short moves stable',()=>{
 assert.throws(()=>validate({...defaults,denominator:0}));assert.throws(()=>validate({...defaults,kp:Infinity}));assert.throws(()=>validate({...defaults,pulses:1.5}));
 const q=profile({...defaults,numerator:16777216,length:400});assert.ok(Math.abs(q.distance-.18)<1e-9);
 const zero=simulate({...defaults,pulses:0});assert.equal(zero.data.at(-1).x,0);
 const short=simulate({...defaults,pulses:2000});assert.ok(Math.abs(short.data.at(-1).x-.002)<1e-9);
});
