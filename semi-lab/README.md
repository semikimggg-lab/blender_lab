# SEMI LAB

## 서보 튜닝 실험실 (/servo)

라이브러리의 서보 카드에서 엽니다. Blender에서 추출한 54개 부품을 GLB로 표시하고 전자 기어비, 위치·속도 게인, 기구 치수를 조절합니다. 안정/출렁임/헌팅 예제, 위치·오차 그래프, 재생·정지·시간 탐색, 설정 JSON 내보내기를 제공합니다. 설정은 현재 브라우저에만 저장합니다.

GLB는 Geometry Nodes를 실행하지 않습니다. 웹은 Blender와 같은 단순 제어 계산식을 240Hz로 계산하고 스크류를 웹에서 재구성합니다. 실제 Blender 서버 재평가와 장비 통신은 포함하지 않습니다. 원본은 상위 models 폴더의 servo_egear_gain_response.blend입니다. 소켓 연결은 public/models/servo-parameter-contract.json, 브라우저 계산은 src/servo/physics.js에 있습니다.

빌드 시 scripts/build-servo.mjs가 로컬 패키지를 묶으며 CDN을 사용하지 않습니다. tests/servo-blender-reference.json의 Blender 결과와 위치를 0.05mm 이내로 비교합니다. 기준 데이터는 200rpm, 웹 초기 설정은 120rpm입니다. 전자 기어비 두 배 환산, 0 이동, 짧은 이동, 범위 제한, 입력 검증도 검사합니다.

반도체 설비 인터랙티브 교육 플랫폼 첫 버전. 3D 교육 화면과 서버 저장 기반 관리자 편집 기능을 제공합니다.

## 실행

의존성 설치 후 `npm run dev`로 실행합니다. 서버는 Vinext/Cloudflare Worker, 영구 저장은 D1을 사용합니다. 로컬 데이터와 운영 데이터는 분리됩니다.

## 구현 범위

- 설비 라이브러리: 진공 공정 장비만 상세 예제로 구현. 이송·세정 장비는 준비 중.
- 전체/로드/펑션/언로드 및 계통 필터, 부품 검색과 경로 복귀.
- 3D 투영 Canvas 모델: 회전, 확대, 면 선택, 내부/분해, 치수와 이상 원통 체적.
- 교육용 레시피 단계와 관련 부품 강조. 정밀 물리 시뮬레이션 및 실제 제어 없음.
- 6개 부품의 구조·전장·원리·이해도 질문·출처·목업 설명.
- 교육용 BOM과 3D 선택 동기화, UTF-8 BOM 포함 CSV 내보내기.
- 한국어, 영어, 중국어 간체와 선택 기억. `?lang=ko`, `?lang=en`, `?lang=zh` 링크 지원.
- 부품 열람 기록은 현재 브라우저에 저장. 학습 성취 평가가 아닌 열람 표시.
- 직접 작성한 업데이트 브리핑. 이메일·자동 주간 발행 없음.

## 모듈 확장 구조

`public/content.js`가 설비 레지스트리, 부품 콘텐츠, 레시피, 출처, 변경 기록을 제공합니다. `app.js`는 공통 탐색·BOM·퀴즈·뷰어 동작을 담당하고 `i18n.js`는 번역을 담당합니다. 부품 ID는 chamber, lid, stage, pump, valve, control로 고정합니다. BOM·3D 면·레시피·교육 패널이 같은 ID를 참조합니다. 새로운 장비는 콘텐츠 모듈과 레지스트리를 추가하고 해당 형상 어댑터를 연결하는 방식으로 확장합니다. 현재 GLB 로더와 서버 어댑터는 구현하지 않았습니다.

## .blend 원본과 GLB 파생 자산

원본 .blend는 서버/관리 영역에서 보관하고 버전·해시를 관리하는 구조를 제안합니다. 현재 업로드·변환·작업 큐·스토리지는 없습니다. 브라우저 모델은 웹에서 생성한 예제이며, 기존 Blender 장면은 수정하지 않았습니다.

1. .blend에 안정적인 partId와 설비/영역/계통 메타데이터를 부여합니다.
2. Geometry Nodes 입력을 허용 목록과 범위로 검증한 후, 격리된 Blender 작업에서 평가합니다.
3. 평가 형상을 GLB로 내보냅니다. GLB는 Blender 노드 그래프를 실행하지 않습니다. 이미지 렌더링은 별도 출력입니다.
4. custom properties를 glTF extras로 내보내고 부품 ID 매핑을 검사합니다. 원본 객체와 출력 mesh가 항상 1:1이라는 가정은 피합니다.
5. 재질 호환성, 텍스처, 형상, 축과 단위, 부품 매핑을 검토한 후 버전별 GLB와 매핑 파일을 게시합니다.
6. 웹에서 완료 작업의 결과를 가져와 모델을 교체합니다.

공식 Blender 매뉴얼에서 glTF custom properties/extras, evaluated mesh, 재질 체계 차이를 확인했습니다: https://docs.blender.org/manual/en/3.3/addons/import_export/scene_gltf2.html
명세: `public/integration-contract.json`. 원본 외부 의존 파일, 지원 Blender/exporter 버전, 용량·시간 제한, 오류 처리, 접근 권한과 재생성 범위는 실제 모델 확보 후 결정합니다.

## 실물 목업

프린터 약 7억 원은 사용자 제시 도입 검토 금액이며 견적·총사업비·승인 예산이 아닙니다. 방식·재료·크기·후처리·유지비 미정. 웹 형상을 곧바로 제조 파일로 보지 않으며 벽 두께·공차·폐곡면·방향·서포트 등을 검토해야 합니다. 실제 설비 BOM과 목업 BOM은 별도로 관리해야 합니다.

## 지식 출처

- Pfeiffer Vacuum: https://www.pfeiffervacuum.com/no/en/knowledge/vacuum-technology/knowledge-book/4-vacuum-generation/
- Festo: https://www.festo.com/gb/en/c/products/actuators/pneumatic-cylinders-id_pim135
- SUNY Geneseo: https://milnepublishing.geneseo.edu/introtovacuumtech/chapter/an-introduction-to-vacuum-systems/

실제 장비별 콘텐츠와 절차는 학생·강사·설비 전문가 검수가 필요합니다.

추가 부품별 원리 자료:
- 커버의 압력·힘 관계, NASA Glenn: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aerodynamic-force/
- 진공 환경의 열전달, NASA: https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/
- 센서·구동부 I/O 연결, Siemens: https://sieportal.siemens.com/en-ph/products-services/10231390


## 관리자 문구 편집

소유자 계정으로 사이트에 로그인한 후 라이브러리의 **라이브러리 편집** 버튼을 누릅니다. 편집 언어(한국어·영어·중국어)를 선택하고 제목·소개, 장비 카드 3개의 이름·설명·분류 라벨을 수정한 뒤 저장합니다. 취소하면 미저장 변경을 버립니다. 다른 언어에는 영향을 주지 않습니다. 상세 학습 내용과 BOM 이름은 이 편집 범위에 포함되지 않습니다.

서버가 Sites의 인증 정보를 검사합니다. 최초 소유자는 서버 비밀 설정 LIBRARY_OWNER_EMAIL과 검증된 로그인 이메일로 확인하고, 첫 저장 때 사이트별 사용자 ID를 D1에 고정합니다. 이후 해당 ID만 수정할 수 있습니다. 학습자에게 편집 버튼을 표시하지 않으며 서버에서도 수정을 거부합니다. 현재 관리자 추가 화면은 제공하지 않습니다. 사이트 접근 범위는 기존 소유자 비공개 설정을 유지합니다.

언어별 문구와 버전은 library_content, 변경 이력은 content_audit, 소유자 ID는 site_admins에 저장됩니다. 저장은 한 트랜잭션으로 처리하며 오래된 버전으로 저장하면 409 충돌을 표시합니다. 같은 출처 요청만 허용하고 필드·길이·본문 크기를 검증합니다. 문구는 일반 텍스트로 표시합니다. 저장 장애 때 입력을 유지하고 재시도할 수 있습니다.

운영 배포에는 drizzle 마이그레이션이 포함됩니다. 로컬 테스트 계정과 .dev.vars는 운영 배포에 포함하지 않습니다. 정책 테스트: node --test tests/library.test.mjs.
