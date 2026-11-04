import defaults from './library-defaults.json' with {type:'json'};
export const locales = ['ko','en','zh'];
export const fieldLimits = Object.freeze({'library.title':80,'library.subtitle':180,brand:40,'home.title':120,'home.subtitle':240,'servo.title':120,'servo.subtitle':240});
const cleanText=(value,max,optional=false)=>{
 if(typeof value!=='string'||(!optional&&!value.trim())||[...value.trim()].length>max||/[\u0000-\u001f\u007f]/.test(value))throw Error('invalid_fields');
 return value.trim();
};
export function safeLink(value,optional=false){
 const href=cleanText(value,500,optional);
 if(!href&&optional)return '';
 if(/[\\\s<>"'`]/.test(href)||/%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(href))throw Error('invalid_link');
 if(href.startsWith('/')&&!href.startsWith('//'))return href;
 if(href.startsWith('#'))return href;
 try{const url=new URL(href);if(url.protocol==='https:'&&!url.username&&!url.password)return url.href;}catch{}
 throw Error('invalid_link');
}
export function normalizeSavedFields(fields,locale){
 if(fields?.schema===2)return fields;
 const base=structuredClone(defaults[locale]);
 for(const key of ['library.title','library.subtitle'])if(typeof fields?.[key]==='string')base[key]=fields[key];
 for(const card of base.equipment)for(const key of ['name','description','eyebrow'])if(typeof fields?.[card.id+'.'+key]==='string')card[key]=fields[card.id+'.'+key];
 return base;
}
export function isAdmin(user, ownerId, bootstrapEmail) {
 if(!user?.userId||!user?.email)return false;
 if(ownerId)return user.userId===ownerId;
 return !!bootstrapEmail&&user.email.toLowerCase()===bootstrapEmail.trim().toLowerCase();
}
export function validateUpdate(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>!['locale','version','fields'].includes(k)))throw Error('invalid_payload');
 if(!locales.includes(body.locale)||!Number.isSafeInteger(body.version)||body.version<0)throw Error('invalid_payload');
 const f=body.fields;
 const keys=['schema',...Object.keys(fieldLimits),'navigation','equipment'];
 if(!f||f.schema!==2||Object.keys(f).length!==keys.length||Object.keys(f).some(k=>!keys.includes(k)))throw Error('invalid_fields');
 const fields={schema:2};
 for(const [key,max]of Object.entries(fieldLimits))fields[key]=cleanText(f[key],max);
 for(const [kind,max]of [['navigation',10],['equipment',24]]){
  if(!Array.isArray(f[kind])||f[kind].length>max||!f[kind].length)throw Error('invalid_fields');
  const seen=new Set();
  fields[kind]=f[kind].map(row=>{
   const allowed=kind==='navigation'?['id','name','href','visible']:['id','name','description','eyebrow','href','visible'];
   if(!row||typeof row!=='object'||Object.keys(row).length!==allowed.length||Object.keys(row).some(k=>!allowed.includes(k))||typeof row.id!=='string'||!/^[-a-z0-9]{1,60}$/.test(row.id)||seen.has(row.id)||typeof row.visible!=='boolean')throw Error('invalid_fields');
   seen.add(row.id);
   const item={id:row.id,name:cleanText(row.name,80),href:safeLink(row.href,kind==='equipment'),visible:row.visible};
   if(kind==='equipment'){item.description=cleanText(row.description,180);item.eyebrow=cleanText(row.eyebrow,50);}
   return item;
  });
  if(!fields[kind].some(row=>row.visible))throw Error('at_least_one_visible');
 }
 return {locale:body.locale,version:body.version,fields};
}
export function sameOrigin(request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin&&request.headers.get('sec-fetch-site')!=='cross-site';}
