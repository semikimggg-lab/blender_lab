import {siteNavigation,emulationHref} from './site-navigation.js';
let equipmentPreview=null;
export function currentLanguage(){
 const picker=document.querySelector('#language');if(picker)return picker.value;
 const query=new URLSearchParams(location.search).get('lang');
 if(['ko','en','zh'].includes(query))return query;
 try{const value=localStorage.getItem('semi-language');if(['ko','en','zh'].includes(value))return value;}catch{}
 return 'ko';
}
export function owned(node){node.setAttribute('data-i18n-owned','');return node;}
export function renderSiteContent(fields){
 const brand=document.querySelector('header .brand');if(brand)owned(brand).textContent=fields.brand;
 const servo=!!document.querySelector('#viewport');
 const title=document.querySelector('.intro h1'),subtitle=document.querySelector('.intro p');
 if(title)owned(title).textContent=fields[servo?'servo.title':'home.title'];
 if(subtitle)owned(subtitle).textContent=fields[servo?'servo.subtitle':'home.subtitle'];
 const nav=siteNavigation(fields.navigation);(document.querySelector('header nav')||document.querySelector('header>a:not(.brand)')).replaceWith(nav);
 const catalog=document.querySelector('.catalog');if(!catalog)return;
 catalog.id='catalog';document.querySelector('.workspace').id='explorer';
 owned(document.querySelector('.catalog-title>b')).textContent=fields['library.title'];
 owned(document.querySelector('.catalog-title>span')).textContent=fields['library.subtitle'];
 const container=owned(document.querySelector('.equipment-cards'));
 equipmentPreview=document.querySelector('#equipment-preview')||equipmentPreview;const preview=equipmentPreview;
 const nodes=fields.equipment.filter(row=>row.visible).map(row=>{
  const card=document.createElement(row.href?'a':'button');card.className='equipment';card.dataset.equipment=row.id;
  if(row.href){card.href=emulationHref(row.href);if(row.href.startsWith('https:')){card.target='_blank';card.rel='noopener noreferrer';}}
  else{card.disabled=true;card.setAttribute('aria-label',row.name+' · 준비 중');}
  if(row.id==='vacuum-example-01'&&preview)card.append(preview);
  if(row.id==='servo'){
   const image=document.createElement('img');image.src='/models/servo-preview.png';image.alt='Blender 서보 모델';card.append(image);card.classList.add('servo-card');
  }
  for(const [tag,key]of [['span','eyebrow'],['b','name'],['small','description']]){const text=document.createElement(tag);text.textContent=row[key];card.append(text);}
  if(emulationHref(row.href)==='/library#explorer'){card.onclick=event=>{event.preventDefault();document.querySelector('#explorer').scrollIntoView({behavior:'smooth'});};card.classList.add('active');}
  return card;
 });
 container.replaceChildren(...nodes);
}
