# 코딩 및 아키텍처 컨벤션 (Coding & Architecture Conventions)

이 문서는 프로젝트 개발 시 일관성 있는 코드 품질을 유지하고, 기능 확장성을 극대화하기 위해 에이전트 팀이 준수해야 하는 백엔드, 프론트엔드, 데이터베이스 네이밍 규칙 및 계층형 아키텍처 가이드라인을 정의합니다.

---

## 1. 아키텍처 가이드라인 (Layered Architecture Rules)

기능 추가 및 변경에 유연하게 대응하기 위해 **도메인별 계층형 아키텍처(Domain-based Layered Architecture)**를 채택합니다. 모든 비즈니스 도메인은 명확히 분리된 책임을 가집니다.

```
[Client / React App]
       │ (HTTP Request / JWT Bearer Token)
       ▼
┌────────────────────────────────────────────────────────┐
│ Controller Layer (HTTP endpoint, Request/Response DTO) │
└───────────────────────┬────────────────────────────────┘
                        │ (DTO)
                        ▼
┌────────────────────────────────────────────────────────┐
│ Service Layer (Pure Business Logic, Transactions)       │
└───────────────────────┬────────────────────────────────┘
                        │ (Entities)
                        ▼
┌────────────────────────────────────────────────────────┐
│ Repository Layer (JPA Repositories, QueryDSL)          │
└───────────────────────┬────────────────────────────────┘
                        │ (SQL queries)
                        ▼
┌────────────────────────────────────────────────────────┐
│ Database Layer (PostgreSQL)                           │
└────────────────────────────────────────────────────────┘
```

### 계층별 세부 규칙
1. **Controller Layer (컨트롤러 계층)**
   - API 엔드포인트 매핑 및 HTTP 요청 파라미터 유효성 검증(`@Valid` 필수 적용)만 처리합니다.
   - 비즈니스 로직을 직접 수행하지 않고 Service 계층을 호출합니다.
   - 응답 시 Entity 객체를 절대 클라이언트에 직접 반환하지 않고, 반드시 **DTO(Data Transfer Object)** 형태로 변환하여 반환합니다.
2. **Service Layer (서비스 계층)**
   - 도메인의 핵심 비즈니스 로직을 구현하며, 트랜잭션 단위(`@Transactional`)를 설정합니다.
   - 특정 컨트롤러나 프레임워크 기술에 의존적이지 않은 순수 Java 코드로 유지합니다.
   - 외부 API 연동(예: 한국투자증권 API) 및 캐싱 처리 역시 Service 계층 하위에서 수행되거나 별도 클라이언트로 위임됩니다.
3. **Repository Layer (레포지토리 계층)**
   - 데이터베이스 액세스를 전담합니다. Spring Data JPA 인터페이스를 상속하여 구현합니다.
   - 조회 조건이 복잡해질 경우 Custom Repository 인터페이스와 QueryDSL을 활용해 동적 쿼리를 분리합니다.
4. **Entity Layer (도메인 엔티티 계층)**
   - 테이블과 1:1 매핑되는 JPA 객체입니다.
   - 가능한 한 내부 비즈니스 규칙(데이터 변경 메서드 등)을 캡슐화하여 자체 상태 변경 로직을 가져갈 수 있게 설계합니다 (Rich Domain Model 지향).

---

## 2. 데이터베이스 네이밍 컨벤션 (PostgreSQL)

PostgreSQL의 특성을 고려하여 모든 식별자는 **소문자 및 Snake Case**를 사용합니다.

- **테이블명 (Tables)**: 복수형 명사를 사용하며 Snake Case를 적용합니다.
  - 예: `users`, `posts`, `comments`, `notices`
- **컬럼명 (Columns)**: 단수형 명사로 지정하며 Snake Case를 적용합니다.
  - 예: `user_id`, `created_at`, `view_count`, `is_important`
- **기본키 (Primary Key)**: 대리키 방식을 기본으로 하며, 이름은 단순 `id`로 정의합니다.
  - 예: `id BIGSERIAL`
- **외래키 (Foreign Key)**: `참조테이블명_id` 형식으로 지정합니다.
  - 예: `user_id`, `post_id`
- **제약 조건 네이밍 (Constraints)**:
  - Primary Key: `pk_테이블명`
  - Foreign Key: `fk_테이블명_참조테이블명`
  - Unique Key: `uk_테이블명_컬럼명`

---

## 3. 백엔드 코딩 컨벤션 (Java & Spring Boot 3)

### Java 21 기능 적극 활용
- **Record**: 모든 단순 데이터 전송용 DTO는 `class` 대신 `record`를 사용하여 불변(Immutable) 객체로 작성합니다.
- **Pattern Matching (for switch)**: 다형성이나 유연한 분기 처리에 switch 표현식과 패턴 매칭을 적극 도입합니다.

### Lombok 사용 규칙
- JPA Entity 정의 시 무분별한 `@Data` 사용을 엄격히 금지합니다 (양방향 연관관계 시 `toString`이나 `equals/hashCode` 무한 루프 위험 방지).
- Entity 에는 `@Getter`, `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 사용하며, 객체 생성은 `@Builder` 패턴 또는 정적 팩토리 메서드를 지향합니다.
- DI(의존성 주입)는 필드 주입(`@Autowired`) 대신 클래스 레벨에 `@RequiredArgsConstructor`를 선언하여 **생성자 주입**을 강제합니다.

### 패키지 구조 (도메인 기반 플랫 구조)
유연한 기능 확장을 위해 전체 패키지는 도메인을 기준으로 1차 분류하며, **도메인 패키지 내부에는 추가적인 하위 패키지(controller, service, repository 등)를 생성하지 않고 모든 관련 클래스들을 플랫하게 배치**합니다. 이를 통해 패키지 깊이를 줄이고 도메인별 응집도를 극대화합니다.

```
com.kosmo.stockapp
├── global/                # 공통 설정, 예외 처리, 보안 필터 등
│   ├── config/            # Spring Security, JWT, WebMvc 설정
│   ├── error/             # ExceptionHandler, Custom Exceptions
│   └── util/              # JwtTokenProvider, Common Utils
└── domain/                # 도메인 영역 (확장 시 새로운 도메인 패키지만 추가)
    ├── member/            # 회원/인증 도메인 (하위 패키지 없이 플랫하게 클래스 배치)
    │   ├── Member.java             # Entity
    │   ├── MemberRepository.java   # Repository
    │   ├── MemberService.java      # Service
    │   ├── MemberController.java   # Controller
    │   ├── MemberRequest.java      # DTO Record
    │   └── MemberResponse.java     # DTO Record
    ├── board/             # 자유게시판 도메인
    │   ├── Board.java
    │   ├── BoardRepository.java
    │   ├── BoardService.java
    │   └── BoardController.java
    ├── notice/            # 공지사항 도메인
    │   └── ...
    └── stock/             # 주식 정보 도메인
        └── ...
```

---

## 4. 프론트엔드 코딩 컨벤션 (React & Tailwind CSS)

### 파일 및 컴포넌트 네이밍
- React 컴포넌트 파일 및 폴더: **PascalCase** (`StockCard.jsx`, `Navbar.jsx`)
- 일반 JavaScript 파일 및 Hook: **camelCase** (`useAuth.js`, `apiClient.js`)
- 모든 컴포넌트는 함수형 컴포넌트(Functional Component) 및 화살표 함수 형태로 통일하여 정의합니다.

### CSS 및 Tailwind CSS 규칙
- 가급적 인라인 CSS (`style={{...}}`) 작성을 지양하고 Tailwind 유틸리티 클래스로만 처리합니다.
- Tailwind 클래스 작성 시 가독성을 위해 아래 순서로 정렬합니다:
  1. Layout/Position (`flex`, `grid`, `absolute`, `z-50`)
  2. Box Model/Spacing (`m-4`, `p-6`, `w-full`, `h-32`)
  3. Typography (`text-lg`, `font-semibold`, `text-gray-900`)
  4. Visuals (`bg-white`, `rounded-3xl`, `border`, `shadow-sm`)
  5. Interactions (`hover:scale-102`, `active:scale-98`, `transition-all`)
- 토스 디자인(Toss Style) 구현을 위한 마이크로 인터랙션 클래스는 공통 버튼 클래스(`btn-primary` 등) 또는 헬퍼로 정의하여 사용합니다.
