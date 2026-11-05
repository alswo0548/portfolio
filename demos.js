'use strict';
const projects = {
  octv: {name:'OCTV',folder:'01-octv',note:'2026-11-04 운영 웹의 실제 녹화입니다. DEMO CCTV·위험도·경로 시나리오가 포함되어 있으며, 실제 도로의 현재 재난이나 출동 결과를 뜻하지 않습니다. 모바일 실행 영상은 아직 확보되지 않았습니다.'},
  gdq: {name:'GoodDeedQuest',folder:'02-gooddeedquest',note:'2026-10-13 원본 앱의 Expo 웹 빌드로 녹화한 로컬 데모입니다. 테스트 데이터와 클릭 표시·자막을 사용했고, LLM 대기 구간은 단축했습니다.'},
  climbing: {name:'Climbing Web',folder:'03-climbing-web',note:'2026-10-13 원본 코드를 로컬 정적 서버에서 실행한 실제 녹화입니다. 지도·로드뷰·날씨는 녹화 당시의 API 응답이며, 클릭 표시와 자막을 추가했습니다.'}
};
const demos = [
  {id:'octv-cctv',project:'octv',file:'demo_cctv',title:'CCTV 영상과 YOLO 재난 탐지',description:'N001 침수 시연 영상 위에 flood 박스·신뢰도와 수집 상태를 함께 확인합니다. 표시용 추론과 사건 생성은 별도 흐름입니다.'},
  {id:'octv-overview',project:'octv',file:'demo_overview',title:'통합관제 지도와 사건 관리',description:'지도와 P1/P2 사건 목록에서 사건을 선택하고 저장된 탐지 이미지를 확인합니다.'},
  {id:'octv-analysis',project:'octv',file:'demo_analysis',title:'외부 상황과 위험도 분석',description:'위험도·우선순위·분석 근거를 펼쳐 확인합니다. 85점·P1, 수위 2.4m·차단 차로 2개는 DEMO 설정값입니다.'},
  {id:'octv-routes',project:'octv',file:'demo_routes',title:'대응기관 추천과 후보 경로 비교',description:'기관 탭과 후보 경로를 바꾸며 지도·거리·시간·점수를 비교합니다. 미검증 통제 정보는 추가 확인 대상으로 표시합니다.'},
  {id:'gdq-community',project:'gdq',file:'01_community_algorithm',title:'커뮤니티 개인화 추천',description:'관심 카테고리·지역·최신성·반응도·신뢰도로 피드를 정렬하고, 새로고침 시 상위 게시글 순서를 순환합니다.'},
  {id:'gdq-team',project:'gdq',file:'02_team_challenge_llm',title:'팀 챌린지와 AI 팀원 추천',description:'챌린지 방을 만들고 LangGraph·GPT-4o의 추천 이유를 확인한 뒤 팀원을 초대합니다.'},
  {id:'climbing-map',project:'climbing',file:'01_gym_map_search',title:'클라이밍장 지도·로드뷰·날씨',description:'유형 필터와 키워드로 장소를 찾고, 로드뷰와 현재 날씨를 확인합니다.'},
  {id:'climbing-recommend',project:'climbing',file:'02_gym_recommend',title:'성향 설문 기반 TOP 3 추천',description:'주소와 10문항 응답으로 클라이밍장을 추천하고, 선택한 장소를 지도에서 확인합니다.'},
  {id:'climbing-players',project:'climbing',file:'03_results_chart_players',title:'선수 기록 차트와 상세 조회',description:'선수를 검색해 차트 종류를 바꾸고 선수 상세 페이지에서 필터와 정렬을 적용합니다.'}
];
const $ = id => document.getElementById(id);
const video = $('video');
let selected;
let generation = 0;
function asset(d, ext) { return `assets/${projects[d.project].folder}/${d.file}.${ext}`; }
function selectDemo() {
  generation++;
  selected = demos.find(d => d.id === location.hash.slice(1)) || demos[0];
  const project = projects[selected.project];
  video.pause();
  video.removeAttribute('src');
  video.load();
  video.hidden = true;
  $('poster').hidden = false;
  $('poster').src = asset(selected, 'jpg');
  $('poster').alt = `${project.name} — ${selected.title} 실제 화면`;
  video.poster = asset(selected, 'jpg');
  $('stage').classList.toggle('portrait', selected.project === 'gdq');
  $('play').hidden = false;
  $('status').textContent = '재생 버튼을 누르면 영상을 불러옵니다.';
  $('project-label').textContent = project.name;
  $('demo-title').textContent = selected.title;
  $('description').textContent = selected.description;
  $('note').textContent = project.note;
  $('doc').href = `https://github.com/alswo0548/portfolio/blob/main/projects/${project.folder}/README.md`;
  $('download').href = asset(selected, 'mp4');
  document.title = `${project.name} · ${selected.title} | 이민재 포트폴리오`;
  document.querySelectorAll('nav a').forEach(a => a.setAttribute('aria-current', String(a.dataset.project === selected.project)));
  $('clips').replaceChildren();
  demos.filter(d=>d.project===selected.project).forEach(d=>{
    const a=document.createElement('a'); a.className='clip';a.href=`#${d.id}`;a.setAttribute('aria-current',String(d.id===selected.id));
    const img=document.createElement('img');img.src=asset(d,'jpg');img.alt=d.title;img.loading='lazy';img.width=400;img.height=275;
    const label=document.createElement('span');label.textContent=`▶ ${d.title}`;
    a.append(img,label);$('clips').append(a);
  });
}
$('play').addEventListener('click',async()=>{
  const current = generation;
  video.src=asset(selected,'mp4');
  video.hidden=false;$('poster').hidden=true;$('play').hidden=true;
  $('status').textContent='영상을 불러오는 중입니다…';
  try { await video.play(); } catch {
    if (current === generation) $('status').textContent='재생 버튼을 다시 누르거나 MP4 다운로드로 확인해 주세요.';
  }
});
video.addEventListener('playing',()=>{$('status').textContent='재생 중 · 전체 화면으로 확대할 수 있습니다.';});
video.addEventListener('waiting',()=>{if(video.getAttribute('src')) $('status').textContent='영상을 불러오는 중입니다…';});
video.addEventListener('ended',()=>{$('status').textContent='시연이 끝났습니다. 다시 재생하거나 다른 기능을 선택해 보세요.';});
video.addEventListener('error',()=>{
  if(!video.getAttribute('src'))return;
  video.hidden=true;$('poster').hidden=false;$('play').hidden=false;
  $('status').textContent='영상을 불러오지 못했습니다. 다시 재생하거나 MP4 다운로드를 이용해 주세요.';
});
$('poster').addEventListener('error',()=>{$('status').textContent='미리보기 이미지를 불러오지 못했습니다. 시연 재생으로 확인할 수 있습니다.';});
window.addEventListener('hashchange',selectDemo);
selectDemo();
