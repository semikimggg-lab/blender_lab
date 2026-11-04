import {safeLink} from './library-policy.mjs';
export const MAX_GLB_BYTES=20*1024*1024;
const text=(value,max)=>{if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b-\u001f\u007f]/.test(value))throw Error('invalid_text');return value.trim();};
export function inspectGLB(buffer){
 const bytes=new Uint8Array(buffer),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(bytes.length<20||bytes.length>MAX_GLB_BYTES||view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==bytes.length)throw Error('invalid_glb');
 const length=view.getUint32(12,true);if(length>2*1024*1024||length%4||20+length>bytes.length||view.getUint32(16,true)!==0x4e4f534a)throw Error('invalid_glb');
 const doc=JSON.parse(new TextDecoder().decode(bytes.subarray(20,20+length)));
 if(doc.asset?.version!=='2.0'||!Array.isArray(doc.nodes)||doc.nodes.length>3000||doc.nodes.length<1)throw Error('invalid_glb');
 for(const resource of [...(doc.buffers||[]),...(doc.images||[])])if(resource.uri&&!/^data:/i.test(resource.uri))throw Error('external_resources');
 if((doc.extensionsRequired||[]).some(name=>['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu'].includes(name)))throw Error('compressed_glb');
 const parents=new Map();
 for(let i=0;i<doc.nodes.length;i++)for(const child of doc.nodes[i].children||[]){if(!Number.isInteger(child)||!doc.nodes[child]||parents.has(child)||child===i)throw Error('invalid_hierarchy');parents.set(child,i);}
 for(let i=0;i<doc.nodes.length;i++){const visited=new Set([i]);let current=i;while(parents.has(current)){current=parents.get(current);if(visited.has(current)||visited.size>128)throw Error('invalid_hierarchy');visited.add(current);}}
 const reachable=new Set(),walk=index=>{if(!Number.isInteger(index)||!doc.nodes[index])throw Error('invalid_scene');if(reachable.has(index))return;reachable.add(index);for(const child of doc.nodes[index].children||[])walk(child);};
 const roots=doc.scenes?.[doc.scene??0]?.nodes;if(!Array.isArray(roots)||!roots.length)throw Error('invalid_scene');roots.forEach(walk);
 const joints=new Set((doc.skins||[]).flatMap(skin=>skin.joints||[]));
 const hasMesh=index=>doc.nodes[index].mesh!==undefined||(doc.nodes[index].children||[]).some(hasMesh);
 const nodes=doc.nodes.map((node,index)=>({index,parent:parents.get(index)??null,name:String(node.name||'Object '+index).slice(0,160),mesh:node.mesh!==undefined,partId:String(node.extras?.partId||'').slice(0,80),description:String(node.extras?.description||'').slice(0,2000),url:typeof node.extras?.infoUrl==='string'?node.extras.infoUrl:'',group:!joints.has(index)&&hasMesh(index)})).filter(node=>reachable.has(node.index)&&node.group);
 if(nodes.length>500)throw Error('too_many_parts');
 const order=new Map([...reachable].map((index,rank)=>[index,rank]));nodes.sort((a,b)=>order.get(a.index)-order.get(b.index));
 const nodeIds=new Set(nodes.map(node=>node.index));
 for(const node of nodes){let parent=node.parent;while(parent!==null&&!nodeIds.has(parent))parent=parents.get(parent)??null;node.parent=parent;try{node.url=safeLink(node.url,true);}catch{node.url='';}}
 return {nodes,animations:(doc.animations||[]).map((clip,index)=>({index,name:String(clip.name||'Animation '+(index+1)).slice(0,160)}))};
}
export function validateModelUpdate(body,allowedNodes){
 if(!body||Object.keys(body).some(k=>!['version','title','parts','folderId'].includes(k))||!Number.isSafeInteger(body.version)||body.version<0||!Array.isArray(body.parts)||body.parts.length!==allowedNodes.length)throw Error('invalid_manifest');
 const title=text(body.title,120);if(!title)throw Error('invalid_title');const seen=new Set(),ids=new Set(allowedNodes.map(node=>node.index));
 const parts=body.parts.map(row=>{
  if(!row||Object.keys(row).some(k=>!['node','name','description','url','resources'].includes(k))||!ids.has(row.node)||seen.has(row.node))throw Error('invalid_part');seen.add(row.node);
  const name=text(row.name,160);if(!name)throw Error('invalid_part');return {node:row.node,name,description:text(row.description,2000),resources:validateResources(row)};
 });if(body.folderId!==undefined&&body.folderId!==null&&(typeof body.folderId!=='string'||!/^[-a-f0-9]{36}$/.test(body.folderId)))throw Error('invalid_folder');
 return {version:body.version,title,parts,...(body.folderId!==undefined?{folderId:body.folderId}:{})};
}

export function validateResources(part){
 const rows=part.resources===undefined?(part.url?[{title:'관련 자료',url:part.url}]:[]):part.resources;
 if(!Array.isArray(rows)||rows.length>20)throw Error('invalid_resources');
 return rows.filter(row=>row?.title!==''||row?.url!=='').map(row=>{
  if(!row||Object.keys(row).some(key=>!['title','url'].includes(key)))throw Error('invalid_resources');
  const title=text(row.title,100);if(!title)throw Error('invalid_resources');return {title,url:safeLink(row.url)};
 });
}
