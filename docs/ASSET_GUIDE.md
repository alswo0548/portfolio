# 이미지 · GIF 관리 규칙

포트폴리오의 모든 이미지는 이 저장소의 `assets/` 폴더 한 곳에서 관리합니다.
프로필 README(`alswo0548/alswo0548`)도 이 폴더의 파일을 주소로 불러오므로, **파일을 교체하면 프로필과 소개 페이지가 함께 바뀝니다.**

## 폴더 구조

```text
assets/
├── 01-octv/
│   ├── thumbnail.png          # 프로필·목록 카드 이미지 (1280×640)
│   ├── erd.png                # 기술 상세 문서용 ERD
│   └── screens/               # 실행 화면 스크린샷 (1600px 폭 JPG, 현재는 목업 UI)
│       ├── overview.jpg
│       ├── incidents.jpg
│       └── routes.jpg
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

## GIF 교체 방법

1. 새 파일을 **같은 이름**으로 만들어 `assets/<프로젝트>/`에 덮어씁니다.
2. 커밋 후 GitHub에서 소개 페이지를 열어 바뀐 이미지를 확인합니다.
3. 프로필 화면은 GitHub 이미지 캐시 때문에 몇 분 늦게 바뀔 수 있습니다. 바로 바꾸고 싶다면 프로필 README의 이미지 주소 끝에 `?v=2` 처럼 버전을 붙입니다.

## 새 시연 GIF 추가 방법 (예: OCTV)

1. `assets/01-octv/01_incident_scope.gif`로 저장합니다.
2. `projects/01-octv/README.md`의 **화면 미리보기** 위에 아래 형식으로 추가합니다.

```html
<p align="center">
  <img src="../../assets/01-octv/01_incident_scope.gif" alt="기관별 사건 조회 범위 시연" width="800">
</p>
```

3. GIF 바로 아래에 기능 설명 1~3문장과 **"이 장면을 보세요"** 한 줄을 적습니다.

## 지켜야 할 원칙

- 실제로 실행한 화면만 사용합니다. 목업 화면은 **목업**이라고 표시합니다.
- 테스트 데이터로 촬영했다면 소개 페이지 하단에 그 사실을 적습니다.
- 화면에 API 키·비밀번호·실제 개인정보가 보이지 않는지 확인합니다.
- 배속·자막을 넣었다면 화면 안에 표시합니다.
