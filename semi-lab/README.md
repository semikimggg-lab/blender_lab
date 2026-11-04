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

## 메뉴·설비 관리 (2026-11-04)

소유자 계정으로 접속한 뒤 홈의 라이브러리 옆 또는 서보 화면 상단의 **메뉴·설비 관리**를 엽니다.
사이트 이름, 홈/서보 제목, 라이브러리 제목과 설명, 메뉴 및 설비 카드의 이름·주소·순서·표시 여부를 변경할 수 있습니다.
메뉴는 최대 10개, 설비 카드는 최대 24개이며 언어별로 독립 저장합니다. 주소는 사이트 내부 경로(`/servo`, `/#explorer`) 또는 HTTPS URL을 사용합니다.
카드 주소를 비우면 준비 중 항목으로 표시합니다. 항목 추가는 새 3D 모델이나 페이지를 생성하지 않습니다.

기본 설정은 `lib/library-defaults.json`, 편집 UI는 `public/library-editor.js`, 공통 표시 로직은 `public/library-view.js`, 저장 API는 `app/api/library/route.ts`입니다.
이미 서버에 저장한 설정은 기본 JSON보다 우선합니다. 기존 문구 데이터는 읽을 때 새 형식으로 변환하며 다음 저장 시 새 형식으로 보관합니다.
서버 저장은 소유자 권한, 동일 출처, 입력 검증, 버전 충돌 검사와 감사 기록을 유지합니다.

## Blender GLB 모델 탐색 / 등록

`/explorer`에서 자체 포함 GLB(최대 20MB)를 미리 볼 수 있습니다. 원본 노드 계층, 애니메이션 클립, 그룹 선택과 분해 이동을 지원합니다.
소유자는 GLB를 R2에 등록하고 각 노드의 표시 이름·기능 설명·참고 URL을 D1에 저장합니다. 저장된 주소를 메뉴·설비 관리의 카드 연결 주소에 넣으세요.
메타데이터 가져오기/내보내기는 `semi-lab-parts-v1` JSON을 사용하며 노드 ID/이름/부모 계층이 같은 모델에만 적용합니다.

- 뷰어: `src/explorer/app.js`, `content/explorer.html`, `public/explorer.css`
- 검증: `lib/model-policy.mjs`, `tests/models.test.mjs`
- API: `app/api/models/`, 저장 접근: `lib/model-storage.ts`
- 내보내기 안내: `public/models/BLENDER_GLB_GUIDE.txt`
- 데모는 기능 확인용으로 별도 제작한 3그룹 GLB입니다. 사용자 파일은 포함하지 않았습니다.
- 업로드는 소유자/동일 출처 검사, 바이트 제한, GLB 내부 리소스/계층 검사를 거칩니다. 설명 저장은 버전 충돌을 검사합니다.
- 기존 모델 파일을 덮어쓰는 기능은 없습니다. 수정된 GLB는 새 모델로 등록합니다.

Blender 컬렉션은 Full Collection Hierarchy로 내보내야 노드로 나타납니다. 컬렉션 정보가 없는 GLB에서 원래 컬렉션은 복원할 수 없습니다.
부모 Empty의 partId, description, infoUrl 사용자 속성을 읽을 수 있습니다. 스키닝의 분해는 조립체 부모 그룹을 기준으로 확인하세요.
현재 Draco/Meshopt/KTX2 디코더와 실제 Geometry Nodes 서버 실행은 포함하지 않습니다.

### 컬렉션 폴더와 선택 강조

모델 탐색 목록에서 GLB에 보존된 그룹 계층을 접고 펼칠 수 있습니다. 폴더 이름은 하위 부품 전체를, 하위 파트는 해당 부품만 선택합니다.
그룹 선택·세부 파트 선택·검색 시 부모 계층 노출·전체 펼치기/접기를 지원하며, 3D 클릭은 보이는 메시의 가장 가까운 파트를 선택합니다.
선택한 메시만 원래 텍스처와 불투명 재질로 표시하고 다른 메시에는 옅은 반투명 재질을 적용합니다. 전체 모델 선택으로 원래 재질을 복원합니다.
공유 재질을 직접 변경하지 않으며 GLB 원본/서버 데이터는 바뀌지 않습니다. 애니메이션과 분해 보기에도 선택 강조가 유지됩니다.
Blender 컬렉션을 내보내지 않은 기존 GLB에는 실제 컬렉션 이름/소속을 복원할 수 없습니다. Full Collection Hierarchy로 다시 내보내세요.

애니메이션은 정지 포즈만 저장된 클립을 구분하고, 움직임이 있는 첫 클립을 기본 선택합니다. 정지 클립은 목록과 안내 문구로 표시합니다.

## 첫 화면과 저장 모델 복원

사이트 첫 화면 `/`는 Blender 모델 탐색입니다. `/explorer`도 같은 화면을 열며 저장된 모델 주소는 `/?model=<id>`를 사용합니다.
기타 에뮬레이션 `/emulations` 아래에서 설비 라이브러리 `/library`와 서보 실습 `/servo`로 이동합니다. 기존 라이브러리의 `/#catalog`, `/#explorer` 연결은 화면에서 새 경로로 보정합니다.
명시적인 모델 주소가 우선이고, 그다음 이 브라우저에서 마지막으로 열었던 저장 모델, 마지막으로 서버에서 저장/수정한 모델 순서로 불러옵니다.
사용자가 예제를 직접 선택했을 때만 예제 선택을 기억합니다. 모델 목록 로딩 실패로 예제가 임시 표시되더라도 기존 저장 모델 기억을 덮어쓰지 않습니다.
로컬 GLB 미리보기는 임시 상태입니다. 서버 보관에는 모델 저장 버튼이 필요하며 미저장 상태로 나가면 경고합니다.

## 저장 모델 카테고리·폴더 / 관리자 삭제

저장 모델은 상위 카테고리 → 하위 폴더의 2단계로 관리합니다. 기존 모델은 미분류에 유지합니다.
관리자는 카테고리·폴더 관리에서 이름을 추가/변경하고, 모델 편집 영역의 저장할 폴더를 지정한 뒤 모델 정보·설명 저장으로 이동합니다.
새 GLB 등록도 폴더를 지정해 서버에 저장할 수 있습니다. 파일 선택 버튼의 표시 이름은 내 .glb 새로등록입니다.

삭제/복원과 폴더 관리는 서버의 `site_admins`에서 owner/admin 역할로 확인된 사용자 및 기존 소유자 초기 연결 정책에만 허용합니다.
삭제 API는 동일 출처 및 모델 버전을 확인합니다. 삭제는 휴지통 이동이며 서버 파일과 설명은 보존됩니다. 일반 목록/모델 조회에서는 제외하고 관리자만 휴지통에서 복원할 수 있습니다.
영구 삭제와 자동 정리 정책은 추가하지 않았습니다. 이 변경은 관리자 역할을 임의로 부여하거나 사이트 공유 범위를 변경하지 않습니다.

스키마: `model_folders`, 모델의 nullable `folder_id`/`deleted_at`. 로컬 미리보기에는 0002 마이그레이션을 적용합니다.
API: `/api/model-folders`, `/api/model-folders/:id`, `DELETE /api/models/:id`, `/api/models/trash`.
