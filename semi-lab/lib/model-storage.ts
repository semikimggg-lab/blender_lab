import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
import {isAdmin,sameOrigin} from './library-policy.mjs';
import {canManageModels,validId} from './model-organizing.mjs';
export const modelHeaders={'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:modelHeaders});
export const modelDB=()=>{if(!env.DB)throw Error('storage_unavailable');return env.DB;};
export const bucket=()=>{const value=(env as unknown as {BUCKET?:R2Bucket}).BUCKET;if(!value)throw Error('storage_unavailable');return value;};
export async function modelOwner(){const user=await getChatGPTUser();const owner=await modelDB().prepare("SELECT user_id FROM site_admins WHERE role='owner' LIMIT 1").first<{user_id:string}>();return isAdmin(user,owner?.user_id,(env as unknown as Record<string,string>).LIBRARY_OWNER_EMAIL)?user:null;}
export async function modelAdmin(){const user=await getChatGPTUser();if(!user)return null;const owner=await modelDB().prepare("SELECT user_id FROM site_admins WHERE role='owner' LIMIT 1").first<{user_id:string}>();const record=await modelDB().prepare('SELECT role FROM site_admins WHERE user_id=?').bind(user.userId).first<{role:string}>();return canManageModels(user,record?.role,owner?.user_id,(env as unknown as Record<string,string>).LIBRARY_OWNER_EMAIL)?user:null;}
export async function assignedFolder(id:unknown){if(id===null||id===undefined||id==='')return null;if(!validId(id))throw Error('invalid_folder');const row=await modelDB().prepare('SELECT id,parent_id FROM model_folders WHERE id=?').bind(id).first<{id:string,parent_id:string|null}>();if(!row?.parent_id)throw Error('invalid_folder');return row.id;}
export async function authorized(request:Request){const user=await modelAdmin();if(!user||!sameOrigin(request))return null;return user;}
export async function readBody(request:Request,limit:number){const reader=request.body?.getReader();if(!reader)throw Error('empty_body');let count=0;const chunks:Uint8Array[]=[];while(true){const result=await reader.read();if(result.done)break;count+=result.value.byteLength;if(count>limit){await reader.cancel();throw Error('too_large');}chunks.push(result.value);}const data=new Uint8Array(count);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.byteLength;}return data;}
export type ModelRow={id:string,title:string,object_key:string,folder_id:string|null,deleted_at:string|null,manifest:string,version:number,created_at:string,updated_at:string};
export async function modelRow(id:string){if(!/^[a-f0-9-]{36}$/.test(id))return null;return modelDB().prepare('SELECT * FROM model_assets WHERE id=? AND deleted_at IS NULL').bind(id).first<ModelRow>();}
