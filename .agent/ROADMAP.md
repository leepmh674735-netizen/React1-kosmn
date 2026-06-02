# 프로젝트 로드맵 (Project Roadmap & Milestones)

이 문서는 토스 스타일 주식 정보 & 커뮤니티 플랫폼 개발을 위한 핵심 기능 개발 로드맵입니다. 단계별 마일스톤과 구체적인 하위 태스크 체크리스트로 구성되어 있으며, 향후 확장을 고려해 여유 슬롯을 배치했습니다.

---

## 📅 마일스톤 요약 (Milestones Overview)

1. **Milestone 1**: 환경 구성 및 인프라 구축 (프로젝트 생성, DB/Security 세팅)
2. **Milestone 2**: 회원 관리 및 JWT 인증 (가입, 로그인, 페이지 접근 가드)
3. **Milestone 3**: 공지사항 게시판 (어드민 전용 글쓰기, 일반인 읽기 권한)
4. **Milestone 4**: 자유게시판 및 댓글 (CRUD, 페이징, 댓글 기능)
5. **Milestone 5**: 주식 정보 서비스 (대시보드, 상세 페이지, 차트, MCP 연동)
6. **Milestone 6 ~ 8**: (예비 슬롯) 추후 추가 기능 확장 영역

---

## 🛠️ 세부 개발 태스크 목록 (Detailed Checklists)

### 📌 Milestone 1: 환경 구성 및 기본 인프라 세팅
- [ ] **백엔드 프로젝트 초기 세팅**
  - [ ] Spring Boot 3.2+ & Java 21 프로젝트 생성 및 Gradle 빌드 설정
  - [ ] 주요 의존성 추가 (Spring Web, Data JPA, Security, Lombok, Validation, PostgreSQL Driver, JWT)
  - [ ] 도메인 기반 디렉토리/패키지 구조 구성
- [ ] **프론트엔드 프로젝트 초기 세팅**
  - [ ] Vite를 이용한 React 프로젝트 생성
  - [ ] Tailwind CSS v3 설정 및 토스 컬러/글꼴 테마 추가 (`tailwind.config.js`)
  - [ ] React Router v6 패키지 설치 및 기본 라우터 구현
- [ ] **데이터베이스 환경 구성**
  - [ ] 로컬 PostgreSQL 연동용 `application.yml` 설정 작성
  - [ ] 즉시 로컬 실행 가능한 개발용 H2 인메모리 DB 프로파일(`application-dev.yml`) 추가
  - [ ] 기본 DB Schema 테이블 생성을 위한 JPA DDL-Auto 검증
- [ ] **보안 기초 설정**
  - [ ] Spring Security 기본 Filter Chain 구성 및 CORS 설정
  - [ ] JWT 발급 및 파싱을 위한 `JwtTokenProvider` 유틸리티 구현

---

### 📌 Milestone 2: 회원 관리 및 JWT 인증 (Auth & Users)
- [ ] **인증 백엔드 구현**
  - [ ] `User` 엔티티 및 `UserRepository` 구현 (비밀번호 Bcrypt 암호화)
  - [ ] JWT 인증 필터(`JwtAuthenticationFilter`) 및 Entry Point 구현
  - [ ] 회원 가입 및 로그인 REST API 구현 (`/api/auth/signup`, `/api/auth/login`)
- [ ] **인증 프론트엔드 구현**
  - [ ] 토스 스타일의 깔끔한 로그인 및 회원가입 페이지 개발
  - [ ] LocalStorage/Cookie 기반의 JWT 인증 상태 전역 관리 (`AuthContext`)
  - [ ] 특정 페이지 접근 시 토큰 여부를 검사하는 Route Guard Component 구현
  - [ ] 회원 프로필/내 정보 페이지 UI 구성

---

### 📌 Milestone 3: 공지사항 기능 (Notice Board)
- [ ] **공지사항 백엔드 구현**
  - [ ] `Notice` 엔티티 및 `NoticeRepository` 구현
  - [ ] 중요 공지사항 상단 노출 필터 및 전체 리스트 조회 API 개발 (비인증 사용자 허용)
  - [ ] 공지사항 작성/수정/삭제 API 구현 (Spring Security 관리자 권한 `ROLE_ADMIN` 체크 필수)
- [ ] **공지사항 프론트엔드 구현**
  - [ ] 중요 공지가 하이라이트되는 토스 스타일 공지사항 목록 UI 구현
  - [ ] 공지사항 상세 보기 페이지
  - [ ] 관리자 계정 로그인 시에만 나타나는 공지사항 등록/수정용 어드민 폼 화면

---

### 📌 Milestone 4: 자유게시판 및 댓글 기능 (Free Board & Comments)
- [ ] **자유게시판 백엔드 구현**
  - [ ] `Post` 엔티티 및 `Comment` 엔티티 연관관계 매핑 및 레포지토리 작성
  - [ ] 게시글 페이징 조회, 검색, 상세 조회 API 개발
  - [ ] 게시글 CRUD API 및 댓글 추가/삭제 API 구현 (작성자 검증 로직 포함)
- [ ] **자유게시판 프론트엔드 구현**
  - [ ] 피드(Feed) 형식의 카드 레이아웃 게시글 목록 페이지 (토스 스타일 무한 스크롤 또는 페이징)
  - [ ] 게시글 작성 및 수정 화면 개발 (유효성 검사 포함)
  - [ ] 게시글 상세 정보 보기 및 하단 댓글 목록/작성 UI 컴포넌트 구현

---

### 📌 Milestone 5: 주식 정보 서비스 및 외부 API 연동 (Stock Service)
- [ ] **주식 정보 백엔드 구현**
  - [ ] `StockService` 인터페이스 정의 및 1차 목(Mock) 데이터 제공 서비스 구현
  - [ ] 한국투자증권 API 연동을 위한 MCP 서버 연동 어댑터 모듈 개발
  - [ ] 실시간 시세 및 차트용 이력 데이터 제공 API (`/api/stocks/...`) 구현
- [ ] **주식 정보 프론트엔드 구현**
  - [ ] 토스 증권 UI를 오마주한 메인 대시보드 (주요 지수, 거래량 급증, 상승/하락 주식 순위) 개발
  - [ ] 검색창을 이용한 주식 종목 검색 기능 구현
  - [ ] 주식 상세 보기 화면 개발 (종목 개요, 실시간 호가 정보, Recharts 기반 가격 변동 그래프)

---

## 🚀 추가 기능 확장 영역 (Future Extensions Slots)

향후 기능의 추가나 변경에 유연하게 대응하기 위해 미리 정의해 둔 예비 마일스톤 영역입니다.

### 📌 Milestone 6: [추가 슬롯 A - 포트폴리오 및 관심종목 관리]
- [ ] 관심 종목(My Stock Bookmark) 기능 추가 (사용자별 선호 주식 등록 API 및 UI)
- [ ] 가상 자산 포트폴리오 관리 기능 (모의 투자 매수/매도 기록 및 누적 수익률 차트 제공)
- [ ] _(추가 세부 항목을 나중에 여기에 기재)_

### 📌 Milestone 7: [추가 슬롯 B - 실시간 웹소켓 연동]
- [ ] WebSocket/SSE를 활용한 주가 정보 실시간 갱신 모듈 도입
- [ ] 커뮤니티 게시판 실시간 댓글 알림 기능 구현
- [ ] _(추가 세부 항목을 나중에 여기에 기재)_

### 📌 Milestone 8: [추가 슬롯 C - 자유 기재란]
- [ ] _(기능 정의 시 에이전트들이 여기에 구조를 정의하고 구현 태스크를 추가할 것)_
