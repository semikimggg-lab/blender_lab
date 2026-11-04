import * as THREE from 'three';

// Keep original materials intact: meshes may share them with other parts.
export function createSelectionAppearance(root){
 const records=[];
 root.traverse(object=>{
  if(!object.isMesh)return;
  const originals=Array.isArray(object.material)?object.material:[object.material];
  const solid=originals.map(material=>{const copy=material.clone();copy.transparent=false;copy.opacity=1;copy.depthWrite=true;return copy;});
  const ghost=originals.map(material=>new THREE.MeshStandardMaterial({color:0xa6bbce,transparent:true,opacity:.13,depthWrite:false,roughness:.85,metalness:0,side:material.side,clippingPlanes:material.clippingPlanes}));
  records.push({object,original:object.material,solid:Array.isArray(object.material)?solid:solid[0],ghost:Array.isArray(object.material)?ghost:ghost[0],materials:[...solid,...ghost],renderOrder:object.renderOrder});
 });
 return {
  apply(target){
   const focused=new Set();target?.traverse(object=>{if(object.isMesh)focused.add(object);});
   // An empty group should never make the complete assembly disappear.
   const active=focused.size>0;
   for(const record of records){record.object.material=active?(focused.has(record.object)?record.solid:record.ghost):record.original;record.object.renderOrder=active&&!focused.has(record.object)?2:record.renderOrder;}
   return focused.size;
  },
  dispose(){for(const record of records){record.object.material=record.original;record.object.renderOrder=record.renderOrder;record.materials.forEach(material=>material.dispose());}}
 };
}

export function makeHierarchy(nodes,parts){
 const labels=new Map(parts.map(part=>[part.node,part]));
 const map=new Map(nodes.map(node=>[node.index,{...node,label:labels.get(node.index)?.name||node.name,children:[]}]));
 const roots=[];
 for(const node of map.values()){const parent=map.get(node.parent);if(parent)parent.children.push(node);else roots.push(node);}
 return {roots,map};
}
export function revealAncestors(index,map,expanded,includeSelf=false){
 let node=map.get(index);if(includeSelf&&node?.children.length)expanded.add(index);
 while(node&&node.parent!==null){expanded.add(node.parent);node=map.get(node.parent);}
}
export function filterHierarchy(roots,query){
 const term=query.trim().toLocaleLowerCase();
 const visit=(node,inherited=false)=>{
  const matches=inherited||!term||(node.name+' '+node.label).toLocaleLowerCase().includes(term);
  const children=node.children.map(child=>visit(child,matches)).filter(Boolean);
  return matches||children.length?{...node,children}:null;
 };
 return roots.map(node=>visit(node)).filter(Boolean);
}
