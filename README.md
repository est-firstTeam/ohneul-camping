
# 🏕️오늘캠핑 홈페이지
<img width="1215" alt="스크린샷 2025-04-02 오전 10 23 47" src="https://github.com/user-attachments/assets/6a23027d-957a-4224-b98e-0985a0fd7740" />



- 배포 URL : https://ohneul-camping.vercel.app/
- Test ID : ohneul@test.com
- Test PW : camping12!

## 1. 프로젝트 개요

### 1.1 프로젝트 주제 / 특화 포인트

<b>프로젝트 주제</b><br>
- React와 Firebase를 활용한 캠핑장 예약 서비스 구축 <br>

<b>특화 포인트</b><br>
- 고캠핑 (공공데이터) API 활용
- 카카오 지도 API 활용
- Firebase Auth
- Firestore
- 장바구니, 결제
- 캐러셀 슬라이드

### 1.2 프로젝트 주요 기능

- 홈페이지 로그인, 구글 로그인, 회원가입, 로그아웃 기능  
- 캠핑장 랜덤 추천, 예약이 가장 많은 캠핑장 추천, 모든 캠핑장 정보
- 위치, 날짜, 사이트 형태에 따른 검색 모달 및 결과 페이지
- 캠핑장 상페 페이지 및 카카오맵 API
- 장바구니 페이지 및 예약 현황 페이지
- 사용자 정보 변경 기능 
  
### 1.3 프로젝트 구조
```
├── README.md
├── index.html
├── eslint.config.js
├── .env
├── .gitignore
├── vercel.json
├── vite.config.js
├── package.json
├── package-lock.json
│
├── public
│    ├── favicon.svg
│    └── Logo.svg
└── src
     ├── App.jsx
     ├── main.jsx
     ├── firebaseConfig.js
     ├── util
     │     ├── fbService.js
     │     ├── firebaseApi.js
     │     ├── loading.json
     │     ├── reservationService.js
     │     ├── selectors.js
     │     └── util.js
     ├── store
     │     ├── mypageTitleStore.js
     │     ├── useHeaderStore.js
     │     ├── useSearchStore.js
     │     ├── useSiteStore.js
     │     ├── useUserStore.js
     │     └── useSectionRefStore.js
     ├── constants
     │     ├── collectionName.js
     │     └── errorCodes.js
     ├── pages
     │     ├── Account.jsx
     │     ├── Cart.jsx
     │     ├── CreateAccount.jsx
     │     ├── DetailPage.jsx
     │     ├── Login.jsx
     │     ├── MainPage.jsx
     │     ├── MyPage.jsx
     │     ├── Reservation.jsx
     │     └── SearchResult.jsx
     ├── layout
     │     ├── BaseLayout.jsx
     │     ├── MyPageContentLayout.jsx
     ├── images
     │     ├── ico-homepage.svg
     │          .
     │          .
     │          .
     │     └── ico-topbtn.svg
     ├── scss
     │     ├── index.scss
     │     ├── base
     │     │    ├── _index.scss
     │     │    ├── _normalize.scss
     │     │    ├── _reset.scss
     │     │    └── _typography.scss
     │     ├── abstracts
     │     │    ├── _index.scss
     │     │    ├── _ir.scss
     │     │    ├── _mixin.scss
     │     │    └── _variables.scss
     │     ├── components
     │     │    ├── _aside.scss
     │     │    ├──       .
     │     │    ├──       .
     │     │    └── _selectBox.scss
     │     ├── layout
     │     │    ├── _baselayout.scss
     │     │    ├──       .
     │     │    ├──       .
     │     │    └── _main.scss
     │     ├── pages
     │     │    ├── _account.scss
     │     │    ├──       .
     │     │    ├──       .
     │     │    └── _searchResult.scss
     └── conponents
           ├── Button.jsx
           ├── Modal.jsx
           │          .
           │          .
           └── Topbtn.jsx
```


### 1.4 개발 환경
#### API 
[고캠핑 API 홈페이지 바로 가기](https://www.data.go.kr/data/15101933/openapi.do)

#### Front-end 
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![React](https://img.shields.io/badge/react%20zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![SCSS](https://img.shields.io/badge/Scss-CC6699?style=for-the-badge&logo=Sass&logoColor=white)
#### DB
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=Firebase&logoColor=white)
#### 버전 및 이슈 관리
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
#### 협업 툴  
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=Discord&logoColor=white)
#### 서비스 배포 환경  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white)
#### 디자인 
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white)



### 1.5 활용 방안 및 기대 효과 

- 지역, 날짜, 사이트 수등 맞춤형 검색을 통해 편리한 캠핑장 조회 및 예약 가능
- Firebase 기반의 예약 · 결제 시스템으로 효율적인 예약 관리 지원 가능

## 2. 시작 가이드
### 요구 사항

For building and running the application you need:

#### Frontend
```
$ cd ohneul-camping
$ nvm use v18.20.5
$ npm install 
$ npm run dev
```


## 3. 프로젝트 팀 구성 및 역할
<img width="800" alt="스크린샷 2025-04-02 오전 9 38 16" src="https://github.com/user-attachments/assets/6ae4724d-8c2e-430c-8d50-8886bf609dc3" />

## 4. 프로젝트 수행 절차 및 방법
<img width="800" alt="스크린샷 2025-04-02 오전 9 41 06" src="https://github.com/user-attachments/assets/e2959259-c118-48a7-80de-5f640905fad5" />

## 5. 프로젝트 수행경과

### 메인 페이지

#### 메인 페이지 - 헤더
<img width="800" alt="스크린샷 2025-04-02 오후 5 32 25" src="https://github.com/user-attachments/assets/ddf53e1e-e644-467b-9908-36a883a339c4" />

#### 회원가입 & 로그인
<img width="800" alt="스크린샷 2025-04-02 오후 5 33 35" src="https://github.com/user-attachments/assets/d468f0f9-8535-4f62-bbe9-36642d779895" />
<img width="800" alt="스크린샷 2025-04-02 오후 5 36 18" src="https://github.com/user-attachments/assets/e1eafc3a-aa0c-4c84-b749-3878cb05a0d0" />

#### 검색바 · 검색 모달
<img width="800" alt="스크린샷 2025-04-02 오후 5 40 14" src="https://github.com/user-attachments/assets/6e9f3054-3c6b-4dc9-b8c1-aecb34f97d0a" />

#### 검색 결과 페이지
<img width="800" alt="스크린샷 2025-04-02 오후 5 40 39" src="https://github.com/user-attachments/assets/9fdd471a-c700-4a51-a751-36632affee3b" />

#### 상세 정보 페이지
<img width="800" alt="스크린샷 2025-04-02 오후 5 40 59" src="https://github.com/user-attachments/assets/24e5977d-41c9-403e-b4a8-1fa4d88f70d0" />

#### 마이 페이지







