# GitHub 적용 가이드

이 문서대로 하면 `github.com/alswo0548` 첫 화면에 대표 프로젝트 3개가 보이고,
프로젝트 → 소개 페이지(시연) → 기술 상세 순서로 이동할 수 있습니다. Git 명령어를 몰라도 GitHub 웹 화면만으로 적용할 수 있습니다.

## 1. 구조 — 새 저장소 2개만 만듭니다

| 저장소 | 공개 | 들어가는 파일 | 역할 |
|---|:-:|---|---|
| `alswo0548/alswo0548` | Public | `profile/README.md` 한 개 | GitHub 프로필 첫 화면 (1단계) |
| `alswo0548/portfolio` | Public | `portfolio/` 폴더 전체 | 소개 페이지 · 기술 상세 · 이미지/GIF (2·3단계) |

기존 프로젝트 저장소(OCTV, GoodDeedQuest)는 **수정하지 않습니다.** 원본 코드는 복사하지 않고 링크로만 연결합니다.

<details>
<summary>이 구조를 고른 이유</summary>

| 방식 | 장점 | 이번에 고르지 않은 이유 |
|---|---|---|
| A. 각 프로젝트 저장소에 소개 문서 추가 | 코드와 문서가 한곳에 | GoodDeedQuest는 팀 Organization 저장소, OCTV는 비공개 팀 저장소라 개인 포트폴리오 문서를 넣기 어렵고 기존 저장소를 수정해야 함 |
| **B. 프로필 README + 별도 portfolio 저장소** | 기존 저장소를 건드리지 않음, 이미지·문서를 한곳에서 관리, 프로젝트 추가가 쉬움 | **채택** |
| C. GitHub Pages 웹사이트 | 디자인 자유도가 높음 | 지금 필요한 탐색 흐름은 README만으로 구현 가능. 관리할 코드가 늘어남 → 나중에 선택 사항으로 |

</details>

## 2. portfolio 저장소 만들기 (먼저)

프로필 README의 이미지가 이 저장소를 가리키므로 **반드시 먼저** 만듭니다.

1. GitHub 오른쪽 위 **+** → **New repository**
2. Repository name: `portfolio` (이름이 다르면 프로필 README의 주소를 모두 바꿔야 합니다)
3. **Public** 선택 · *Add a README file* 은 **체크하지 않음** → **Create repository**
4. 새 저장소 화면에서 **uploading an existing file** 클릭
5. 압축을 푼 `portfolio` 폴더를 열고, **안에 있는 항목 전부**(`README.md`, `assets`, `projects`, `docs`)를 선택해 업로드 창에 끌어다 놓습니다.
   - `portfolio` 폴더 자체를 올리면 주소가 `portfolio/portfolio/...`가 되어 이미지가 깨집니다.
6. Commit message: `docs: add portfolio` → **Commit changes**
7. 저장소 첫 화면에서 썸네일 3개와 링크가 보이는지 확인합니다.

<details>
<summary>Git 명령어로 올리는 경우</summary>

```bash
# GitHub에서 빈 portfolio 저장소를 만든 뒤, 압축을 푼 portfolio 폴더 안에서 실행
git init -b main
git add .
git commit -m "docs: add portfolio"
git remote add origin https://github.com/alswo0548/portfolio.git
git push -u origin main
```

</details>

## 3. 프로필 저장소 만들기

1. **+** → **New repository** → Repository name에 사용자 이름과 똑같이 `alswo0548` 입력
   - "special repository" 안내 문구가 나오면 맞게 입력한 것입니다.
2. **Public** · **Add a README file 체크** → **Create repository**
3. `README.md` 오른쪽 연필(✏️) → 내용을 모두 지우고 `profile/README.md` 내용을 붙여넣기 → **Commit changes**
4. `github.com/alswo0548` 에 접속해 첫 화면을 확인합니다.

## 4. 프로필 정보와 Pinned Repositories

**프로필 정보** — 프로필 사진 아래 **Edit profile**
- Name: `이민재`
- Bio: `AI 서비스 · Python 백엔드 개발자` (짧게)
- 이메일 공개는 선택입니다. 공개하려면 프로필 README 맨 아래 Contact 주석을 풀어 적습니다.

**고정 저장소(Pinned)** — 프로필 README 아래에 카드로 보입니다. 최대 6개.

1. 프로필 화면의 **Customize your pins**
2. 아래 순서로 체크 → **Save pins** → 카드 왼쪽 점(⋮⋮)을 끌어 순서 조정

| 순서 | 저장소 | 비고 |
|:-:|---|---|
| 1 | `portfolio` | 포트폴리오 전체 목록 |
| 2 | `octv` | **공개 전환 후에만** 고정 (비공개 저장소는 방문자에게 보이지 않음) |
| 3 | `QuestismTeam/GoodDeedQuest` | 기여한 Organization 저장소도 고정할 수 있습니다 |
| 4 | 클라이밍 프로젝트 저장소 | 저장소를 올린 뒤 |

나머지 저장소(`chat-agent-kdt2604-server`, `PyDeploy01`, `ShopMaster`)는 대표 프로젝트와 겹치지 않게 고정하지 않는 것을 권장합니다.

`portfolio` 저장소 오른쪽 **About** 톱니바퀴에서 Description(`AI 서비스·Python 백엔드 개발자 이민재의 프로젝트 포트폴리오`)을 적어 두면 고정 카드가 깔끔해집니다.

## 5. 적용 전에 결정해야 할 것

### OCTV 소스코드 공개 여부

현재 `alswo0548/octv`는 **비공개**라 방문자가 열면 404가 납니다. 그래서 소개 페이지에는 "비공개 팀 저장소"로만 표기했습니다.

- 공개하려면: 팀원 동의 → 저장소 **Settings → General → Danger Zone → Change repository visibility → Public**
- 공개 전 확인: 포트폴리오 작업 중 `main`과 전체 커밋 이력을 검사했을 때 실제 API 키·비밀번호는 발견되지 않았습니다(`.env.example`의 빈 값만 존재). 공개 직전에 한 번 더 확인하세요.
- 공개 후 바꿀 곳 (주석으로 표시해 둠)
  - `projects/01-octv/README.md` 맨 아래 **소스코드** 줄
  - `projects/01-octv/TECHNICAL.md` 맨 위 **소스코드** 링크
  - (선택) 프로필 README의 OCTV 카드 링크 줄에 `· [소스코드](https://github.com/alswo0548/octv)` 추가

### 클라이밍 프로젝트 자료

아래 중 하나가 있으면 소개 페이지와 기술 상세 문서를 실제 코드 기준으로 채웁니다.

- GitHub 저장소 주소, 또는 프로젝트 폴더(압축 파일)
- 실행 화면 스크린샷 2~4장 또는 실행 방법 (직접 실행해 GIF를 만들 수 있음)

자료가 준비되기 전에는 03 카드를 `자료 준비 중`으로 두거나, 프로필 README에서 03 블록(`<a href=".../03-climbing-web/...">`부터 다음 `<br clear="right">`까지)을 잠시 지워도 됩니다.

## 6. 이후 수정 방법

| 하고 싶은 일 | 방법 |
|---|---|
| 문장 수정 | portfolio 저장소에서 해당 `.md` 파일 → 연필(✏️) → 수정 → Commit |
| GIF·이미지 교체 | **같은 파일명**으로 `assets/<프로젝트>/`에 다시 업로드 (자세한 규칙: [ASSET_GUIDE.md](ASSET_GUIDE.md)) |
| OCTV 진행 상태 갱신 | `projects/01-octv/README.md`의 **진행 상태** 표에서 ⏳ → 🔄 → ✅ 변경 |
| 프로젝트 추가 | `projects/04-이름/README.md`, `assets/04-이름/thumbnail.png`를 만들고 portfolio README와 프로필 README에 카드 블록을 하나 복사해 추가 |
| 프로필 이미지가 바로 안 바뀔 때 | GitHub 이미지 캐시 때문입니다. 몇 분 기다리거나 이미지 주소 끝에 `?v=2`를 붙입니다 |

## 7. 공개 전 체크리스트

- [ ] `github.com/alswo0548` 첫 화면에 썸네일 3개가 보인다 (PC · 휴대폰)
- [ ] 프로젝트 카드 → 소개 페이지 → 기술 상세 → 목록으로 돌아가기가 모두 열린다
- [ ] GoodDeedQuest 소개 페이지의 GIF 2개가 재생된다
- [ ] 비공개 저장소로 가는 링크가 없다 (OCTV 공개 전)
- [ ] 화면·문서에 API 키, 비밀번호, 실제 개인정보가 없다
- [ ] 팀 프로젝트에서 팀원이 한 일을 내 기여로 쓰지 않았다

## 8. (선택) GitHub Pages로 확장할 때

README만으로 필요한 탐색 흐름은 모두 동작합니다. 나중에 디자인을 더 꾸미고 싶다면
portfolio 저장소 **Settings → Pages → Deploy from a branch → `main` / `(root)`** 를 켜면
`alswo0548.github.io/portfolio` 주소로 같은 Markdown이 웹페이지로 열립니다. 현재 파일 구조를 그대로 쓸 수 있지만,
기본 설정에서는 Mermaid 도식이 그림이 아닌 코드로 보이므로 별도 설정이 필요합니다.
