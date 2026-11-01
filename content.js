export const parts={
chamber:{name:'진공 챔버',en:'PROCESS CHAMBER',group:'기계',area:'function',desc:'공정 환경을 외부 대기와 분리하는 밀폐 공간입니다.',structure:'챔버 본체와 상부 플랜지, 씰이 진공 경계를 만듭니다. 내부 스테이지가 웨이퍼를 지지합니다.',electrical:'압력 센서 값을 제어기에 전달합니다. 목표 압력 도달 여부는 다음 공정 단계의 진입 조건으로 사용합니다.',principle:'같은 유효 배기 속도라면 체적이 클수록 배기에 더 긴 시간이 필요합니다. 실제 배기는 누설, 가스 방출, 배관 전도도의 영향을 받습니다.',flow:'챔버 → 배관 → 진공 펌프',q:'챔버 체적을 키우고 배기 속도를 유지하면?',answers:['배기 시간이 길어질 수 있다','항상 즉시 진공이 된다'],correct:0},
lid:{name:'상부 커버',en:'TOP COVER',group:'기계',area:'function',desc:'공정 공간을 밀폐하고 내부 정비 접근을 제공합니다.',structure:'커버와 플랜지 사이 씰이 접촉해 기밀 경계를 형성합니다. 분해 보기에서 결합 관계를 관찰하세요.',electrical:'커버 닫힘 감지 신호를 인터록 조건으로 사용할 수 있습니다. 이 예제는 실제 인터록 회로를 구현하지 않습니다.',principle:'압력 차이가 커버 면적에 작용해 힘을 만듭니다. F = Δp × A. 큰 면적에서는 작은 압력 차이도 큰 하중을 만듭니다.',flow:'커버 → 씰 → 챔버 플랜지',q:'압력 차이가 같을 때 커버 면적이 커지면?',answers:['작용력이 감소한다','작용력이 증가한다'],correct:1},
stage:{name:'웨이퍼 스테이지',en:'WAFER STAGE',group:'기계',area:'function',desc:'공정 중 웨이퍼를 일정한 위치에 지지합니다.',structure:'원형 지지판과 하부 지지축의 개념 모델입니다. 실제 가열·정전척 구조는 포함하지 않습니다.',electrical:'실제 설비는 온도 센서와 히터 제어를 사용할 수 있습니다. 예제 공정 단계에서는 스테이지를 강조합니다.',principle:'열전달은 전도·대류·복사로 일어납니다. 진공에서는 기체를 통한 열전달이 줄어 접촉 상태와 복사가 중요해집니다.',flow:'웨이퍼 → 지지판 → 지지축',q:'이 스테이지 모델의 의미는?',answers:['실제 온도를 계산하는 해석','위치와 기능을 설명하는 개념 모델'],correct:1},
pump:{name:'진공 펌프',en:'VACUUM PUMP',group:'진공',area:'function',desc:'챔버 내부의 기체를 외부로 배출합니다.',structure:'배기 포트와 하부 펌프 모듈로 표현합니다. 실제 펌프 내부 회전자는 생략했습니다.',electrical:'제어기는 펌프 운전 신호와 준비 상태를 확인합니다. 예제 배기 단계에서 펌프를 강조합니다.',principle:'유효 배기 속도는 펌프 명목 속도와 배관 전도도에 의해 제한됩니다. 1/S효과 = 1/S펌프 + 1/C.',flow:'챔버 → 밸브 → 펌프 → 배출',q:'좁고 긴 배관이 배기 성능에 미치는 영향은?',answers:['유효 배기 속도를 제한할 수 있다','항상 성능을 높인다'],correct:0},
valve:{name:'공압 게이트 밸브',en:'PNEUMATIC GATE VALVE',group:'공압',area:'load',desc:'로드부와 공정 공간 사이의 이동 통로를 열고 닫습니다.',structure:'밸브 판과 공압 액추에이터로 구성하는 개념 모델입니다. 내부 보기에서 개방 위치를 확인하세요.',electrical:'제어기 출력이 솔레노이드 밸브를 구동하고, 위치 센서 입력으로 개폐 상태를 확인합니다.',principle:'압축 공기가 피스톤 면적에 힘을 가합니다. 이상적인 추력은 F = Δp × A이며 실제 추력은 마찰과 배압의 영향을 받습니다.',flow:'PLC 출력 → 솔레노이드 → 실린더 → 게이트',q:'피스톤 면적과 압력 차이가 만드는 것은?',answers:['공압 실린더 추력','진공 펌프의 회전수'],correct:0},
control:{name:'센서·제어 모듈',en:'CONTROL & SENSOR',group:'전장',area:'unload',desc:'조건을 확인하고 다음 동작으로 이어주는 제어 계통입니다.',structure:'제어반과 상태 표시부를 단순화했습니다. 예제에서는 언로드 허가 신호를 담당합니다.',electrical:'센서 입력, 순서 로직, 구동 출력이 연결됩니다. 압력·위치 조건을 확인한 뒤 언로드를 허가하는 개념입니다.',principle:'피드백 제어는 측정값과 목표값을 비교합니다. 이 예제는 단계 전환에 따른 상태 표시이며 실제 폐루프 제어 해석은 아닙니다.',flow:'센서 입력 → 순서 로직 → 구동 출력',q:'다음 단계 진입 전 확인할 정보는?',answers:['화면의 색상만','센서 상태와 인터록 조건'],correct:1}
};
export const sources={vacuum:['Pfeiffer Vacuum · 진공 발생 및 배기 원리','https://www.pfeiffervacuum.com/no/en/knowledge/vacuum-technology/knowledge-book/4-vacuum-generation/'],pneumatic:['Festo · 공압 실린더와 추력','https://www.festo.com/gb/en/c/products/actuators/pneumatic-cylinders-id_pim135'],system:['SUNY Geneseo · 진공 시스템 교육자료','https://milnepublishing.geneseo.edu/introtovacuumtech/chapter/an-introduction-to-vacuum-systems/']};
export const recipes=[{name:'01 로딩',part:'valve',text:'공압 밸브를 개방하고 웨이퍼 진입 통로를 확보합니다. 실제 장비는 압력 평형과 위치 인터록 확인이 필요합니다.'},{name:'02 배기',part:'pump',text:'게이트를 닫고 펌프 운전을 가정합니다. 기체가 배기 포트로 이동하는 개념을 강조합니다.'},{name:'03 공정',part:'stage',text:'웨이퍼를 스테이지에 유지합니다. 설정 온도·가스 유량의 수치 해석은 포함하지 않습니다.'},{name:'04 언로드',part:'control',text:'공정 종료와 압력 복귀를 가정한 뒤 언로드 허가 신호를 표시합니다.'}];

export const equipmentRegistry=[
 {id:'vacuum-example-01',code:'01 / VACUUM',name:'진공 공정 장비',available:true,modelVersion:'example-1.0',renderer:'vacuum-procedural',partIds:Object.keys(parts)},
 {id:'transfer-planned',code:'02 / TRANSFER',name:'웨이퍼 이송 장비',available:false},
 {id:'wet-planned',code:'03 / WET PROCESS',name:'습식 세정 장비',available:false}
];
export const changeLog=[
 {id:'release-example-v1',date:'2026.10.28',status:'완료',summary:'예제 설비의 3D 탐색과 교육용 BOM을 연결했습니다.',detail:'로드·펑션·언로드 탐색, 레시피 단계 강조, 구조·전장·원리와 목업 정보, CSV 내보내기를 제공합니다.',partId:'chamber'},
 {id:'roadmap-blender',date:'다음 계획',status:'계획',summary:'실제 Blender 모델과 출력용 목업 설계는 후속 연결 대상입니다.',detail:'실제 설비 파일과 파라미터 명세를 확보한 뒤 모델 재생성, 출력 전 설계 검토 및 콘텐츠 검수를 진행합니다.',partId:'valve'}
];

sources.thermal=['NASA · 진공 환경의 열전달','https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/'];
sources.pressure=['NASA Glenn · 압력과 표면 작용력','https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aerodynamic-force/'];
sources.control=['Siemens · 센서·구동부와 I/O 연결','https://sieportal.siemens.com/en-ph/products-services/10231390'];
