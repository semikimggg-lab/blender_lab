import test from 'node:test';import assert from 'node:assert/strict';import * as THREE from 'three';import {animationChoices,clipHasMotion} from '../src/explorer/animation.js';
test('prefer a moving clip over an exported constant-pose backup',()=>{
 const still=new THREE.AnimationClip('Backup',2,[new THREE.VectorKeyframeTrack('Bone.position',[0,1,2],[1,2,3,1,2,3,1,2,3])]);
 const moving=new THREE.AnimationClip('IK motion',2,[new THREE.VectorKeyframeTrack('Bone.position',[0,1,2],[1,2,3,1,3,3,1,2,3])]);
 assert.equal(clipHasMotion(still),false);assert.deepEqual(animationChoices([still,moving]),{moving:[false,true],defaultIndex:1});
 assert.deepEqual(animationChoices([]),{moving:[],defaultIndex:0});
});
test('quaternion sign flips and export floating-point noise do not count as motion',()=>{
 const same=new THREE.AnimationClip('Same orientation',1,[new THREE.QuaternionKeyframeTrack('Bone.quaternion',[0,1],[0,0,0,1,0,0,0,-1])]);
 const rotated=new THREE.AnimationClip('Rotate',1,[new THREE.QuaternionKeyframeTrack('Bone.quaternion',[0,1],[0,0,0,1,0,.7071068,0,.7071068])]);
 assert.equal(clipHasMotion(same),false);assert.equal(clipHasMotion(rotated),true);
 const noise=new THREE.AnimationClip('Noise',1,[new THREE.VectorKeyframeTrack('Bone.scale',[0,1],[1,1,1,1.0000001,1,1])]);assert.equal(clipHasMotion(noise),false);
});
