# OCTV · 기술 상세

> CCTV 재난 탐지 이후의 **외부 상황 수집·위험도 판단·대응기관 및 경로 추천·기관 전달**을 연결한 의사결정 지원 시스템입니다.

`KDT 최종 프로젝트` · `2인 팀 · 팀장 이민재` · `2026.09 ~ 2026.11.03` · `최종 발표 완료`

[← 소개와 실제 시연](README.md) · [포트폴리오 목록](../../README.md) · [소스코드 — 비공개·권한 필요](https://github.com/alswo0548/octv)

### 목차

1. [개요와 개발 배경](#1-개요와-개발-배경)
2. [문제와 목표](#2-해결하려는-문제와-목표)
3. [기간·역할](#3-기간--인원--담당-역할)
4. [기술 선택](#4-기술-스택과-선정-이유)
5. [아키텍처](#5-시스템-아키텍처)
6. [사건 처리 흐름](#6-사건-처리-흐름)
7. [DB와 API](#7-데이터베이스와-api)
8. [핵심 구현](#8-핵심-구현)
9. [문제 해결](#9-기술적-문제와-해결)
10. [검증](#10-테스트와-검증)
11. [배운 점](#11-배운-점과-개선할-부분)
12. [남은 과제](#12-향후-개선-과제)

## 1. 개요와 개발 배경

여러 CCTV의 재난 후보를 사건으로 모으고, 외부 정보와 함께 분석해 관제 요원이 대응 순서와 기관·경로를 선택하도록 돕습니다. 영상에서 재난을 찾는 기능뿐 아니라 **탐지 이후 판단에 필요한 데이터와 근거를 연결하는 것**에 초점을 맞췄습니다.

개발과 최종 발표는 완료했습니다. 기관 전달까지 지원하며 실제 출동 지령, 도착 확인, 현장 대응 완료를 자동화하지 않습니다.

**확인 기준** — 2026-11-04 기준 원본 `main`은 `0af0bc2`(2026-10-31)입니다. 11월 2일 후속 수정 브랜치 `fix/n001-live-startup-retry-20261102`의 `a6cd563`도 함께 검토했습니다. 운영 UI는 11월 3~4일 직접 확인했으나 서버의 배포 커밋은 확인하지 않았습니다. 따라서 후속 브랜치의 코드를 모두 main 또는 운영 서버에 적용된 기능으로 간주하지 않습니다. 원본 README의 초기 스캐폴드 설명보다 실제 구현 파일과 화면을 기준으로 정리했습니다.

## 2. 해결하려는 문제와 목표

| 문제 | 구현 방향 |
|---|---|
| 다수 영상에서 피해 위치·정도를 동시에 파악하기 어려움 | YOLO 탐지·사건 생성·지도와 우선순위 목록 연결 |
| 반복 탐지가 중복 사건으로 쌓임 | 진행 중 사건의 부분 UNIQUE와 UPSERT로 통합 |
| 외부 데이터의 누락·오래된 값·미검증 값을 구분하기 어려움 | 상태·출처·단위·관측 시각을 포함한 ContextSnapshot |
| 기관·경로 선택 근거가 흩어짐 | 위험도, 역할·지역·접근성, 경로 시간·거리를 각각 평가 |
| 외부 API 지연이나 알림 실패가 요청 처리를 막음 | 분석·알림 워커 분리, 락·재시도·결과 저장 |

## 3. 기간 · 인원 · 담당 역할

- **기간**: 2026.09 ~ 2026.11.03, KDT 최종 발표 완료
- **인원**: 2인 / **역할**: 팀장
- **이민재**: 기상·수위·교통 연동, LangGraph 사건 분석, 위험도·우선순위, 대응기관·경로 추천, 기관 전달·FCM, CCTV 환경 적응학습, Docker 배포·서비스 통합
- **팀원**: CCTV 수집·스트리밍·모니터링, YOLO 기반 재난 탐지·사건 생성 중심

사건 저장·조회·권한·판단 큐 기반을 담당하고 팀원의 탐지·사건 생성 흐름과 연결했습니다. 적응학습 역할은 별도 학습 환경에서 수행한 작업을 포함합니다. 저장소 `training/train.py`, `training/evaluate.py`는 미구현 진입점이 남아 있어 저장소만으로 학습을 재현할 수 있다는 주장은 하지 않습니다.

## 4. 기술 스택과 선정 이유

| 기술 | 실제 사용 방식·선택 이유 |
|---|---|
| Python · FastAPI · Pydantic | 탐지·분석 코드와 같은 언어로 API를 구성하고 입출력 검증 |
| PostgreSQL · psycopg · Atlas | SQL 제약·트랜잭션·마이그레이션으로 중복과 관계 무결성 관리 |
| Redis · Celery | HTTP 요청과 분석/알림 작업 분리, 중복 실행 락·캐시 |
| LangGraph | 사건 상태를 전달하며 수집·평가·추천·저장 단계를 명시적으로 연결 |
| FastMCP · httpx | 외부 상황 수집을 도구 인터페이스로 제공; 직접 호출 경로도 지원 |
| YOLO · OpenCV | 재난 객체 추론과 영상 프레임 처리 |
| MediaMTX · WebRTC | CCTV 영상 중계·브라우저 모니터링 |
| React · Vite · TypeScript / React Native · Expo | 관제 웹과 기관 모바일 화면 |
| Firebase Admin SDK · FCM | 기관 사용자 기기의 푸시 발송 요청 |
| Docker Compose · Caddy · DigitalOcean | API·워커·DB·스트리밍·웹 서비스를 분리 배포·통합 |

**LangGraph 사용 = LLM 자율 판단은 아닙니다.** 핵심 위험도·기관·경로 점수는 규칙과 API 데이터로 계산합니다. MCP 기본 경로는 `Client(create_server())`로 같은 Python 프로세스 안의 FastMCP 서버를 호출하며, 별도의 원격 MCP 서버로 배포한 구조가 아닙니다.

## 5. 시스템 아키텍처

### 최종 배포 구조

DigitalOcean의 단일 서버에서 Docker Compose로 API·분석·알림·CCTV 워커와 PostgreSQL·Redis·MediaMTX·웹·Caddy를 분리했습니다. 사건을 저장한 뒤 분석 작업을 큐에 등록하고, 관제 요청과 외부 API·알림 작업의 실행 수명을 분리합니다.

### 프로젝트 원본 아키텍처 — 설계와 구현 비교

[![팀에서 작성한 원본 시스템 아키텍처 설계도 — 클릭하면 고해상도 원본](../../assets/01-octv/design/architecture-plan-preview.jpg)](../../assets/01-octv/design/architecture-plan.png)

원본의 구성·색상·흐름을 보존했습니다. **이 그림은 기획 단계 자료이며 최종 배포도와 같지 않습니다.** 화면에서 읽기 어려운 글자는 이미지를 눌러 원본에서 확대할 수 있습니다.

| 원본 설계 | 최종 구현에서 확인한 내용 |
|---|---|
| GPU 서버 / CPU 서버 분리 | DigitalOcean 단일 서버의 컨테이너 분리; 시연 YOLO CPU 추론 |
| MySQL | PostgreSQL 17.11·SQL 마이그레이션 |
| S3 Object Storage | 원본 그림의 S3 운영 배포는 확인되지 않음; 최종 배포 구성의 저장 경로·볼륨 기준 |
| 영상에 박스를 합성한 뒤 스트리밍 | DEMO N001은 영상 재생과 표시용 YOLO JSON 조회를 분리 |
| 위험도와 우선순위 독립 단계 | 최종 그래프의 `assess_risk`에서 함께 계산 |

### 코드 기준 논리 구조

```mermaid
flowchart TD
    C["CCTV · 영상 입력"] --> D["탐지 워커 · YOLO"]
    D --> I["사건 저장 · PostgreSQL"]
    I --> Q["Redis · Celery 분석 큐"]
    Q --> G["LangGraph 사건 분석"]
    G --> M["MCP · 외부 데이터 수집"]
    M --> E["기상 · 수위 · 교통 · 장소 API"]
    G --> R["기관 선정 · 경로 평가"]
    R --> K["Kakao Mobility"]
    R --> I
    I --> A["FastAPI · 권한별 조회"]
    A --> W["관제 웹 · 사람의 기관 선택"]
    W --> N["전달 기록 · 알림 큐"]
    N --> F["FCM · 기관 모바일"]
    C --> S["MediaMTX · WebRTC"]
    S --> W
```

`deploy/compose.prod.yaml`은 Postgres 17.11, Redis 7, MediaMTX, API, 분석·알림·CCTV 워커, 웹, Caddy를 분리합니다. 무거운 추론이나 외부 API 지연이 API 요청 수명과 직접 묶이지 않게 합니다. 위 그림은 논리적 흐름이며 모든 화살표가 동기 호출을 뜻하지 않습니다.

## 6. 사건 처리 흐름

1. CCTV 수집·모니터링과 YOLO 추론으로 재난 후보를 얻습니다.
2. 후보를 검증하고 진행 중 사건이면 통합하며 탐지 시각·이미지 등을 저장합니다.
3. 저장 이후 분석 요청을 큐에 넣고 워커가 판단 흐름을 실행합니다. 설정으로 분석 실행 여부를 제어합니다.
4. 외부 상황을 수집·검증하고 위험도·우선순위, 대응기관·경로를 계산합니다.
5. 관측 맥락·평가·추천 결과를 저장하고 관제 화면에서 조회합니다.
6. 관제 요원이 기관을 선택해 전달하면 기록과 알림 작업을 처리합니다.

**실제 LangGraph 노드** (`ai/orchestration/pipeline.py`)

```mermaid
flowchart TD
    L["load_incident"] --> V{"분석 대상인가?"}
    V -->|예| C["collect_context"]
    V -->|없음·비활성·기평가| X["종료"]
    C --> A["assess_risk · 위험도와 우선순위"]
    A --> S["select_agencies"]
    S --> R["evaluate_routes"]
    R --> F["finalize_agencies"]
    F --> P["save_results"]
```

총 7개 처리 노드이며 우선순위는 `assess_risk` 안에서 결정합니다. 기본 흐름은 이미 평가된 사건이나 `DETECTED`·`CONFIRMED` 이외 상태 등을 걸러 불필요한 재실행을 피합니다. 외부 상황 수집은 순차 호출이고, 기관별 경로 조회에는 최대 4개 스레드를 사용합니다. 

<details>
<summary>팀의 원본 서비스·모델 워크플로우 보기</summary>

[![서비스 AI 워크플로우 기획 원본](../../assets/01-octv/design/service-workflow-plan-preview.jpg)](../../assets/01-octv/design/service-workflow-plan.png)

원본의 감시→탐지→사건→판단→기관 선택 흐름을 참고했습니다. 원본에 기재된 사고·차량 등의 분류, LLM 추천 이유 생성, TMAP 선택 경로 전달을 모두 최종 구현으로 간주하지 않습니다. 최종 재난 유형은 침수·쓰러진 나무·심각한 도로 파손·도로 장애물이며, 판단·추천 점수는 규칙 기반입니다. 카카오내비는 목적지 좌표로 별도 길안내를 실행합니다.

[모델 학습 워크플로우 원본](../../assets/01-octv/design/training-workflow-plan.png) · [기획 ERD 원본](../../assets/01-octv/design/erd-plan.png)

적응학습은 별도 환경에서 진행했습니다. `training/train.py`, `training/evaluate.py`에는 미구현 진입점이 남아 있어 저장소 안에서 전체 학습·평가를 재현하는 자동 파이프라인과 구분합니다.

</details>

## 7. 데이터베이스와 API

### 데이터 구조

사건을 중심으로 탐지 이력·외부 상황·평가·기관 추천·후보 경로·전달/알림을 연결합니다. `analysis_storage.py`는 관측 시각을 UTC로 정규화하고 숫자·상태를 검증하며 평가 결과를 트랜잭션으로 저장합니다. 규칙 버전과 출처·결측 정보를 남겨 결과 해석의 근거를 보존합니다.

<details>
<summary>초기 설계 ERD 보기 — 2026-10-02 기준</summary>

<img src="../../assets/01-octv/erd.png" alt="OCTV 초기 ERD, 2026년 10월 2일 설계 자료" width="100%">

초기 13개 테이블 설계 자료입니다. 이후 마이그레이션을 포함한 최종 DB의 전체 스키마와 동일하지 않으며, 현재 스키마는 원본 저장소의 SQL·마이그레이션을 기준으로 합니다.

</details>

| 무결성·조회 규칙 | 목적 |
|---|---|
| 진행 중 사건의 `(cctv_id, hazard_type, dedup_key)` 부분 UNIQUE | 동시 탐지에도 같은 사건 중복 생성 방지 |
| `ON CONFLICT`와 `GREATEST(last_detected_at, …)` | 늦게 도착한 탐지가 최근 시각을 되돌리지 않도록 처리 |
| 사건·기관별 추천 관계와 사용자별 알림 중복 제약 | 재처리 시 중복 추천·알림 억제 |
| 최신 평가 1건을 연결하는 `LEFT JOIN LATERAL` | 평가 이력 때문에 사건 목록이 중복되지 않도록 조회 |

### API와 접근 제어

사건 목록·상세·분석 요청, CCTV 모니터링, 기관 추천·경로·전달, 알림과 지원 요청 영역으로 나뉩니다. 초기 문서의 ‘CCTV·알림 전체 501 예정’ 설명은 현재 구현과 맞지 않아 제거했습니다. 

기관 사용자의 조회 범위는 요청의 `agency_id`가 아니라 로그인 사용자의 소속과 전달 관계로 정합니다. 상세 조회 권한이 없으면 사건 존재 여부를 노출하지 않도록 처리합니다. 관리자의 사건 목록과 기관의 수신 목록은 동일한 공개 데이터가 아닙니다.

## 8. 핵심 구현

### ⓪ LangGraph — 사건의 처리 순서를 명시적으로 연결

**문제** — 수집·평가·추천을 한 함수에 모으면 중간 실패와 분석 제외 조건을 추적하기 어렵습니다.

**해결** — 사건 상태를 공유하는 7개 노드로 분리하고, 사건 로드 단계에서 종료 조건을 판단합니다. 외부 데이터는 MCP 도구를 통해 같은 계약으로 받습니다.

**핵심 코드** — `ai/orchestration/pipeline.py` (발췌)

```python
graph = StateGraph(PipelineState) # LangGraph의 기본 틀 생성
nodes = create_nodes(config) # 7개의 노드를 딕셔너리로 가지고옴
for name, node in nodes.items():
    graph.add_node(name, node)
graph.add_edge(START, 'load_incident')
graph.add_conditional_edges(
    'load_incident',
    lambda state: 'stop' if state['result'] else 'continue',
    {'stop': END, 'continue': 'collect_context'},
)
sequence = (
    'collect_context', 'assess_risk', 'select_agencies',
    'evaluate_routes', 'finalize_agencies', 'save_results',
)
for current, following in zip(sequence, sequence[1:]):
    graph.add_edge(current, following)
graph.add_edge('save_results', END)
return graph.compile()
```

**결과** — 위험도 산정과 경로 평가를 독립적으로 수정하면서 동일한 사건 상태를 저장까지 전달합니다. 그래프를 사용하되 점수 결정은 규칙 기반으로 유지해 판단 근거를 설명할 수 있게 했습니다.

### ① 외부 데이터를 값과 상태로 함께 전달

`ai/orchestration/context.py`, `backend/app/integrations/`에서 기상·수위·교통·장소 응답을 출처·단위·관측 시각과 함께 정규화합니다. 정상·결측·오래된 값·오류를 구분하고 유효한 관측값만 점수에 반영합니다.

CCTV 좌표와 기상 격자·수위 관측소·교통 링크의 매핑을 캐시합니다. `cctv_mapping.py`의 좌표 지문으로 매핑 변경을 구분하고 Redis 캐시를 사용합니다. 후보 관측소·교통 링크는 검증된 관측 또는 도로 통제 사실과 다릅니다. 매핑이 없으면 `NO_MAPPING`으로 남깁니다.

필수 필드 기본 설정은 빈 목록이므로 외부 정보가 일부 없더라도 재난 유형의 기본 점수로 분석을 이어갈 수 있습니다. **미수집을 안전·0이라는 관측으로 바꾸지 않는 것**이 핵심입니다.

**핵심 코드** — `ai/mcp/client.py` (발췌)

```python
async with Client(
    create_server()
) as client:

    # MCP 서버에 등록된 도구 호출
    result = await client.call_tool(
        'get_incident_context',                 # 도구 이름
        {
            'incident_id': incident_id          # 외부 정보를 조회할 사건 ID
        }
    )
```

**코드의 역할** — `get_incident_context` 도구를 호출하고 결과를 `ContextSnapshot`으로 복원합니다. 별도 원격 서버 대신 같은 프로세스의 FastMCP를 사용해 외부 수집의 인터페이스를 분리했습니다.

### ② 위험도와 우선순위

| 구성 | 최대 점수·규칙 |
|---|---|
| 심각도 | 60점; 유형 기본값: 침수 40, 쓰러진 나무 40, 심각한 도로 파손 45, 장애물 30 |
| 주변 영향 | 30점 |
| 악화 요인 | 10점 |
| 전체 | 최대 100점 |
| 우선순위 | 70점 이상 P1 / 40점 이상 P2 / 40점 미만 P3 |

`priority_score`는 위험도 점수와 같습니다. 대기 시간 보너스를 별도로 더하는 알고리즘은 아닙니다. 같은 점수에서는 먼저 탐지된 사건과 ID로 순서를 안정화합니다. 소개 페이지의 85점은 이 규칙의 실측 정확도 증명이 아니라 DEMO 시나리오 출력입니다.

**핵심 코드** — `ai/risk_priority/rules.py` (발췌)

```python
    severity = min(60.0, base + severity_extra)
    exposure = min(30.0, exposure_extra)
    worsening = min(10.0, worsening_extra)
    score = round(min(100.0, severity + exposure + worsening), 2)
    medium, high = _risk_thresholds(policy)
    level = (
        "HIGH" if score >= high
        else "MEDIUM" if score >= medium
        else "LOW"
    )
    priority = (
        "P1" if score >= high
        else "P2" if score >= medium
        else "P3"
    )
```

**문제와 해결** — 데이터가 없을 때 0으로 처리하면 ‘위험이 낮다’는 관측과 혼동됩니다. `observation()`은 `status == "OK"`, 값 존재, 유한한 음이 아닌 숫자를 확인하고 부적합 필드를 `unknown`에 남깁니다. 위 코드는 검증된 관측의 구성별 상한과 우선순위 경계를 적용합니다.

**결과** — 위험도 숫자와 함께 구성 점수·출처·결측을 저장해 관제 화면에서 해석할 근거를 남깁니다.

### ③ 기관 선정과 경로 점수는 분리

기관 점수 구성: **역할 40점(기본 30+상황 10) + 지역 40점 + 접근성 20점(시간 15+거리 5)**. 먼저 역할·지역·직선거리로 후보를 좁히고 실제 경로 조회 후 재정렬해 최대 4개 기관을 남깁니다.

기관에서 사건 위치로 향하는 후보 경로는 기관당 최대 3개를 평가합니다. 경로 자체는 별도의 100점 척도입니다.

```text
경로 점수 = 70 / (1 + 소요시간초 / 시간기준초)
          + 30 / (1 + 거리미터 / 거리기준미터)
```

통제 상태가 정상이고 차단 영역의 검증 플래그와 좌표가 확보된 경우에만 Shapely 교차 검사를 이용해 경로 배제 여부를 판단합니다. 누락·오래된 값·불확실한 통제 정보는 `NEEDS_REVIEW`로 유지합니다. 상태는 `VERIFIED`, `NEEDS_REVIEW`, `DISQUALIFIED`로 구분하며 검증된 정보의 범위를 넘어 안전을 보장하지 않습니다. 사건 근처로만 도착하는 대체 경로나 외부 내비의 재계산 결과 역시 별도 확인 대상입니다.

**핵심 코드** — `ai/agency_recommendation/recommender.py` (발췌)

```python
        valid_routes.sort(key=lambda route: (
            route.get('score_breakdown_json', {}).get('verification_status')
            != 'VERIFIED',
            -(route.get('total_score') or 0),
            route['duration_sec'],
        ))
        best = valid_routes[0] if valid_routes else None
        # 아직 경로확인 전이니 점수 초기화 후, 실제경로가 있을시에 아래 if문에서 최종 접근성 계산을 실행
        time_points = distance_points = 0.0
        access_status = 'NO_AVAILABLE_ROUTE'
        if best:
            access_status = best['score_breakdown_json']['verification_status']
            time_points = 15 / (1 + best['duration_sec'] / duration_scale)
            distance_points = 5 / (1 + best['distance_m'] / distance_scale)
```

**문제와 해결** — 직선거리만 가까운 기관이 실제로 접근하기 쉬운 것은 아닙니다. 후보 기관의 실제 경로를 조회한 다음, 제외 사유가 없는 경로 중 검증 상태·점수·시간 순으로 대표 경로를 고르고 시간·거리 접근성 점수를 계산합니다.

**결과** — 기관 적합성 점수에 실제 접근성을 반영하고, 미검증 경로는 추가 확인 대상으로 남깁니다.

### ④ 분석 워커의 중복·실패 처리

`backend/app/workers.py`는 분석과 알림 큐를 분리합니다. 분석 대상 상태와 기존 평가를 확인하고 Redis 락으로 중복 실행을 억제합니다. 재시도 가능한 HTTP·DB·외부 맥락 오류는 지연 후 다시 처리하며 재시도 중 락을 유지하고 최종 종료 시 해제합니다. 사건 저장과 큐 등록을 분리해 큐 실패가 이미 저장된 사건을 없애지 않도록 합니다.

**핵심 코드** — `backend/app/workers.py` (발췌)

```python
# ---------------------------------------------------------
@celery_app.task(
    bind=True,
    name="octv.analyze_incident",
    queue="analysis",
    max_retries=3,
)
def analyze_incident(
    self,
    incident_id,
    lock_token=None,
):
    ...  # 실행·재시도 본문 생략
```

**코드의 역할** — 분석을 `analysis` 큐의 Celery 작업으로 등록합니다. HTTP·DB·필수 맥락 오류는 30초 후 재시도하고, 재시도 중에는 락을 유지합니다. 완료·최종 실패 때만 락을 해제합니다.

**결과** — 외부 API 지연 때문에 HTTP 요청에서 전체 분석을 기다리지 않으며, 재시도 도중 같은 사건의 분석이 중복 등록되는 상황을 억제합니다. late ACK와 worker lost 재전달도 함께 설정했습니다.

### ⑤ 기관 전달·FCM 알림

기관 전달 기록과 알림을 저장하고 Firebase Admin SDK를 통해 발송합니다. Redis lease·상태와 중복 방지 키를 이용하며 실패한 기기만 재시도합니다.

- 최대 **총 4회 시도**: 최초 1회 + 재시도 3회
- 유효 시간 30분, 기본 60·120·240초 지수 지연과 jitter, `Retry-After` 반영
- FCM 발송 요청 수락과 실제 기기 수신·읽음·현장 출동은 구분

이 수치들은 알림 재시도 정책이며 MCP나 모든 외부 API에 공통 적용되는 정책이 아닙니다.

**핵심 코드** — `backend/app/notifications/service.py` (발췌)

```python
def _plan_retry(state: dict, deadline: float, retry_after: int = 0) -> None:
    if state["attempts"] >= PUSH_MAX_ATTEMPTS:
        state.update(status="EXHAUSTED", reason="ATTEMPT_LIMIT", next_attempt_at=0)
        return
    delay = max(60 * 2 ** (state["attempts"] - 1) + random.randint(0, 15), retry_after)
    next_at = time.time() + delay
    if next_at >= deadline:
        # 허용 시간보다 긴 Retry-After를 짧게 잘라서 일찍 재시도하지 않습니다.
        state.update(status="EXPIRED", reason="RETRY_OUTSIDE_DELIVERY_WINDOW", next_attempt_at=0)
    else:
        state.update(status="WAITING", next_attempt_at=next_at)

```

**문제와 해결** — 알림 장애 때 무제한 재전송하면 중복 발송과 오래된 사건 알림이 쌓입니다. 위 코드는 횟수·유효 시간을 제한하고 FCM의 `Retry-After`를 우선합니다. 기기별 결과를 저장해 실패 대상만 다시 보냅니다.

**결과** — 발송 실패를 추적·복구하면서 이미 처리한 대상의 반복 전송을 줄입니다. 단말 실제 수신·읽음과 서버의 발송 요청 수락은 별개입니다.

## 9. 기술적 문제와 해결

| 문제 | 구현한 처리 | 한계·확인 범위 |
|---|---|---|
| 같은 사건의 반복 탐지·동시 저장 | DB 부분 UNIQUE·UPSERT, 최근 탐지 시각의 단조 갱신 | 탐지 모델의 오탐 자체를 해결하는 장치는 아님 |
| 외부 정보 누락을 정상값처럼 사용할 위험 | 상태·출처·시각 검증, 매핑과 관측을 분리 | 필수 데이터가 없으면 판단의 근거가 제한됨 |
| 기관마다 경로 API를 기다리는 지연 | 기관별 경로 조회 최대 4개 스레드, 결과 검증 후 저장 | 공급자 장애·한도에 영향받음 |
| 실패한 푸시를 전체 재전송할 때의 중복 | 사용자별 알림 제약·Redis lease·실패 기기만 재시도 | 실제 단말 수신 보장과 다름 |
| DEMO MP4 시작·추론 표시 동기화 | 디코딩 준비 후 초기 동기화, HTTP Range 재생과 추론 JSON 표시 분리 | 실제 카메라의 실시간 추론과 시연 재생을 구분해야 함 |
| CCTV 연결 중단·재연결 | WebRTC 재연결과 서버 복구 backoff; 후속 브랜치에 N001 시작 재시도 개선 | 촬영 당시에도 연결 오류 CCTV가 표시됨 |

2026-11-04 새 녹화에서는 운영 N001 영상 위에 실제 YOLO JSON 기반 flood 박스와 신뢰도가 표시되는 것을 확인했습니다. 표시용 분석과 사건 생성은 별도 흐름이며, 수집 연결 상태가 바뀌는 장면도 관찰했습니다. 서버 설정이나 사건 데이터는 변경하지 않았습니다.

## 10. 테스트와 검증

**코드 검토**에서는 파이프라인 노드, 점수 규칙, 매핑·정규화, 분석 저장, 워커와 알림 재시도, 배포 구성의 실제 구현을 확인했습니다. 원본 프로젝트 테스트를 이번 포트폴리오 작업에서 실행하거나 운영 데이터에 대한 재분석·발송 테스트를 수행하지 않았습니다. 과거 테스트 개수·통과 결과를 최신 결과처럼 재사용하지 않습니다.

| 항목 | 확인한 내용 | 수행하지 않은 검증 |
|---|---|---|
| CCTV 탐지 | 11월 4일 운영 N001 영상·실제 YOLO JSON 박스·신뢰도 표시 | 새 실시간 재난 발생·모델 정확도 측정 |
| 사건 분석 | 11월 4일 저장 사건·대표 이미지·P1·외부 정보·분석 펼치기 | 운영 사건 재생성·강제 재평가 |
| 기관·경로 | 후보 경로 선택·기관 탭 전환·지도·시간·점수 | 실제 주행·출동, 전 구간 통제 검증 |
| 기관 전달 | 기존 추천됨/전달됨 상태 조회 | 새 기관 전달·FCM 발송·모바일 수신 |
| 배포 | Docker 구성과 운영 웹 접근 | 서버 내부 설정·배포 SHA·부하 성능 확인 |

새 MP4 4개는 2026-11-04 운영 웹의 전체 화면을 시간순으로 연속 캡처했습니다. 조작 사이의 대기는 줄였으며 화면·탐지 결과·커서를 합성하지 않았습니다. 약 6~8fps로 캡처해 15fps MP4로 인코딩했으므로 원본 서비스의 최대 프레임률을 나타내지는 않습니다.

## 11. 배운 점과 개선할 부분

탐지 신뢰도와 사건 위험도는 서로 다른 값이며, 높은 점수만 보여주는 것보다 **어떤 자료로 계산했는지와 무엇이 빠졌는지**가 중요했습니다. DB 제약·권한·큐·외부 API·프런트 표시를 함께 맞춰야 분석 결과가 실제 사용 흐름으로 이어졌습니다.

DEMO 데이터는 특히 경계를 명확하게 표시해야 합니다. 운영 화면에서 강수량 카드 `0 mm`와 분석 설명 `30 mm`가 함께 나타났습니다. 후자는 시나리오 문구입니다. 이 포트폴리오에서는 이를 명시했지만 운영 코드의 문구 불일치는 수정하지 않았습니다.

## 12. 향후 개선 과제

아래는 완료 기능과 구분한 후속 과제입니다.

- 시나리오 설명과 실제 관측 카드의 관계를 더 명확히 표시
- 미매핑·오래된 관측·통제 구간 검증을 확대하고 기관별 실제 접근 가능성 평가 보강
- 외부 API 장애와 CCTV 재연결을 포함한 장시간 통합·부하 테스트
- FCM 단말 수신 확인과 기관 사용자 동작을 별도 시험 환경에서 검증
- 별도 적응학습 환경의 데이터·설정·평가 결과를 재현 가능한 학습 진입점으로 정리

<br>

[← 소개와 실제 시연으로](README.md) · [포트폴리오 목록으로](../../README.md)
