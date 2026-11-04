// Resolve by glTF node index: loader associations may be pruned by another scene.
export async function resolveNodeMap(gltf,nodes){
 const reachable=new Set();gltf.scene.traverse(object=>reachable.add(object));
 const entries=await Promise.all(nodes.map(async node=>{const object=await gltf.parser.getDependency('node',node.index);return [node.index,object];}));
 return new Map(entries.filter(([,object])=>reachable.has(object)));
}
