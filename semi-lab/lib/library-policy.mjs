export const locales = ['ko','en','zh'];
export const fieldLimits = Object.freeze({
  'library.title':80, 'library.subtitle':180,
  'vacuum-example-01.name':80, 'vacuum-example-01.description':180, 'vacuum-example-01.eyebrow':50,
  'transfer-planned.name':80, 'transfer-planned.description':180, 'transfer-planned.eyebrow':50,
  'wet-planned.name':80, 'wet-planned.description':180, 'wet-planned.eyebrow':50,
});
export function isAdmin(user, ownerId, bootstrapEmail) {
  if (!user?.userId || !user?.email) return false;
  // Once bound, the stable per-Site user ID is the durable authority.
  if (ownerId) return user.userId === ownerId;
  return !!bootstrapEmail && user.email.toLowerCase() === bootstrapEmail.trim().toLowerCase();
}
export function validateUpdate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid_payload');
  if (Object.keys(body).some(k=>!['locale','version','fields'].includes(k))) throw new Error('invalid_payload');
  if (!locales.includes(body.locale) || !Number.isSafeInteger(body.version) || body.version<0) throw new Error('invalid_payload');
  if (!body.fields || typeof body.fields!=='object' || Array.isArray(body.fields)) throw new Error('invalid_fields');
  const keys=Object.keys(body.fields);
  if(keys.length!==Object.keys(fieldLimits).length || keys.some(k=>!Object.hasOwn(fieldLimits,k))) throw new Error('invalid_fields');
  const fields={};
  for(const [key,max] of Object.entries(fieldLimits)) {
    const value=body.fields[key];
    if(typeof value!=='string' || !value.trim() || [...value.trim()].length>max || /[\u0000-\u001f\u007f]/.test(value)) throw new Error('invalid_fields');
    fields[key]=value.trim();
  }
  return {locale:body.locale,version:body.version,fields};
}
export function sameOrigin(request) {
  const origin=request.headers.get('origin');
  return !!origin && origin===new URL(request.url).origin && request.headers.get('sec-fetch-site')!=='cross-site';
}
