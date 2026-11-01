const dictionary={};
const rows=`교육 실험실|Learning lab|学习实验室
장비 탐색|Equipment explorer|设备探索
인터랙티브 학습|Interactive learning|交互式学习
장비를 열고, 원리를 발견하세요.|Explore the equipment. Understand the principles.|探索设备，理解原理。
전체 설비에서 작은 부품까지. 직접 조작하며 연결된 원리를 이해합니다.|From complete systems to individual components. Explore how each part works.|从整机到零部件，通过操作理解相互关联的原理。
학습 가이드 ↗|Learning guide ↗|学习指南 ↗
설비 라이브러리|Equipment library|设备库
설비를 선택해 학습을 시작하세요|Choose equipment to begin|选择设备开始学习
진공 공정 장비|Vacuum process system|真空工艺设备
웨이퍼 이송 장비|Wafer transfer system|晶圆传输设备
습식 세정 장비|Wet cleaning system|湿法清洗设备
예제 모델 · 탐색 가능 ↗|Example model · Explore ↗|示例模型 · 开始探索 ↗
준비 중 · 모델 미연결|Coming soon · No model connected|准备中 · 尚未连接模型
설비 구성|Equipment structure|设备结构
부품 검색|Search components|搜索部件
설비 영역|Equipment area|设备区域
전체 설비|Complete system|整机
로드부|Load area|上料区
펑션부 · 공정/기능|Process / function area|工艺／功能区
언로드부|Unload area|下料区
계통|Subsystem|子系统
전체 계통|All subsystems|全部子系统
공압|Pneumatics|气动
전장|Electrical|电气
기계|Mechanical|机械
진공|Vacuum|真空
교육용 예제|Educational example|教学示例
진공 챔버|Vacuum chamber|真空腔体
상부 커버|Top cover|上盖
웨이퍼 스테이지|Wafer stage|晶圆载台
진공 펌프|Vacuum pump|真空泵
공압 게이트 밸브|Pneumatic gate valve|气动闸阀
센서·제어 모듈|Sensor & control module|传感与控制模块
선택한 부품을 3D에서 확인하세요|Inspect the selected component in 3D|在3D视图中查看所选部件
진공 시스템의 이해|Understanding vacuum systems|理解真空系统
개념 학습용 가상 장비입니다.|Virtual equipment for conceptual learning.|用于原理学习的虚拟设备。
실제 제품의 설계·작업 지침과 다릅니다.|Actual product designs and procedures differ.|实际产品的设计和操作流程可能不同。
전체 보기|Complete view|整体视图
내부 보기|Inside view|内部视图
분해 보기|Exploded view|分解视图
↻ 초기화|↻ Reset|↻ 重置
● 실시간 3D|● Interactive 3D|● 交互式3D
진공 공정 챔버 · 개념 모델|Vacuum chamber · Concept model|真空工艺腔体 · 概念模型
드래그 회전|Drag to rotate|拖动旋转
스크롤 확대|Scroll to zoom|滚轮缩放
부품 클릭 선택|Click a component|点击选择部件
형상 파라미터|Geometry parameters|几何参数
브라우저 즉시 반영|Updates in browser|浏览器即时更新
챔버 내경|Chamber diameter|腔体内径
챔버 높이|Chamber height|腔体高度
분해 거리|Explosion distance|分解距离
이상 원통 내부 체적|Ideal cylinder volume|理想圆柱体积
내부 부품·벽 두께 제외|Excludes internals and wall thickness|不含内部部件和壁厚
부품 인사이트|Component insights|部件解析
구조|Structure|结构
기계 원리|Physics|物理原理
구조와 연결|Structure & connections|结构与连接
신호와 동작|Signals & operation|信号与动作
과학적·물리적 원리|Scientific & physical principles|科学与物理原理
현재 레시피|Current recipe step|当前配方步骤
선택 부품 반응|Component response|部件响应
이 단계에서 강조|Highlighted in this step|此步骤中高亮
대기 / 전체 관계 확인|Standby / Inspect context|待机／查看整体关系
관련 지식 ↗|Related resources ↗|相关知识 ↗
Pfeiffer Vacuum · 진공 발생 및 배기 원리|Pfeiffer Vacuum · Vacuum generation (English)|Pfeiffer Vacuum · 真空产生与抽气原理（英文）
Festo · 공압 실린더와 추력|Festo · Pneumatic cylinders and force (English)|Festo · 气缸与推力（英文）
SUNY Geneseo · 진공 시스템 교육자료|SUNY Geneseo · Vacuum systems (English)|SUNY Geneseo · 真空系统教材（英文）
정답입니다. 부품의 역할과 연결해 기억하세요.|Correct. Connect this principle to the component's role.|回答正确。请将此原理与部件的作用联系起来。
다시 생각해 보세요. 위의 원리 설명을 확인하세요.|Try again. Review the explanation above.|请再想一想，并查看上方的原理说明。
공정 레시피 반응|Process recipe response|工艺配方响应
교육용 단계 예제|Educational sequence|教学步骤示例
01 로딩|01 Loading|01 上料
02 배기|02 Pump-down|02 抽气
03 공정|03 Processing|03 工艺
04 언로드|04 Unloading|04 下料
공압 밸브를 개방하고 웨이퍼 진입 통로를 확보합니다. 실제 장비는 압력 평형과 위치 인터록 확인이 필요합니다.|The pneumatic valve opens for wafer loading. Real equipment requires pressure equalization and position interlocks.|气动阀开启以提供晶圆进入通道。实际设备需要检查压力平衡和位置联锁。
게이트를 닫고 펌프 운전을 가정합니다. 기체가 배기 포트로 이동하는 개념을 강조합니다.|The gate closes and pump operation is assumed. The pump is highlighted to explain gas removal.|假设闸阀关闭并启动真空泵，突出显示气体经抽气口排出的概念。
웨이퍼를 스테이지에 유지합니다. 설정 온도·가스 유량의 수치 해석은 포함하지 않습니다.|The wafer remains on the stage. Temperature and gas-flow analysis are not included.|晶圆保持在载台上。此示例不包含温度和气体流量的数值分析。
공정 종료와 압력 복귀를 가정한 뒤 언로드 허가 신호를 표시합니다.|After assumed process completion and pressure recovery, an unload permission signal is shown.|假设工艺结束且压力恢复后，显示下料许可信号。
공정 환경을 외부 대기와 분리하는 밀폐 공간입니다.|A sealed space separating the process environment from ambient air.|将工艺环境与外部大气隔离的密闭空间。
챔버 본체와 상부 플랜지, 씰이 진공 경계를 만듭니다. 내부 스테이지가 웨이퍼를 지지합니다.|The chamber body, top flange and seal form the vacuum boundary. The internal stage supports the wafer.|腔体、顶部法兰和密封件构成真空边界，内部载台支撑晶圆。
압력 센서 값을 제어기에 전달합니다. 목표 압력 도달 여부는 다음 공정 단계의 진입 조건으로 사용합니다.|Pressure readings are sent to the controller. Reaching the target pressure can permit the next process step.|压力传感器向控制器发送测量值。达到目标压力可作为进入下一工艺步骤的条件。
같은 유효 배기 속도라면 체적이 클수록 배기에 더 긴 시간이 필요합니다. 실제 배기는 누설, 가스 방출, 배관 전도도의 영향을 받습니다.|At the same effective pumping speed, a larger volume takes longer to evacuate. Leaks, outgassing and pipe conductance affect real pump-down.|有效抽速相同时，体积越大，抽气所需时间越长。实际抽气还受泄漏、放气和管道流导影响。
챔버 → 배관 → 진공 펌프|Chamber → Pipe → Vacuum pump|腔体 → 管道 → 真空泵
챔버 체적을 키우고 배기 속도를 유지하면?|What happens if chamber volume increases at the same pumping speed?|腔体体积增大且抽速不变时会怎样？
배기 시간이 길어질 수 있다|Pump-down can take longer|抽气时间可能变长
항상 즉시 진공이 된다|Vacuum is always reached instantly|总能立即达到真空
공정 공간을 밀폐하고 내부 정비 접근을 제공합니다.|Seals the process space and provides maintenance access.|密封工艺空间，并提供内部维护入口。
커버와 플랜지 사이 씰이 접촉해 기밀 경계를 형성합니다. 분해 보기에서 결합 관계를 관찰하세요.|The seal between cover and flange forms a gas-tight boundary. Inspect their assembly in exploded view.|上盖和法兰之间的密封件形成气密边界。可在分解视图中观察装配关系。
커버 닫힘 감지 신호를 인터록 조건으로 사용할 수 있습니다. 이 예제는 실제 인터록 회로를 구현하지 않습니다.|A cover-closed signal can be an interlock condition. This example does not implement a real interlock circuit.|上盖关闭信号可作为联锁条件。本示例未实现实际联锁电路。
압력 차이가 커버 면적에 작용해 힘을 만듭니다. F = Δp × A. 큰 면적에서는 작은 압력 차이도 큰 하중을 만듭니다.|Pressure difference acts on the cover area to produce force: F = Δp × A. A large area can experience a large load even at a small pressure difference.|压差作用在上盖面积上产生力：F = Δp × A。面积较大时，较小压差也可能产生较大载荷。
커버 → 씰 → 챔버 플랜지|Cover → Seal → Chamber flange|上盖 → 密封件 → 腔体法兰
압력 차이가 같을 때 커버 면적이 커지면?|At the same pressure difference, what does a larger cover area do?|压差相同时，上盖面积增大会怎样？
작용력이 감소한다|Force decreases|作用力减小
작용력이 증가한다|Force increases|作用力增大
공정 중 웨이퍼를 일정한 위치에 지지합니다.|Supports the wafer at a defined position during processing.|在工艺过程中将晶圆支撑在固定位置。
원형 지지판과 하부 지지축의 개념 모델입니다. 실제 가열·정전척 구조는 포함하지 않습니다.|A concept model of a circular support plate and shaft. Actual heating and electrostatic chuck structures are not included.|圆形支撑板及支撑轴的概念模型，不包含实际加热和静电吸盘结构。
실제 설비는 온도 센서와 히터 제어를 사용할 수 있습니다. 예제 공정 단계에서는 스테이지를 강조합니다.|Real systems may use temperature sensors and heater control. This example highlights the stage during processing.|实际设备可采用温度传感器和加热控制。此示例在工艺步骤中高亮载台。
열전달은 전도·대류·복사로 일어납니다. 진공에서는 기체를 통한 열전달이 줄어 접촉 상태와 복사가 중요해집니다.|Heat transfers by conduction, convection and radiation. Reduced gas heat transfer in vacuum makes contact conditions and radiation important.|热传递包括传导、对流和辐射。真空中气体传热减少，接触状态和辐射变得重要。
웨이퍼 → 지지판 → 지지축|Wafer → Support plate → Shaft|晶圆 → 支撑板 → 支撑轴
이 스테이지 모델의 의미는?|What does this stage model represent?|此载台模型表示什么？
실제 온도를 계산하는 해석|An analysis of actual temperature|实际温度分析
위치와 기능을 설명하는 개념 모델|A concept model of position and function|解释位置和功能的概念模型
챔버 내부의 기체를 외부로 배출합니다.|Removes gas from the chamber.|将腔体内部气体排出。
배기 포트와 하부 펌프 모듈로 표현합니다. 실제 펌프 내부 회전자는 생략했습니다.|Shown as an exhaust port and lower pump module. The actual internal rotor is omitted.|以抽气口和下部泵模块表示，省略实际泵内部转子。
제어기는 펌프 운전 신호와 준비 상태를 확인합니다. 예제 배기 단계에서 펌프를 강조합니다.|The controller checks pump run and ready signals. The pump is highlighted during the pump-down step.|控制器检查泵的运行和就绪信号，抽气步骤中高亮真空泵。
유효 배기 속도는 펌프 명목 속도와 배관 전도도에 의해 제한됩니다. 1/S효과 = 1/S펌프 + 1/C.|Effective pumping speed is limited by nominal pump speed and pipe conductance: 1/Seff = 1/Spump + 1/C.|有效抽速受泵的额定抽速和管道流导限制：1/Seff = 1/Spump + 1/C。
챔버 → 밸브 → 펌프 → 배출|Chamber → Valve → Pump → Exhaust|腔体 → 阀门 → 泵 → 排气
좁고 긴 배관이 배기 성능에 미치는 영향은?|How can a narrow, long pipe affect pump-down?|细长管道会怎样影响抽气性能？
유효 배기 속도를 제한할 수 있다|It can limit effective pumping speed|可能限制有效抽速
항상 성능을 높인다|It always improves performance|总能提高性能
로드부와 공정 공간 사이의 이동 통로를 열고 닫습니다.|Opens and closes the transfer path between loading and processing areas.|开启和关闭上料区与工艺空间之间的传输通道。
밸브 판과 공압 액추에이터로 구성하는 개념 모델입니다. 내부 보기에서 개방 위치를 확인하세요.|A concept model of a valve plate and pneumatic actuator. Inspect the open position in inside view.|由阀板和气动执行器组成的概念模型。可在内部视图中查看开启位置。
제어기 출력이 솔레노이드 밸브를 구동하고, 위치 센서 입력으로 개폐 상태를 확인합니다.|A controller output drives the solenoid valve. Position sensor inputs confirm the open or closed state.|控制器输出驱动电磁阀，通过位置传感器输入确认开关状态。
압축 공기가 피스톤 면적에 힘을 가합니다. 이상적인 추력은 F = Δp × A이며 실제 추력은 마찰과 배압의 영향을 받습니다.|Compressed air applies force over the piston area. Ideal force is F = Δp × A; friction and back pressure affect actual force.|压缩空气作用在活塞面积上产生力。理想推力为F = Δp × A，实际推力受摩擦和背压影响。
PLC 출력 → 솔레노이드 → 실린더 → 게이트|PLC output → Solenoid → Cylinder → Gate|PLC输出 → 电磁阀 → 气缸 → 闸板
피스톤 면적과 압력 차이가 만드는 것은?|What do piston area and pressure difference produce?|活塞面积和压差产生什么？
공압 실린더 추력|Pneumatic cylinder force|气缸推力
진공 펌프의 회전수|Vacuum pump speed|真空泵转速
조건을 확인하고 다음 동작으로 이어주는 제어 계통입니다.|Checks conditions and enables the next operation.|检查条件并允许进入下一动作的控制系统。
제어반과 상태 표시부를 단순화했습니다. 예제에서는 언로드 허가 신호를 담당합니다.|A simplified control cabinet and status display. It represents unload permission in this example.|简化的控制柜和状态显示模块，在此示例中表示下料许可。
센서 입력, 순서 로직, 구동 출력이 연결됩니다. 압력·위치 조건을 확인한 뒤 언로드를 허가하는 개념입니다.|Sensor inputs connect to sequence logic and actuator outputs. Pressure and position conditions conceptually permit unloading.|传感器输入连接顺序逻辑和驱动输出，概念上在检查压力和位置条件后允许下料。
피드백 제어는 측정값과 목표값을 비교합니다. 이 예제는 단계 전환에 따른 상태 표시이며 실제 폐루프 제어 해석은 아닙니다.|Feedback control compares measured and target values. This example shows sequence states rather than closed-loop analysis.|反馈控制比较测量值与目标值。此示例显示步骤切换状态，未进行实际闭环控制分析。
센서 입력 → 순서 로직 → 구동 출력|Sensor input → Sequence logic → Actuator output|传感器输入 → 顺序逻辑 → 驱动输出
다음 단계 진입 전 확인할 정보는?|What should be checked before the next step?|进入下一步骤前应检查什么？
화면의 색상만|Only the screen color|仅屏幕颜色
센서 상태와 인터록 조건|Sensor states and interlock conditions|传感器状态和联锁条件
전체 설비의 연결 관계를 살펴보고 부품을 선택해 학습하세요.|Explore system connections and choose a component to learn more.|查看整机连接关系，选择部件深入学习。
예제 설비는 로드부, 펑션부, 언로드부로 나눕니다. 각 영역의 계통과 부품을 선택해 구조와 동작을 확인하세요.|The example has loading, processing and unloading areas. Choose their subsystems and components to inspect structure and operation.|示例设备分为上料区、工艺区和下料区。选择各区域的子系统和部件查看结构与动作。
입력 센서와 제어 로직이 구동 출력을 연결합니다. 부품을 선택하면 해당 계통의 역할을 확인할 수 있습니다.|Input sensors and control logic connect to actuator outputs. Select a component to inspect its role.|输入传感器和控制逻辑连接驱动输出。选择部件可查看其在系统中的作用。
외부와 밀폐된 챔버에서 펌프가 기체를 배출합니다. 공압 밸브는 압축 공기의 힘으로 이동 통로를 제어합니다.|A pump removes gas from the sealed chamber. A pneumatic valve uses compressed air to control the transfer path.|泵将密闭腔体中的气体排出。气动阀利用压缩空气的力控制传输通道。
로드부 → 펑션부 → 언로드부|Loading → Processing → Unloading|上料区 → 工艺区 → 下料区
레시피 반응 표시는 어떤 기능인가요?|What does the recipe response display represent?|配方响应显示表示什么？
실제 장비 제어|Actual equipment control|实际设备控制
교육용 단계 동작 예시|Educational sequence example|教学步骤动作示例
조건에 맞는 부품이 없습니다.|No components match these filters.|没有符合筛选条件的部件。
Blender에서 웹까지, 하나의 학습 흐름|Connect Blender models to web learning|将Blender模型连接到网页学习
현재 모델은 웹 생성 예제입니다. 실제 GLB 모델과 Geometry Nodes 재생성 서버를 연결할 수 있습니다.|This model is generated in the browser. Real GLB assets and a Geometry Nodes server can be connected later.|当前为浏览器生成的示例模型，后续可连接实际GLB模型和Geometry Nodes再生成服务器。
연동 구조 확인 ↗|Integration architecture ↗|查看连接架构 ↗
탐색 → 조작 → 이해|Explore → Interact → Understand|探索 → 操作 → 理解
시점 및 파라미터 초기화|Reset view and parameters|重置视角和参数
닫기|Close|关闭
부품 이해하기|Explore component|了解部件`;
for(const row of rows.split('\n')){const [ko,en,zh]=row.split('|');dictionary[ko]={en,zh};}
const extraRows='▾\u3000진공 공정 장비|▾ Vacuum process system|▾ 真空工艺设备\n3D 개념 모델 · 실제 Blender 데이터 미연결|3D concept model · Blender data not connected|3D概念模型 · 尚未连接Blender数据\n드래그로 회전, 휠로 확대, 부품 클릭으로 선택하는 3D 예제 장비|3D example: drag to rotate, scroll to zoom, click to select parts|3D示例设备：拖动旋转，滚轮缩放，点击选择部件\n실물 목업|Physical mockup|实体模型\n디지털 모델 ↔ 실물 목업 자료|Digital model ↔ Physical mockup resources|数字模型 ↔ 实体模型资料\n목업 교육 활용|Mockup learning purpose|实体模型教学用途\n챔버와 플랜지의 결합 및 밀폐 경계 관찰|Inspect chamber–flange assembly and the sealing boundary|观察腔体与法兰的装配及密封边界\n커버·씰의 결합 순서와 정비 접근 관찰|Inspect cover and seal assembly and maintenance access|观察上盖与密封件的装配顺序和维护入口\n웨이퍼 지지 위치와 내부 간섭 관찰|Inspect wafer support position and internal clearances|观察晶圆支撑位置和内部干涉\n배기 포트 연결과 설비 배치 이해|Understand exhaust connections and equipment layout|理解抽气口连接及设备布局\n게이트 개폐와 공압 구동 관계 설명|Explain gate motion and pneumatic actuation|解释闸板开关与气动驱动的关系\n센서·제어기·구동부의 신호 관계 설명|Explain signals between sensors, controller and actuators|解释传感器、控制器与驱动部件之间的信号关系\n디지털 부품과 실물 목업을 같은 부품 ID로 연결|Link digital components and mockups with stable part IDs|用一致的部件ID连接数字部件与实体模型\n출력 준비 상태|Print readiness|打印准备状态\n미검토 · 제조용 파일 없음|Not reviewed · No manufacturing file|未审核 · 无制造文件\n축척 / 분할 / 조립|Scale / Segmentation / Assembly|比例／分段／装配\n목적·출력 크기 확정 후 설계|Design after purpose and print size are defined|确定用途和打印尺寸后设计\n웹 표시 형상과 출력 가능 형상은 별도로 검토합니다. 벽 두께·공차·폐곡면·출력 방향·서포트와 재료·후처리를 확인해야 합니다.|Display geometry needs a separate printability review covering wall thickness, tolerances, watertightness, orientation, supports, material and post-processing.|网页显示几何需要单独进行可打印性审核，检查壁厚、公差、封闭性、打印方向、支撑、材料和后处理。\n실물 목업은 구조·조립 교육을 위한 계획이며 실제 장비의 작동 부품으로 검증하지 않았습니다.|Physical mockups are planned for structure and assembly learning. They are not validated operational equipment parts.|实体模型计划用于结构和装配教学，尚未作为实际设备的工作部件进行验证。\n웹 3D 모델을 바로 제조용 파일로 사용해도 될까요?|Can a web 3D model be used directly for manufacturing?|网页3D模型可以直接用作制造文件吗？\n출력 전 별도 설계 검토가 필요하다|A separate design review is required before printing|打印前需要单独进行设计审核\n웹에 보이면 항상 출력 가능하다|Anything visible on the web is printable|只要网页能显示就可以打印\n정답입니다. 출력 방식과 재료에 맞춘 검토가 필요합니다.|Correct. Review the design for the print process and material.|回答正确。需要针对打印工艺和材料进行审核。\n벽 두께·공차·폐곡면 등 출력 조건을 먼저 확인하세요.|First review wall thickness, tolerances and watertightness.|请先检查壁厚、公差、封闭性等打印条件。\n화면 속 부품을, 손으로 배우는 구조로|Learn the structure through physical mockups|通过实体模型动手学习结构\n인터랙티브 학습과 실물 목업의 구조·조립 실습을 같은 부품 ID로 연결하는 교육 확장 계획입니다.|A proposed learning extension connecting interactive content to physical structure and assembly practice through shared part IDs.|通过相同的部件ID，将交互式学习与实体模型结构和装配实训连接起来的教学扩展计划。\n출력용 설계 검토 → 파일럿 목업 → 조립 실습|Print design review → Pilot mockup → Assembly practice|打印设计审核 → 试点实体模型 → 装配实训\n프린터 방식·재료·빌드 크기·후처리 및 유지비 미정. 현재 출력 파일 및 준비 검증은 제공하지 않습니다.|Printer process, material, build size, post-processing and operating costs remain undefined. No print files or readiness validation are provided.|打印方式、材料、成型尺寸、后处理和维护费用尚未确定。当前不提供打印文件或准备状态验证。\n사용자 제시 장비 도입 검토 금액: 약 7억 원 · 확정 견적·총사업비·승인 예산 아님|User-stated printer acquisition estimate: about KRW 700 million. Not a confirmed quote, total project cost or approved budget.|用户提出的打印设备引进评估金额：约7亿韩元。并非正式报价、项目总费用或已批准预算。\n조작하며 이해하는 교육 콘텐츠|Learn through interaction|通过交互理解设备\n홈에서 설비를 선택합니다. 현재 진공 공정 장비만 예제로 제공합니다.|Choose equipment from the library. Only the vacuum process system is currently available as an example.|从设备库选择设备。目前仅提供真空工艺设备示例。\n로드부·펑션부·언로드부와 계통을 골라 부품을 탐색합니다.|Choose loading, processing or unloading areas and a subsystem to find parts.|选择上料区、工艺区或下料区及子系统来探索部件。\n3D 부품을 선택하고 내부·분해 보기와 치수 슬라이더를 조작합니다.|Select 3D parts and try inside view, exploded view and dimension sliders.|选择3D部件，尝试内部视图、分解视图和尺寸滑块。\n레시피 단계를 누르면 관련 부품과 역할이 강조됩니다.|Select a recipe step to highlight its component and role.|选择配方步骤，高亮显示相关部件及其作用。\n구조·전장·기계 원리와 출처를 살펴보고 이해도 질문을 풀어 보세요.|Review structure, electrical systems, physics and sources, then try the knowledge check.|查看结构、电气、物理原理和来源，再完成知识问答。\n마우스와 터치를 지원하며 작은 화면에서는 패널을 세로로 배치합니다. 레시피는 교육용 예제이며 실제 장비 실행이나 정밀 해석을 수행하지 않습니다.|Mouse and touch are supported. Panels stack on smaller screens. Recipes are educational examples and do not control equipment or perform precise analysis.|支持鼠标和触摸操作，小屏幕采用纵向布局。配方是教学示例，不控制实际设备，也不进行精密分析。\n실제 Blender 연결 구조|Blender integration architecture|Blender连接架构\n현재: 외부 라이브러리 없이 웹에서 생성한 3D 예제입니다. 기존 Blender 장면은 수정하지 않았습니다.|Current state: a browser-generated 3D example with no external libraries. The existing Blender scene is unchanged.|当前为不依赖外部库的浏览器3D示例，未修改现有Blender场景。\n웹 즉시 변화: 카메라, 분해 위치, 가시성, 예제 챔버 치수.|Browser updates: camera, exploded positions, visibility and example chamber dimensions.|浏览器即时变化：相机、分解位置、可见性和示例腔体尺寸。\n서버 재생성: 실제 노드 연산, 불리언, 토폴로지 변경. 연결 명세는 소스의 integration-contract.json에 있습니다.|Server regeneration: actual node evaluation, Boolean operations and topology changes. See integration-contract.json for the proposed contract.|服务器再生成：实际节点运算、布尔运算和拓扑变化。连接规范见integration-contract.json。\n연동 계약 내려받기|Download integration contract|下载连接规范\n교육용 BOM|Educational BOM|教学BOM\n부품명세와 학습 자료를 하나의 ID로 연결합니다.|Link the parts list and learning resources through one ID.|通过统一ID连接部件清单与学习资料。\n예제 BOM · v1.0|Example BOM · v1.0|示例BOM · v1.0\nCSV 내보내기|Export CSV|导出CSV\n부품 번호|Part number|部件编号\n부품 명칭|Component name|部件名称\n상위 조립체|Parent assembly|上级装配体\n수량|Quantity|数量\n분류|Category|分类\n모델 버전|Model version|模型版本\n교육자료|Learning resources|学习资料\n목업 상태|Mockup status|实体模型状态\n설계 검토 필요|Design review required|需要设计审核\n구조·전장·원리|Structure / Electrical / Physics|结构／电气／原理\n교육용 예제 명세입니다. 실제 제조 BOM이 아닙니다. 목업 BOM은 축척·분할·조립 설계 후 수량을 별도로 확정합니다.|This is an educational example, not a manufacturing BOM. Mockup BOM quantities must be defined separately after scale, segmentation and assembly design.|这是教学示例清单，并非实际制造BOM。实体模型BOM的数量需在比例、分段和装配设计后另行确定。\n예제 설비 조립체|Example system assembly|示例设备装配体\n상세 보기 ↗|View details ↗|查看详情 ↗\n로드부 조립체|Load assembly|上料区装配体\n펑션부 조립체|Process assembly|工艺区装配体\n언로드부 조립체|Unload assembly|下料区装配体\n공유 부품 ID로 3D 선택·레시피·교육·목업 연결|Shared part IDs link 3D selection, recipes, learning and mockups|共享部件ID连接3D选择、配方、学习与实体模型\n업데이트 브리핑|Update briefing|更新简报\n변경 기록에서 확인하는 플랫폼의 현재와 다음 단계|Current progress and next steps from the change log|通过变更记录了解当前进展和下一步\n완료|Completed|已完成\n계획|Planned|计划中\n예제 설비의 3D 탐색과 교육용 BOM을 연결했습니다.|The example 3D explorer is connected to its educational BOM.|已将示例3D设备探索与教学BOM连接。\n로드·펑션·언로드 탐색, 레시피 단계 강조, 구조·전장·원리와 목업 정보, CSV 내보내기를 제공합니다.|Includes area navigation, recipe-step highlighting, structure and electrical explanations, physics, mockup information and CSV export.|提供区域导航、配方步骤高亮、结构和电气说明、物理原理、实体模型信息及CSV导出。\n실제 Blender 모델과 출력용 목업 설계는 후속 연결 대상입니다.|Real Blender assets and printable mockup designs are planned integrations.|实际Blender模型和可打印实体模型设计计划后续连接。\n실제 설비 파일과 파라미터 명세를 확보한 뒤 모델 재생성, 출력 전 설계 검토 및 콘텐츠 검수를 진행합니다.|Model regeneration, print design review and content review will follow acquisition of real equipment assets and parameter specifications.|获取实际设备文件和参数规范后，将进行模型再生成、打印设计审核和内容审校。\n관련 부품 열기 ↗|Open related component ↗|打开相关部件 ↗\n현재는 직접 작성한 변경 기록입니다. 자동 주간 발행·구독 이메일은 후속 계획이며 발송하지 않습니다.|These are manually authored change records. Automated weekly publishing and subscription emails are future plans. No emails are sent.|当前为手动编写的变更记录。自动周报发布和订阅邮件属于后续计划，当前不发送邮件。\n현재 위치|Current location|当前位置\n전체 설비로 돌아가기|Back to complete system|返回整机\n설비를 선택한 뒤 아래 탐색 화면에서 부품을 눌러 시작하세요.|Choose equipment, then select a component in the explorer below.|选择设备后，在下方探索界面中选择部件开始学习。\n';
for(const row of extraRows.split('\n')){const [ko,en,zh]=row.split('|');if(ko&&en&&zh)dictionary[ko]={en,zh};}
dictionary["설비 / 영역 / 계통 / 부품 ID\n    ↕ GLB 객체 이름 + 콘텐츠 데이터\n웹 파라미터 입력\n    ↓ 허용 범위 검증 API [미구현]\n작업 큐 → Blender Geometry Nodes 평가 [미구현]\n    ↓ GLB 출력·버전 저장 [미구현]\n결과 모델 URL → 웹 모델 교체 [미구현]"]={"en": "Equipment / Area / Subsystem / Part ID\n    ↕ GLB object names + content data\nWeb parameter input\n    ↓ Validation API [not implemented]\nJob queue → Blender Geometry Nodes [not implemented]\n    ↓ GLB export and version storage [not implemented]\nResult URL → Web model replacement [not implemented]", "zh": "设备／区域／子系统／部件ID\n    ↕ GLB对象名称与内容数据\n网页参数输入\n    ↓ 范围校验API［未实现］\n任务队列 → Blender Geometry Nodes［未实现］\n    ↓ GLB导出与版本存储［未实现］\n结果模型URL → 网页模型替换［未实现］"};
dictionary[".blend 원본은 서버·관리 영역에서 보관하고, 웹에는 파생 GLB를 표시합니다. 이미지 렌더링과 GLB 내보내기는 별도 과정입니다."]={"en": "The .blend source stays in the private admin/server area. The web displays a derived GLB. Image rendering and GLB export are separate processes.", "zh": ".blend原文件保存在私有管理或服务器区域，网页显示派生的GLB。图像渲染与GLB导出是不同的过程。"};
dictionary["GLB는 Geometry Nodes를 실행하지 않습니다. 원본 노드 평가 후 GLB를 다시 내보내고 부품 ID·버전과 함께 교체합니다."]={"en": "GLB does not execute Geometry Nodes. Evaluate the source nodes in Blender, re-export the GLB, then replace it with its part IDs and version.", "zh": "GLB不执行Geometry Nodes。需在Blender中求值原始节点，再导出GLB，并连同部件ID和版本一起替换。"};
dictionary["Blender 공식 glTF 내보내기 문서 ↗"]={"en": "Official Blender glTF export documentation ↗", "zh": "Blender官方glTF导出文档 ↗"};
dictionary["NASA · 진공 환경의 열전달"]={"en": "NASA · Heat transfer in vacuum (English)", "zh": "NASA · 真空环境中的传热（英文）"};
dictionary["NASA Glenn · 압력과 표면 작용력"]={"en": "NASA Glenn · Pressure and surface force (English)", "zh": "NASA Glenn · 压力与表面作用力（英文）"};
dictionary["Siemens · 센서·구동부와 I/O 연결"]={"en": "Siemens · Sensor, actuator and I/O connections (English)", "zh": "Siemens · 传感器、驱动器与I/O连接（英文）"};
let lang='ko';try{lang=localStorage.getItem('semi-language')||'ko'}catch{}const requestedLanguage=new URLSearchParams(location.search).get('lang');if(['ko','en','zh'].includes(requestedLanguage))lang=requestedLanguage;if(!['ko','en','zh'].includes(lang))lang='ko';
const originals=new WeakMap();const attrs=new WeakMap();const reverse=new Map();for(const [ko,v] of Object.entries(dictionary))for(const t of Object.values(v))reverse.set(t,ko);
export function tr(value){if(lang==='ko')return value;if(dictionary[value])return dictionary[value][lang];return value;}
function translateText(value){let clean=value.trim(),ko=reverse.get(clean)||clean;if(dictionary[ko])return value.replace(clean,tr(ko));let m=ko.match(/^([✓○]\s+0\d\s+)(.+) 이해하기$/);if(m)return m[1]+tr(m[2])+(lang==='en'?' · Explore':lang==='zh'?' · 了解':' 이해하기');m=ko.match(/^(\d) \/ 3 부품 열람 · 이 브라우저에 저장$/);if(m)return lang==='en'?`${m[1]} / 3 components viewed · Saved in this browser`:lang==='zh'?`${m[1]} / 3 部件已查看 · 保存在此浏览器` :ko;if(lang!=='ko'){let output=value;for(const ko of Object.keys(dictionary).sort((a,b)=>b.length-a.length)){if(output.includes(ko))output=output.split(ko).join(dictionary[ko][lang]);}return output;}return value;}
export function translateDOM(){document.documentElement.lang=lang==='zh'?'zh-CN':lang;document.title=lang==='ko'?'SEMI LAB — 반도체 설비 교육':lang==='en'?'SEMI LAB — Semiconductor Equipment Learning':'SEMI LAB — 半导体设备学习';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(['SCRIPT','STYLE','OPTION'].includes(node.parentElement?.tagName)||node.parentElement?.closest('#language,[data-i18n-owned]'))continue;const current=node.nodeValue,old=originals.get(node);if(!old||current!==old.last){originals.set(node,{ko:reverse.get(current.trim())||current,last:current});}const record=originals.get(node);let translated=translateText(record.ko);if(node.nodeValue!==translated)node.nodeValue=translated;record.last=translated;}
for(const element of document.querySelectorAll('[placeholder],[aria-label],option')){if(element.closest('#language,[data-i18n-owned]'))continue;for(const key of element.tagName==='OPTION'?['textContent']:['placeholder','aria-label']){let val=key==='textContent'?element.textContent:element.getAttribute(key);if(!val)continue;let saved=attrs.get(element)||{};if(!saved[key])saved[key]=reverse.get(val)||val;attrs.set(element,saved);let v=tr(saved[key]);if(key==='textContent'){if(element.textContent!==v)element.textContent=v;}else if(val!==v)element.setAttribute(key,v);}}
}
const picker=document.createElement('select');picker.id='language';picker.setAttribute('aria-label','Language / 语言 / 언어');picker.innerHTML='<option value="ko">한국어</option><option value="en">English</option><option value="zh">简体中文</option>';picker.value=lang;document.querySelector('.header-end').prepend(picker);picker.onchange=()=>{lang=picker.value;try{localStorage.setItem('semi-language',lang)}catch{}translateDOM();window.dispatchEvent(new Event('languagechange'));};
let queued=false;new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;translateDOM();});}}).observe(document.body,{childList:true,subtree:true,characterData:true});translateDOM();

export function getLanguage(){return lang;}
