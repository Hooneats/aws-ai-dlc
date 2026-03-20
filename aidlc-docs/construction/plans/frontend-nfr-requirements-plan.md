# NFR Requirements Plan - Frontend (React)

## 계획

- [x] Step 1: Functional Design 분석 및 Backend NFR 참조
- [x] Step 2: 질문 수집 및 답변 확인
- [x] Step 3: NFR Requirements 문서 생성
- [x] Step 4: Tech Stack Decisions 문서 생성

---

## 질문

### 1. 번들 사이즈 / 초기 로딩

초기 로딩 성능 최적화 수준을 선택해주세요.

A) 기본 (코드 스플리팅 없음, 단일 번들)
B) 라우트 기반 코드 스플리팅 (React.lazy)
C) 라우트 + 컴포넌트 레벨 코드 스플리팅 (차트, 모달 등 지연 로딩)

[Answer]:B

### 2. 오프라인/네트워크 에러 처리

네트워크 에러 시 사용자 경험을 선택해주세요.

A) 에러 메시지만 표시 (기본)
B) 에러 메시지 + 자동 재시도 (TanStack Query retry)
C) 에러 메시지 + 자동 재시도 + 오프라인 감지 배너

[Answer]:B

### 3. 접근성 (Accessibility)

접근성 지원 수준을 선택해주세요.

A) MUI 기본 접근성만 (ARIA 기본 제공)
B) WCAG 2.1 AA 수준 (키보드 네비게이션, 스크린리더, 색상 대비)
C) 최소한 (시간 제약상 접근성 고려 최소화)

[Answer]:C

### 4. 이미지 최적화

메뉴 이미지 표시 최적화 수준을 선택해주세요.

A) 기본 img 태그 (최적화 없음)
B) Lazy loading (뷰포트 진입 시 로딩) + placeholder
C) Lazy loading + placeholder + 에러 시 기본 이미지

[Answer]:B

### 5. 빌드 도구

Frontend 빌드 도구를 선택해주세요.

A) Vite (빠른 HMR, 기본 권장)
B) Webpack (설정 자유도)

[Answer]:A

