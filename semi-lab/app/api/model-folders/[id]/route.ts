import {modelDB,authorized,readBody,json} from '../../../../lib/model-storage';
import {validateFolder,validId} from '../../../../lib/model-organizing.mjs';
export const dynamic='force-dynamic';
export async function PUT(request:Request,context:{params:Promise<{id:string}>}){try{
 if(!await authorized(request))return json({error:'forbidden'},403);const {id}=await context.params;if(!validId(id))return json({error:'not_found'},404);
 let data;try{data=validateFolder(JSON.parse(new TextDecoder().decode(await readBody(request,4096))));}catch{return json({error:'invalid_folder'},400);}
 const folder=await modelDB().prepare('SELECT parent_id FROM model_folders WHERE id=?').bind(id).first<{parent_id:string|null}>();if(!folder)return json({error:'not_found'},404);if(folder.parent_id!==data.parentId)return json({error:'invalid_parent'},400);
 const duplicate=await modelDB().prepare('SELECT id FROM model_folders WHERE name=? AND parent_id IS ? AND id<>?').bind(data.name,folder.parent_id,id).first();if(duplicate)return json({error:'duplicate_folder'},409);
 const result=await modelDB().prepare('UPDATE model_folders SET name=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING version').bind(data.name,new Date().toISOString(),id,data.version).all();if(!result.results.length)return json({error:'version_conflict'},409);return json({id,name:data.name,parent_id:folder.parent_id,version:result.results[0].version});
 }catch{return json({error:'save_failed'},503);}}

export async function DELETE(request:Request,context:{params:Promise<{id:string}>}){try{
 if(!await authorized(request))return json({error:'forbidden'},403);
 const {id}=await context.params;if(!validId(id))return json({error:'not_found'},404);
 const version=Number(request.headers.get('if-match'));if(!Number.isSafeInteger(version)||version<1)return json({error:'version_conflict'},409);
 const db=modelDB(),folder=await db.prepare('SELECT version FROM model_folders WHERE id=?').bind(id).first<{version:number}>();if(!folder)return json({error:'not_found'},404);if(folder.version!==version)return json({error:'version_conflict'},409);
 const child=await db.prepare('SELECT id FROM model_folders WHERE parent_id=? LIMIT 1').bind(id).first();if(child)return json({error:'has_children'},409);
 const guard='EXISTS (SELECT 1 FROM model_folders WHERE id=? AND version=?) AND NOT EXISTS (SELECT 1 FROM model_folders WHERE parent_id=?)';
 const results=await db.batch([db.prepare('UPDATE model_assets SET folder_id=NULL,version=version+1,updated_at=? WHERE folder_id=? AND '+guard+' RETURNING id,version').bind(new Date().toISOString(),id,id,version,id),db.prepare('DELETE FROM model_folders WHERE id=? AND version=? AND NOT EXISTS (SELECT 1 FROM model_folders WHERE parent_id=?) RETURNING id').bind(id,version,id)]);
 if(!results[1].results.length)return json({error:'version_conflict'},409);return json({deleted:true,id,movedModels:results[0].results});
 }catch{return json({error:'delete_failed'},503);}}
