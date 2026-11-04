import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createSelectionAppearance,makeHierarchy,revealAncestors,filterHierarchy} from '../src/explorer/selection.js';

test('folder and part focus isolate shared materials, preserve texture and restore the complete assembly',()=>{
 const root=new THREE.Group(),folder=new THREE.Group(),otherFolder=new THREE.Group();root.add(folder,otherFolder);
 const texture=new THREE.Texture(),shared=new THREE.MeshStandardMaterial({color:0xff8844,map:texture,transparent:true,opacity:.6});
 const first=new THREE.Mesh(new THREE.BoxGeometry(),shared),second=new THREE.Mesh(new THREE.BoxGeometry(),shared),other=new THREE.Mesh(new THREE.BoxGeometry(),[shared,shared]);folder.add(first,second);otherFolder.add(other);
 const appearance=createSelectionAppearance(root);
 assert.equal(appearance.apply(folder),2);
 assert.equal(first.material.opacity,1);assert.equal(second.material.transparent,false);assert.equal(first.material.map,texture);
 assert.equal(other.material[0].transparent,true);assert.ok(other.material[0].opacity<.2);assert.equal(other.material[0].depthWrite,false);
 assert.equal(shared.opacity,.6);assert.equal(shared.transparent,true);
 appearance.apply(first);assert.equal(first.material.opacity,1);assert.ok(second.material.opacity<.2);
 appearance.apply(null);assert.equal(first.material,shared);assert.equal(second.material,shared);assert.deepEqual(other.material,[shared,shared]);
 appearance.apply(otherFolder);appearance.dispose();assert.equal(first.material,shared);assert.equal(other.renderOrder,0);
});
test('nested collections remain folders; selecting a deep part reveals ancestors and search retains its path',()=>{
 const nodes=[{index:2,parent:1,name:'Bolt',mesh:true},{index:0,parent:null,name:'Robot',mesh:false},{index:1,parent:0,name:'Tool',mesh:false},{index:3,parent:0,name:'Base',mesh:true}];
 const hierarchy=makeHierarchy(nodes,nodes.map(node=>({node:node.index,name:node.name})));
 assert.equal(hierarchy.roots[0].name,'Robot');assert.equal(hierarchy.map.get(1).children[0].index,2);
 const expanded=new Set();revealAncestors(2,hierarchy.map,expanded);assert.deepEqual([...expanded].sort(),[0,1]);
 const filtered=filterHierarchy(hierarchy.roots,'bolt');assert.equal(filtered[0].name,'Robot');assert.equal(filtered[0].children.length,1);assert.equal(filtered[0].children[0].children[0].name,'Bolt');
 assert.equal(filterHierarchy(hierarchy.roots,'Tool')[0].children[0].children.length,1);assert.deepEqual(filterHierarchy(hierarchy.roots,'not found'),[]);
});
