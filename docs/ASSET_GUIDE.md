# 이미지 · 시연 영상 관리 규칙

포트폴리오의 모든 이미지는 이 저장소의 `assets/` 폴더 한 곳에서 관리합니다.
프로필 README(`alswo0548/alswo0548`)도 이 폴더의 파일을 주소로 불러오므로, **파일을 교체하면 프로필과 소개 페이지가 함께 바뀝니다.**

## 폴더 구조

```text
assets/
├── 01-octv/
│   ├── thumbnail.png          # 프로필·목록 카드 이미지 (1280×640)
│   ├── erd.png                # 초기 설계 ERD (2026-10-02)
│   ├── 01_cctv_detection.gif   # 기존 실제 웹 촬영본의 연속 CCTV 구간
│   ├── 02_incident_analysis.gif # 운영 웹 사건 분석 (2026-11-04)
│   ├── 03_agency_routes.gif     # 운영 웹 경로 비교 (2026-11-04)
│   └── screens/               # 실제 운영 화면 JPG, 계정 영역 크롭
│       ├── overview.jpg
│       ├── incidents.jpg
│       ├── routes.jpg
│       └── delivery.jpg
├── 02-gooddeedquest/
│   ├── thumbnail.png
│   ├── 01_community_algorithm.gif   # 소개 페이지 시연 GIF
│   ├── 01_community_algorithm.mp4   # 같은 장면의 고화질 영상
│   ├── 01_community_algorithm.png   # 대표 장면 정지 이미지
│   ├── 02_team_challenge_llm.gif
│   ├── 02_team_challenge_llm.mp4
│   └── 02_team_challenge_llm.png
└── 03-climbing-web/
    ├── thumbnail.png
    ├── 01_gym_map_search.gif        # 지도 검색 · 로드뷰 · 날씨 시연
    ├── 02_gym_recommend.gif         # 성향 설문 추천 시연
    ├── 03_results_chart_players.gif # 선수 기록 차트 → 선수 상세 시연
    ├── (같은 이름의 .mp4 · .png)
    └── screens/                     # 실행 화면 스크린샷 (1440px 폭 JPG)
        ├── main.jpg
        ├── disciplines.jpg
        ├── players.jpg
        └── results.jpg
```

## 파일명 규칙

| 종류 | 규칙 | 예시 |
|---|---|---|
| 프로젝트 폴더 | `순서 두 자리-영문 소문자-하이픈` | `01-octv`, `03-climbing-web` |
| 썸네일 | 항상 `thumbnail.png` | `assets/01-octv/thumbnail.png` |
| 시연 GIF | `순서 두 자리_기능명.gif` (영문 소문자 · 밑줄) | `02_team_challenge_llm.gif` |
| 고화질 영상 · 정지 이미지 | GIF와 같은 이름에 확장자만 `.mp4`, `.png` | `02_team_challenge_llm.mp4` |
| 스크린샷 | `screens/화면이름.jpg` | `screens/incidents.jpg` |

한글·공백이 들어간 파일명은 주소가 깨지기 쉬우니 쓰지 않습니다.

## 권장 크기

| 종류 | 크기 | 용량 목표 |
|---|---|---|
| 썸네일 | 1280×640 (2:1) PNG | 500KB 이하 |
| 모바일 앱 GIF | 폭 360~400px, 15fps | 10MB 이하 (권장 5MB 이하) |
| 웹 화면 GIF | 폭 800~960px, 10~12fps | 10MB 이하 |
| 스크린샷 | 폭 1600px JPG | 300KB 이하 |

## 보관용 GIF 교체 방법

1. 새 파일을 **같은 이름**으로 만들어 `assets/<프로젝트>/`에 덮어씁니다.
2. 커밋 후 GitHub에서 소개 페이지를 열어 바뀐 이미지를 확인합니다.
3. 프로필 화면은 GitHub 이미지 캐시 때문에 몇 분 늦게 바뀔 수 있습니다. 바로 바꾸고 싶다면 프로필 README의 이미지 주소 끝에 `?v=2` 처럼 버전을 붙입니다.

## 보관용 GIF 추가 방법

1. `assets/01-octv/02_incident_analysis.gif`로 저장합니다.
2. `projects/01-octv/README.md`의 해당 **시연** 섹션에 아래 형식으로 추가합니다.

```html
<p align="center">
  <img src="../../assets/01-octv/02_incident_analysis.gif" alt="사건 상세와 위험도 분석 시연" width="100%">
</p>
```

3. GIF 바로 아래에 기능 설명 1~3문장과 **"이 장면을 보세요"** 한 줄을 적습니다.

세로로 긴 모바일 화면 GIF는 GoodDeedQuest 소개 페이지처럼 **2칸 표**로 GIF와 설명을 나란히 둡니다.
`<img align="left">` 로 띄우면 번호 목록 · 글머리 기호가 GIF 위에 겹쳐 보일 수 있으니 쓰지 않습니다.

```html
<table>
<tr>
<td width="40%" valign="top"><img width="100%" src="../../assets/02-gooddeedquest/01_community_algorithm.gif" alt="설명"></td>
<td valign="top">

**무엇을 하나요**<br>
(설명 — 표 칸 안에서도 Markdown을 쓰려면 위아래에 빈 줄을 둡니다)

</td>
</tr>
</table>
```

## 지켜야 할 원칙

- 실제로 실행한 화면만 사용합니다. 목업 화면은 **목업**이라고 표시합니다.
- 테스트 데이터로 촬영했다면 소개 페이지 하단에 그 사실을 적습니다.
- 화면에 API 키·비밀번호·실제 개인정보가 보이지 않는지 확인합니다.
- 배속·자막을 넣었다면 화면 안에 표시합니다.


## 현재 표시 방식 — 정적 미리보기 + MP4

소개 페이지는 가벼운 JPG 미리보기를 먼저 표시하고, 클릭하면 GitHub Pages의 시연 플레이어를 엽니다. `index.html`·`demos.js`가 재생 UI를 담당합니다. 영상은 재생 버튼을 누를 때만 `src`를 지정하며 `preload="none"`을 유지합니다. 기존 GIF·PNG·MP4 경로는 보존합니다. 위 GIF 예시는 보관용이며 새 소개 페이지에는 JPG+플레이어 링크 방식을 사용합니다.

새 시연은 `demo_<기능>.jpg` / `demo_<기능>.mp4` 쌍으로 저장합니다. OCTV의 `demo_cctv`, `demo_overview`, `demo_analysis`, `demo_routes`는 2026-11-04 운영 화면 전체 녹화입니다. 이전 GIF는 새 녹화와 구분한 보관본입니다.

```markdown
[![기능 설명 — 클릭하여 영상 보기](../../assets/01-octv/demo_cctv.jpg)](https://alswo0548.github.io/portfolio/#octv-cctv)
```

기획 원본은 `assets/01-octv/design/`에 보존합니다. 미리보기 JPG와 원본 PNG를 연결하고, 최종 구현과 다른 구조는 기술 상세 문서의 비교표를 함께 유지합니다.

## 플레이어 배포 및 수정

- GitHub Pages를 `main` 브랜치의 `/ (root)`에서 배포합니다. `.nojekyll`을 유지합니다.
- 새 영상은 `demos.js`의 목록에 등록하고 해당 ID를 소개 페이지의 링크에 연결합니다.
- 운영 서비스 API에 연결하지 않는 정적 플레이어입니다. 로그인·알림 발송·사건 생성이 없습니다.
- 저장소 이름을 바꾸거나 복사할 때는 문서의 Pages 주소와 플레이어의 GitHub 문서 주소를 함께 변경합니다.
- 배포 후 비로그인 브라우저에서 각 영상의 실제 재생과 모바일 폭을 확인합니다.
