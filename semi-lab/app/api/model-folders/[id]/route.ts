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
