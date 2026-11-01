import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import defaults from '../../../lib/library-defaults.json';
import {isAdmin, validateUpdate, sameOrigin, locales} from '../../../lib/library-policy.mjs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
function json(data:unknown,status=200){return Response.json(data,{status,headers});}
function db(){if(!env.DB)throw new Error('storage_unavailable');return env.DB;}
async function owner(){return (await db().prepare("SELECT user_id FROM site_admins WHERE role='owner' LIMIT 1").first<{user_id:string}>())?.user_id;}
async function catalog(){
  const {results}=await db().prepare('SELECT locale,content,version,updated_at FROM library_content').all<{locale:string,content:string,version:number,updated_at:string}>();
  return Object.fromEntries(locales.map((locale:string)=>{const row=results.find(r=>r.locale===locale);return [locale,{fields:row?JSON.parse(row.content):defaults[locale as keyof typeof defaults],version:row?.version??0,updatedAt:row?.updated_at??null}];}));
}
export async function GET(){
  try {
    const user=await getChatGPTUser();
    const canEdit=isAdmin(user,await owner(),(env as unknown as Record<string,string>).LIBRARY_OWNER_EMAIL);
    return json({locales:await catalog(),canEdit});
  }catch{return json({error:'storage_unavailable'},503);}
}
export async function PUT(request:Request){
  try {
    const user=await getChatGPTUser();
    if(!user)return json({error:'authentication_required'},401);
    const ownerId=await owner();
    if(!isAdmin(user,ownerId,(env as unknown as Record<string,string>).LIBRARY_OWNER_EMAIL))return json({error:'forbidden'},403);
    if(!sameOrigin(request))return json({error:'invalid_origin'},403);
    if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'invalid_content_type'},415);
    // Bound the body while reading, even when Content-Length is absent.
    const reader=request.body?.getReader();if(!reader)return json({error:'invalid_payload'},400);
    const chunks:Uint8Array[]=[];let bytes=0;
    while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>32768){await reader.cancel();return json({error:'payload_too_large'},413);}chunks.push(value);}
    const buffer=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.length;}
    let update;try{update=validateUpdate(JSON.parse(new TextDecoder().decode(buffer)));}catch{return json({error:'invalid_fields'},400);}
    const {locale,version,fields}=update, stamp=new Date().toISOString(), requestId=crypto.randomUUID(),content=JSON.stringify(fields);
    const next=version+1;
    // The conditional upsert plus audit and owner binding run in one D1 transaction.
    const result=await db().batch([
      db().prepare(`INSERT INTO library_content(locale,content,version,updated_at,updated_by,request_id)
        SELECT ?,?,?,?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM library_content WHERE locale=? AND version=?)
        ON CONFLICT(locale) DO UPDATE SET content=excluded.content,version=excluded.version,updated_at=excluded.updated_at,updated_by=excluded.updated_by,request_id=excluded.request_id WHERE library_content.version=? RETURNING version`)
        .bind(locale,content,next,stamp,user.userId,requestId,version,locale,version,version),
      db().prepare(`INSERT INTO content_audit(request_id,locale,version,content,actor_id,created_at)
        SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM library_content WHERE locale=? AND request_id=?)`)
        .bind(requestId,locale,next,content,user.userId,stamp,locale,requestId),
      db().prepare(`INSERT INTO site_admins(user_id,role,created_at)
        SELECT ?,'owner',? WHERE NOT EXISTS(SELECT 1 FROM site_admins WHERE role='owner')
        AND EXISTS(SELECT 1 FROM library_content WHERE locale=? AND request_id=?)`)
        .bind(user.userId,stamp,locale,requestId),
    ]);
    if(!result[0].results.length)return json({error:'version_conflict'},409);
    return json({locale,fields,version:next,updatedAt:stamp});
  }catch{return json({error:'save_failed'},503);}
}
