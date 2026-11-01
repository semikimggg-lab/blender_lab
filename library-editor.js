import {getLanguage} from './i18n.js';
const copy={
 ko:{edit:'라이브러리 편집',heading:'라이브러리 문구 편집',intro:'언어별 문구를 편집하고 저장하세요. 변경 내용은 모든 방문자에게 적용됩니다.',lang:'편집할 언어',general:'라이브러리 안내',title:'제목',subtitle:'안내 문구',name:'설비명',description:'카드 설명',eyebrow:'카테고리 문구',save:'변경 내용 저장',cancel:'취소',close:'닫기',ready:'서버에 저장된 문구',dirty:'저장하지 않은 변경 사항',saving:'저장 중…',saved:'서버 저장 완료',unavailable:'최신 문구를 불러오지 못했습니다.',retry:'다시 불러오기',failed:'저장하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도하세요.',denied:'수정 권한을 확인할 수 없습니다. 다시 로그인한 후 시도하세요.',conflict:'다른 세션에서 수정되었습니다. 최신 문구를 불러온 뒤 다시 편집하세요.',reload:'최신 문구 불러오기',discard:'저장하지 않은 변경 사항을 취소할까요?',scope:'편집 범위: 라이브러리 안내와 설비 카드의 문구. 모델·부품·학습 기능은 변경하지 않습니다.',version:'저장 버전',validation:'각 항목에 허용 길이 이내의 한 줄 문구를 입력하세요.'},
 en:{edit:'Edit library',heading:'Edit library text',intro:'Edit and save each language independently. Saved changes are shared with all visitors.',lang:'Editing language',general:'Library introduction',title:'Title',subtitle:'Introduction',name:'Equipment name',description:'Card description',eyebrow:'Category label',save:'Save changes',cancel:'Cancel',close:'Close',ready:'Saved server content',dirty:'Unsaved changes',saving:'Saving…',saved:'Saved to server',unavailable:'Could not load the latest text.',retry:'Retry',failed:'Save failed. Your changes are preserved. Please try again.',denied:'Editing permission could not be verified. Sign in again and retry.',conflict:'Another session updated this language. Load the latest text before editing again.',reload:'Load latest text',discard:'Discard unsaved changes?',scope:'Scope: library introduction and equipment card text. Models, parts and learning tools stay unchanged.',version:'Saved version',validation:'Enter a single line of text within the length limit for every field.'},
 zh:{edit:'编辑设备库',heading:'编辑设备库文案',intro:'各语言可独立编辑并保存。保存后将对所有访客生效。',lang:'编辑语言',general:'设备库介绍',title:'标题',subtitle:'说明文字',name:'设备名称',description:'卡片说明',eyebrow:'类别标签',save:'保存修改',cancel:'取消',close:'关闭',ready:'服务器已保存的内容',dirty:'有未保存的修改',saving:'保存中…',saved:'已保存到服务器',unavailable:'无法加载最新文案。',retry:'重试',failed:'保存失败，输入内容已保留，请重试。',denied:'无法确认编辑权限，请重新登录后重试。',conflict:'其他会话已修改此语言，请加载最新内容后重新编辑。',reload:'加载最新内容',discard:'放弃未保存的修改吗？',scope:'编辑范围为设备库介绍及设备卡片文案。模型、部件和学习功能保持不变。',version:'保存版本',validation:'请为每个字段输入不超出长度限制的单行文字。'}
};
const languages={ko:'한국어',en:'English',zh:'简体中文'};
const groups=[['vacuum-example-01','01 / VACUUM'],['transfer-planned','02 / TRANSFER'],['wet-planned','03 / WET PROCESS']];
const $=s=>document.querySelector(s);
let state=null, editLocale='ko', dirty=false, saving=false, conflicted=false;
const ui=()=>copy[getLanguage()];
const owned=node=>{node.setAttribute('data-i18n-owned','');return node;};
export async function initLibraryEditor(){
  const heading=$('.catalog-title');
  owned(heading.querySelector('b')).dataset.libraryField='library.title';
  owned(heading.querySelector('span')).dataset.libraryField='library.subtitle';
  for(const [id] of groups){const card=document.querySelector(`[data-equipment="${id}"]`);for(const [selector,suffix] of [['b','name'],['small','description'],['span','eyebrow']])owned(card.querySelector(selector)).dataset.libraryField=id+'.'+suffix;}
  const tools=owned(document.createElement('div'));tools.className='library-actions';
  tools.innerHTML='<span id="library-load-status" role="status"></span><button id="library-retry" hidden></button><button id="library-edit" hidden></button>';heading.append(tools);
  const dialog=owned(document.createElement('dialog'));dialog.id='library-editor';dialog.setAttribute('aria-labelledby','library-editor-heading');
  dialog.innerHTML='<form id="library-form"><div class="library-editor-head"><div><span class="editor-kicker">SEMI LAB / CONTENT</span><h2 id="library-editor-heading"></h2></div><button type="button" id="library-close">×</button></div><p id="library-editor-intro"></p><label class="editor-language"><span id="edit-language-label"></span><select id="edit-language"><option value="ko">한국어</option><option value="en">English</option><option value="zh">简体中文</option></select></label><div id="library-fields"></div><p id="library-scope"></p><div class="library-editor-footer"><div id="library-save-status" role="status" aria-live="polite"></div><div><button type="button" id="library-reload" hidden></button><button type="button" id="library-cancel"></button><button type="submit" id="library-save" class="primary" disabled></button></div></div></form>';document.body.append(dialog);
  $('#library-edit').onclick=()=>{editLocale=getLanguage();$('#edit-language').value=editLocale;renderForm();dialog.showModal();};
  $('#library-retry').onclick=load;
  const close=()=>{if(saving)return;if(dirty&&!confirm(ui().discard))return;dialog.close();};
  $('#library-close').onclick=close;$('#library-cancel').onclick=close;
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  $('#edit-language').onchange=e=>{if(dirty&&!confirm(ui().discard)){e.target.value=editLocale;return;}editLocale=e.target.value;renderForm();};
  $('#library-fields').addEventListener('input',()=>{dirty=true;$('#library-save-status').textContent=ui().dirty;$('#library-save').disabled=saving||conflicted;});
  $('#library-form').onsubmit=save;
  $('#library-reload').onclick=async()=>{if(dirty&&!confirm(ui().discard))return;const loaded=await load();if(loaded)renderForm();};
  window.addEventListener('languagechange',()=>{renderLibrary();updateLabels();});
  updateLabels();await load();
}
function updateLabels(){const c=ui();$('#library-edit').textContent=c.edit;$('#library-retry').textContent=c.retry;$('#library-editor-heading').textContent=c.heading;$('#library-editor-intro').textContent=c.intro;$('#edit-language-label').textContent=c.lang;$('#library-scope').textContent=c.scope;$('#library-save').textContent=c.save;$('#library-cancel').textContent=c.cancel;$('#library-reload').textContent=c.reload;$('#library-close').setAttribute('aria-label',c.close);}
async function load(){
 try{const response=await fetch('/api/library',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error();const next=await response.json();if(!next.locales)throw Error();state=next;renderLibrary();$('#library-edit').hidden=!state.canEdit;$('#library-load-status').textContent='';$('#library-retry').hidden=true;return true;}
 catch{$('#library-load-status').textContent=ui().unavailable;$('#library-retry').hidden=false;$('#library-edit').hidden=true;return false;}
}
function renderLibrary(){if(!state)return;const content=state.locales[getLanguage()].fields;for(const node of document.querySelectorAll('[data-library-field]'))node.textContent=content[node.dataset.libraryField];}
function field(parent,key,label,max,value){const row=document.createElement('label');row.className='library-field';const cap=document.createElement('span');cap.textContent=label;const input=document.createElement('input');input.name=key;input.value=value;input.required=true;input.maxLength=max;input.autocomplete='off';input.dataset.field=key;const hint=document.createElement('small');hint.textContent=`≤ ${max}`;cap.append(hint);row.append(cap,input);parent.append(row);}
function renderForm(){
 updateLabels();dirty=false;conflicted=false;const c=ui(),data=state.locales[editLocale];const fields=$('#library-fields');fields.replaceChildren();
 const general=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=c.general;general.append(legend);
 field(general,'library.title',c.title,80,data.fields['library.title']);field(general,'library.subtitle',c.subtitle,180,data.fields['library.subtitle']);fields.append(general);
 for(const [id,label] of groups){const section=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=label;section.append(legend);field(section,id+'.name',c.name,80,data.fields[id+'.name']);field(section,id+'.description',c.description,180,data.fields[id+'.description']);field(section,id+'.eyebrow',c.eyebrow,50,data.fields[id+'.eyebrow']);fields.append(section);}
 $('#library-save-status').textContent=`${c.ready} · ${languages[editLocale]} · ${c.version} ${data.version}`;$('#library-reload').hidden=true;$('#library-save').disabled=true;
}
function lock(value){saving=value;$('#library-save').disabled=value||!dirty||conflicted;$('#library-cancel').disabled=value;$('#library-close').disabled=value;$('#edit-language').disabled=value;$('#library-fields').querySelectorAll('input').forEach(n=>n.disabled=value);}
async function save(event){
 event.preventDefault();if(!dirty||saving||conflicted)return;if(!$('#library-form').reportValidity())return;
 const fields=Object.fromEntries([...document.querySelectorAll('[data-field]')].map(n=>[n.dataset.field,n.value.trim()]));
 if(Object.values(fields).some(v=>!v||/[\u0000-\u001f\u007f]/.test(v))){$('#library-save-status').textContent=ui().validation;return;}
 lock(true);$('#library-save-status').textContent=ui().saving;
 try{const response=await fetch('/api/library',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:editLocale,version:state.locales[editLocale].version,fields})});
  if(!response.ok){if(response.status===409){conflicted=true;$('#library-reload').hidden=false;throw Error('conflict');}if([401,403].includes(response.status))throw Error('denied');if(response.status===400)throw Error('validation');throw Error('failed');}
  const saved=await response.json();state.locales[editLocale]={fields:saved.fields,version:saved.version,updatedAt:saved.updatedAt};dirty=false;renderLibrary();$('#library-save-status').textContent=`${ui().saved} · ${languages[editLocale]} · ${ui().version} ${saved.version}`;$('#library-cancel').textContent=ui().close;
 }catch(error){$('#library-save-status').textContent=ui()[error.message]||ui().failed;}
 finally{lock(false);}
}
