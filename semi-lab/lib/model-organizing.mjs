export const validId=value=>typeof value==='string'&&/^[a-f0-9-]{36}$/.test(value);
export function canManageModels(user,role,ownerId,bootstrapEmail){
 if(!user?.userId||!user?.email)return false;
 if(role==='owner'||role==='admin')return true;
 if(ownerId)return user.userId===ownerId;
 return !!bootstrapEmail&&user.email.toLowerCase()===bootstrapEmail.trim().toLowerCase();
}
export function validateFolder(body){
 if(!body||Object.keys(body).some(key=>!['name','parentId','version'].includes(key))||typeof body.name!=='string'||!body.name.trim()||body.name.trim().length>80||/[\u0000-\u001f\u007f]/.test(body.name))throw Error('invalid_folder');
 if(body.parentId!==null&&!validId(body.parentId))throw Error('invalid_folder');
 if(body.version!==undefined&&(!Number.isSafeInteger(body.version)||body.version<1))throw Error('invalid_folder');
 return {name:body.name.trim(),parentId:body.parentId,version:body.version};
}
export function folderLabel(folders,id){
 if(!id)return '미분류';const folder=folders.find(item=>item.id===id);if(!folder)return '미분류';const parent=folders.find(item=>item.id===folder.parent_id);return parent?parent.name+' / '+folder.name:folder.name;
}
