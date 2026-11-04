import {currentLanguage,owned,renderSiteContent} from './library-view.js';
const $=selector=>document.querySelector(selector);
let state=null,draft=null,editLocale='ko',dirty=false,saving=false,conflicted=false;
const labels={'library.title':'설비 라이브러리 제목','library.subtitle':'라이브러리 안내','brand':'상단 로고 이름','home.title':'설비 라이브러리 큰 제목','home.subtitle':'설비 라이브러리 화면 설명','servo.title':'서보 화면 큰 제목','servo.subtitle':'서보 화면 설명'};
const limits={'library.title':80,'library.subtitle':180,brand:40,'home.title':120,'home.subtitle':240,'servo.title':120,'servo.subtitle':240};
export async function initLibraryEditor(){
 if($('#library-editor'))return;
 const tools=owned(document.createElement('div'));tools.className='library-actions';
 tools.innerHTML='<a href="/" class="model-explorer-link">Blender 모델 탐색 ↗</a><span id="library-load-status" role="status"></span><button id="library-retry" hidden>다시 불러오기</button><button id="library-edit" hidden>메뉴·설비 관리</button>';
 ($('.catalog-title')||$('header')).append(tools);
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='/library-manager.css';document.head.append(sheet);
 const dialog=owned(document.createElement('dialog'));dialog.id='library-editor';dialog.setAttribute('aria-labelledby','library-editor-heading');
 dialog.innerHTML=`<form id="library-form"><div class="library-editor-head"><div><span class="editor-kicker">SEMI LAB / CONTENT</span><h2 id="library-editor-heading">메뉴·설비 관리</h2></div><button type="button" id="library-close" aria-label="닫기">×</button></div>
 <p id="library-editor-intro">이름, 제목, 연결 주소를 직접 수정하세요. 저장하면 방문자 화면에 적용됩니다.</p>
 <label class="editor-language">편집할 언어<select id="edit-language"><option value="ko">한국어</option><option value="en">English</option><option value="zh">简体中文</option></select></label>
 <p class="manager-note">언어별로 메뉴와 설비 목록을 따로 저장합니다. 다른 언어에도 표시하려면 해당 언어를 선택해 편집하세요.</p>
 <div id="library-fields"></div><p id="library-scope">주소 예시: /library#catalog (라이브러리), /library#explorer (진공 실습), /servo (서보 실습), https://… (외부 자료). 설비 주소를 비워 두면 준비 중 카드로 표시됩니다. 새 항목을 추가해도 3D 모델이나 새 페이지가 자동 생성되지는 않습니다.</p>
 <div class="library-editor-footer"><div id="library-save-status" role="status" aria-live="polite"></div><div><button type="button" id="library-reload" hidden>최신 내용 불러오기</button><button type="button" id="library-cancel">닫기</button><button type="submit" id="library-save" class="primary" disabled>변경 내용 저장</button></div></div></form>`;
 document.body.append(dialog);
 const close=()=>{if(saving)return;if(dirty&&!confirm('저장하지 않은 변경 사항을 취소할까요?'))return;dialog.close();dirty=false;};
 $('#library-close').onclick=close;$('#library-cancel').onclick=close;dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 $('#library-edit').onclick=()=>{editLocale=currentLanguage();$('#edit-language').value=editLocale;resetForm();dialog.showModal();};
 $('#library-retry').onclick=load;
 $('#edit-language').onchange=event=>{if(dirty&&!confirm('저장하지 않은 변경 사항을 취소할까요?')){event.target.value=editLocale;return;}editLocale=event.target.value;resetForm();};
 $('#library-reload').onclick=async()=>{if(dirty&&!confirm('입력한 내용을 버리고 최신 내용을 불러올까요?'))return;if(await load())resetForm();};
 $('#library-form').onsubmit=save;
 window.addEventListener('languagechange',()=>{if(state)renderSiteContent(state.locales[currentLanguage()].fields);});
 await load();
}
async function load(){
 try{
  const response=await fetch('/api/library',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error();
  const next=await response.json();if(!next.locales?.ko?.fields?.navigation)throw Error();state=next;
  renderSiteContent(state.locales[currentLanguage()].fields);$('#library-edit').hidden=!state.canEdit;$('#library-load-status').textContent='';$('#library-retry').hidden=true;return true;
 }catch{$('#library-load-status').textContent='메뉴 설정을 불러오지 못했습니다.';$('#library-retry').hidden=false;$('#library-edit').hidden=true;return false;}
}
function changed(){dirty=true;$('#library-save-status').textContent='저장하지 않은 변경 사항';$('#library-save').disabled=saving||conflicted;}
function input(parent,label,value,max,oninput,required=true){
 const row=document.createElement('label');row.className='library-field';
 const cap=document.createElement('span');cap.textContent=label;const entry=document.createElement('input');entry.value=value;entry.maxLength=max;entry.required=required;entry.autocomplete='off';
 entry.oninput=()=>{oninput(entry.value);changed();};row.append(cap,entry);parent.append(row);return entry;
}
function button(text,action,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=disabled;b.onclick=action;return b;}
function resetForm(){draft=structuredClone(state.locales[editLocale].fields);dirty=false;conflicted=false;renderForm();$('#library-reload').hidden=true;$('#library-save').disabled=true;$('#library-save-status').textContent='서버에서 불러온 내용 · 저장 버전 '+state.locales[editLocale].version;}
function renderForm(){
 const fields=$('#library-fields');fields.replaceChildren();
 const general=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent='사이트 이름과 화면 제목';general.append(legend);
 for(const [key,label]of Object.entries(labels))input(general,label,draft[key],limits[key],value=>draft[key]=value);
 fields.append(general);
 for(const [kind,title,max]of [['navigation','상단 메뉴 / 탭',10],['equipment','설비 카드',24]]){
  const section=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=title;section.append(legend);
  draft[kind].forEach((row,index)=>{
   const box=document.createElement('section');box.className='manager-item';
   const toolbar=document.createElement('div');toolbar.className='manager-toolbar';
   const name=document.createElement('b');name.textContent=(index+1)+'. '+row.name;
   const visible=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=row.visible;check.onchange=()=>{row.visible=check.checked;changed();};visible.append(check,document.createTextNode('표시'));
   const move=delta=>{[draft[kind][index],draft[kind][index+delta]]=[draft[kind][index+delta],draft[kind][index]];changed();renderForm();};
   toolbar.append(name,visible,button('↑',()=>move(-1),index===0),button('↓',()=>move(1),index===draft[kind].length-1),button('삭제',()=>{if(!confirm('이 항목을 목록에서 삭제할까요? 연결된 페이지와 모델 파일은 유지됩니다.'))return;draft[kind].splice(index,1);changed();renderForm();},draft[kind].length===1));box.append(toolbar);
   input(box,kind==='navigation'?'메뉴 이름':'설비 이름',row.name,80,value=>row.name=value);
   if(kind==='equipment'){input(box,'분류 표시',row.eyebrow,50,value=>row.eyebrow=value);input(box,'설명',row.description,180,value=>row.description=value);}
   input(box,'연결 주소',row.href,500,value=>row.href=value,kind==='navigation');section.append(box);
  });
  section.append(button('+ '+(kind==='navigation'?'메뉴':'설비')+' 추가',()=>{
   draft[kind].push({id:'item-'+crypto.randomUUID(),name:kind==='navigation'?'새 메뉴':'새 설비',href:kind==='navigation'?'/#catalog':'',visible:true,...(kind==='equipment'?{eyebrow:'NEW / EQUIPMENT',description:'준비 중 · 내용을 수정하세요'}:{})});changed();renderForm();
   const sectionIndex=kind==='navigation'?1:2; const entries=$('#library-fields').children[sectionIndex].querySelectorAll('.manager-item');entries[entries.length-1]?.scrollIntoView({block:'nearest'});
  },draft[kind].length>=max));fields.append(section);
 }
}
function lock(value){saving=value;$('#library-editor').querySelectorAll('input,select,button').forEach(node=>{if(value){node.dataset.wasDisabled=String(node.disabled);node.disabled=true;}else{node.disabled=node.dataset.wasDisabled==='true';delete node.dataset.wasDisabled;}});$('#library-save').disabled=value||!dirty||conflicted;}
async function save(event){
 event.preventDefault();if(!dirty||saving||conflicted||!$('#library-form').reportValidity())return;
 if(['navigation','equipment'].some(kind=>!draft[kind].some(row=>row.visible))){$('#library-save-status').textContent='메뉴와 설비 카드는 각각 하나 이상 표시해야 합니다.';return;}
 lock(true);$('#library-save-status').textContent='저장 중…';
 try{
  const response=await fetch('/api/library',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:editLocale,version:state.locales[editLocale].version,fields:draft})});
  if(!response.ok){
   if(response.status===409){conflicted=true;$('#library-reload').hidden=false;throw Error('다른 창에서 수정되었습니다. 최신 내용을 불러온 뒤 다시 편집하세요.');}
   if([401,403].includes(response.status))throw Error('소유자 계정으로 다시 로그인한 뒤 저장하세요.');
   if(response.status===400)throw Error('입력 길이와 연결 주소를 확인하세요. 주소는 /, # 또는 https://로 시작해야 합니다.');
   throw Error('저장하지 못했습니다. 입력 내용은 유지됩니다.');
  }
  const result=await response.json();state.locales[editLocale]={fields:result.fields,version:result.version,updatedAt:result.updatedAt};draft=structuredClone(result.fields);dirty=false;renderSiteContent(state.locales[currentLanguage()].fields);$('#library-save-status').textContent='서버 저장 완료 · 버전 '+result.version;
 }catch(error){$('#library-save-status').textContent=error.message;}
 finally{lock(false);}
}
