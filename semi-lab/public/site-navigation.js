export function emulationHref(href){
 if(href==='/#catalog'||href==='/#explorer')return '/library'+href.slice(1);
 return href;
}
export function siteNavigation(rows=[{id:'library',name:'설비 라이브러리',href:'/library',visible:true},{id:'servo',name:'서보 실습',href:'/servo',visible:true}]){
 const nav=document.createElement('nav');nav.id='site-navigation';nav.className='site-navigation';nav.setAttribute('aria-label','메인 메뉴');nav.setAttribute('data-i18n-owned','');
 const home=document.createElement('a');home.href='/';home.textContent='Blender 모델 탐색';if(['/','/explorer'].includes(location.pathname))home.setAttribute('aria-current','page');nav.append(home);
 const details=document.createElement('details');details.className='other-menu';const summary=document.createElement('summary');summary.textContent='기타 에뮬레이션';details.append(summary);
 const menu=document.createElement('div');menu.className='other-menu-items';
 const overview=document.createElement('a');overview.href='/emulations';overview.textContent='기타 에뮬레이션 전체 보기';menu.append(overview);
 for(const row of rows.filter(row=>row.visible)){
  const link=document.createElement('a');link.href=emulationHref(row.id==='library'&&row.href==='/'?'/library':row.href);link.textContent=row.name;
  if(link.href.startsWith('https:')&&new URL(link.href).origin!==location.origin){link.target='_blank';link.rel='noopener noreferrer';}
  if(new URL(link.href,location.href).pathname===location.pathname)link.setAttribute('aria-current','page');menu.append(link);
 }
 details.append(menu);nav.append(details);return nav;
}
