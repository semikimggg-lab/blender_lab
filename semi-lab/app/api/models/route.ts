import {inspectGLB,MAX_GLB_BYTES} from '../../../lib/model-policy.mjs';
import {modelDB,bucket,modelAdmin,assignedFolder,authorized,readBody,json} from '../../../lib/model-storage';
export const dynamic='force-dynamic';
export async function GET(){try{const {results}=await modelDB().prepare('SELECT id,title,folder_id,version,created_at,updated_at FROM model_assets WHERE deleted_at IS NULL ORDER BY updated_at DESC,created_at DESC LIMIT 1000').all();const {results:folders}=await modelDB().prepare('SELECT id,parent_id,name,version FROM model_folders ORDER BY name').all();const admin=!!await modelAdmin();return json({models:results,folders,canEdit:admin,canDelete:admin});}catch{return json({error:'storage_unavailable'},503);}}
export async function POST(request:Request){
 let key:string|undefined;
 try{
  const user=await authorized(request);if(!user)return json({error:'forbidden'},403);
  if(!request.headers.get('content-type')?.startsWith('model/gltf-binary'))return json({error:'invalid_content_type'},415);
  const folderId=await assignedFolder(new URL(request.url).searchParams.get('folderId'));const data=await readBody(request,MAX_GLB_BYTES);let inspected;try{inspected=inspectGLB(data);}catch(error){return json({error:(error as Error).message},400);}
  const id=crypto.randomUUID();key='models/'+id+'.glb';const stamp=new Date().toISOString();
  const manifest={...inspected,parts:inspected.nodes.map((node:any)=>({node:node.index,name:node.name,description:node.description,url:node.url}))};
  await bucket().put(key,data,{httpMetadata:{contentType:'model/gltf-binary'}});
  try{await modelDB().prepare('INSERT INTO model_assets(id,title,object_key,folder_id,manifest,version,created_by,created_at,updated_at) VALUES(?,?,?,?,?,1,?,?,?)').bind(id,'새 Blender 모델',key,folderId,JSON.stringify(manifest),user.userId,stamp,stamp).run();}
  catch(error){await bucket().delete(key);throw error;}
  return json({id,title:'새 Blender 모델',version:1,folderId,...manifest},201);
 }catch(error){const reason=(error as Error).message;console.error('Model upload failed:',reason);return json({error:reason==='too_large'?'too_large':reason==='invalid_folder'?'invalid_folder':'upload_failed'},reason==='too_large'?413:reason==='invalid_folder'?400:503);}
}
