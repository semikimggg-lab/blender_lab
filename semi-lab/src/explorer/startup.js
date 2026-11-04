export function chooseStartupModel(models,query,remembered){
 if(query)return query;
 if(remembered==='demo')return 'demo';
 if(remembered&&models.some(model=>model.id===remembered))return remembered;
 return models[0]?.id||'demo';
}
export function rememberedModel(storage){try{return storage.getItem('semi-lab-last-model-v1');}catch{return null;}}
export function rememberModel(storage,id){try{storage.setItem('semi-lab-last-model-v1',id);}catch{}}
