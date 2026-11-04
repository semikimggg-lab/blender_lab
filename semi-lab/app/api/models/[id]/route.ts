import {modelDB,modelRow,authorized,assignedFolder,readBody,json} from '../../../../lib/model-storage';
import {validateModelUpdate} from '../../../../lib/model-policy.mjs';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_request:Request,context:Context){try{const {id}=await context.params;const row=await modelRow(id);if(!row)return json({error:'not_found'},404);return json({id:row.id,title:row.title,version:row.version,folderId:row.folder_id,...JSON.parse(row.manifest)});}catch{return json({error:'storage_unavailable'},503);}}
export async function PUT(request:Request,context:Context){try{
 const user=await authorized(request);if(!user)return json({error:'forbidden'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'invalid_content_type'},415);
 const {id}=await context.params,row=await modelRow(id);if(!row)return json({error:'not_found'},404);
 const manifest=JSON.parse(row.manifest);let update;
 try{update=validateModelUpdate(JSON.parse(new TextDecoder().decode(await readBody(request,2*1024*1024))),manifest.nodes);}catch{return json({error:'invalid_manifest'},400);}
 let folderId;try{folderId=await assignedFolder(update.folderId===undefined?row.folder_id:update.folderId);}catch{return json({error:'invalid_folder'},400);}
 const next={...manifest,parts:update.parts};const stamp=new Date().toISOString();
 const result=await modelDB().prepare('UPDATE model_assets SET title=?,manifest=?,folder_id=?,version=version+1,updated_at=? WHERE id=? AND version=? AND deleted_at IS NULL RETURNING version').bind(update.title,JSON.stringify(next),folderId,stamp,id,update.version).all<{version:number}>();
 if(!result.results.length)return json({error:'version_conflict'},409);
 return json({id,title:update.title,version:result.results[0].version,folderId,...next});
 }catch{return json({error:'save_failed'},503);}}

export async function DELETE(request:Request,context:Context){try{
 if(!await authorized(request))return json({error:'forbidden'},403);
 const {id}=await context.params,row=await modelRow(id);if(!row)return json({error:'not_found'},404);
 const expected=Number(request.headers.get('if-match'));if(!Number.isSafeInteger(expected)||expected!==row.version)return json({error:'version_conflict'},409);
 const stamp=new Date().toISOString();const result=await modelDB().prepare('UPDATE model_assets SET deleted_at=?,updated_at=?,version=version+1 WHERE id=? AND version=? AND deleted_at IS NULL RETURNING id').bind(stamp,stamp,id,expected).all();
 if(!result.results.length)return json({error:'version_conflict'},409);return json({id,deleted:true});
 }catch{return json({error:'delete_failed'},503);}}

export async function PATCH(request:Request,context:Context){try{
 if(!await authorized(request))return json({error:'forbidden'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'invalid_content_type'},415);
 const {id}=await context.params;const row=await modelRow(id);if(!row)return json({error:'not_found'},404);
 let body,folderId;try{body=JSON.parse(new TextDecoder().decode(await readBody(request,2048)));if(Object.keys(body).some(key=>!['version','folderId'].includes(key))||!Number.isSafeInteger(body.version)||!Object.hasOwn(body,'folderId'))throw Error();folderId=await assignedFolder(body.folderId);}catch{return json({error:'invalid_folder'},400);}
 const result=await modelDB().prepare('UPDATE model_assets SET folder_id=?,version=version+1,updated_at=? WHERE id=? AND version=? AND deleted_at IS NULL RETURNING version').bind(folderId,new Date().toISOString(),id,body.version).all<{version:number}>();
 if(!result.results.length)return json({error:'version_conflict'},409);return json({id,folderId,version:result.results[0].version});
 }catch{return json({error:'move_failed'},503);}}
