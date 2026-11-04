import {modelDB,authorized,readBody,json} from '../../../lib/model-storage';
import {validateFolder} from '../../../lib/model-organizing.mjs';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 const user=await authorized(request);if(!user)return json({error:'forbidden'},403);
 let data;try{data=validateFolder(JSON.parse(new TextDecoder().decode(await readBody(request,4096))));}catch{return json({error:'invalid_folder'},400);}
 if(data.parentId){const parent=await modelDB().prepare('SELECT parent_id FROM model_folders WHERE id=?').bind(data.parentId).first<{parent_id:string|null}>();if(!parent||parent.parent_id!==null)return json({error:'invalid_parent'},400);}
 const existing=await modelDB().prepare('SELECT id FROM model_folders WHERE name=? AND parent_id IS ?').bind(data.name,data.parentId).first();if(existing)return json({error:'duplicate_folder'},409);
 const id=crypto.randomUUID(),stamp=new Date().toISOString();await modelDB().prepare('INSERT INTO model_folders(id,parent_id,name,version,created_by,created_at,updated_at) VALUES(?,?,?,1,?,?,?)').bind(id,data.parentId,data.name,user.userId,stamp,stamp).run();return json({id,parent_id:data.parentId,name:data.name,version:1},201);
 }catch{return json({error:'save_failed'},503);}}
