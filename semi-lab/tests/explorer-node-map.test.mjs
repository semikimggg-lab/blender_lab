import test from 'node:test';import assert from 'node:assert/strict';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';import * as THREE from 'three';import {resolveNodeMap} from '../src/explorer/node-map.js';
test('multiple scenes retain default-scene node mapping after loader association pruning',async()=>{
 const doc={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]},{nodes:[2]}],nodes:[{name:'Assembly',children:[1]},{name:'Part'},{name:'Other scene'}]};
 const gltf=await new GLTFLoader().parseAsync(JSON.stringify(doc),'');const map=await resolveNodeMap(gltf,[{index:0},{index:1},{index:2}]);assert.equal(map.size,2);assert.equal(map.get(1).name,'Part');assert.equal(map.has(2),false);
 const part=map.get(1),wrapper=new THREE.Group();part.parent.add(wrapper);wrapper.add(part);wrapper.position.x=2;gltf.scene.updateMatrixWorld(true);assert.equal(part.getWorldPosition(new THREE.Vector3()).x,2);
});
