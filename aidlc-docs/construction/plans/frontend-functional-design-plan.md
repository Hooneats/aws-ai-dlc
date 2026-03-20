# Functional Design Plan - Frontend (React)

## 계획

- [x] Step 1: Frontend 유닛 컨텍스트 분석 (unit-of-work, story-map, backend API 참조)
- [x] Step 2: 질문 수집 및 답변 확인
- [x] Step 3: Business Logic Model 생성 (페이지별 상태 관리, 데이터 흐름)
- [x] Step 4: Business Rules 생성 (클라이언트 검증, UI 규칙)
- [x] Step 5: Domain Entities 생성 (TypeScript 타입/인터페이스)
- [x] Step 6: Frontend Components 생성 (컴포넌트 계층, Props, State, API 연동)

---

## 질문

### 1. UI 프레임워크/라이브러리

React 기반 Frontend에서 사용할 UI 라이브러리를 선택해주세요.

A) MUI (Material UI) - 풍부한 컴포넌트, Material Design
B) Ant Design - 관리자 UI에 강점, 테이블/폼 컴포넌트 풍부
C) Tailwind CSS + Headless UI - 유틸리티 기반, 커스텀 자유도 높음
D) Chakra UI - 접근성 우수, 심플한 API
E) 순수 CSS (라이브러리 없음)

[Answer]:A

### 2. 상태 관리

전역 상태 관리 방식을 선택해주세요.

A) React Context API만 사용 (AuthProvider, CartProvider, SseProvider)
B) Zustand - 경량 상태 관리
C) Redux Toolkit - 대규모 상태 관리
D) Jotai - 원자적 상태 관리

[Answer]:B

### 3. HTTP 클라이언트

Backend API 호출에 사용할 라이브러리를 선택해주세요.

A) Axios + 커스텀 훅
B) TanStack Query (React Query) + Axios - 캐싱/리페칭 자동화
C) TanStack Query + Fetch API
D) SWR + Fetch API

[Answer]:B

### 4. 라우팅

페이지 라우팅 라이브러리를 선택해주세요.

A) React Router v6
B) TanStack Router

[Answer]:B

### 5. 차트 라이브러리 (통계 페이지용)

매출 통계 페이지의 그래프/차트에 사용할 라이브러리를 선택해주세요.

A) Recharts - React 친화적, 선언적 API
B) Chart.js + react-chartjs-2
C) Nivo - 풍부한 차트 종류, D3 기반
D) ApexCharts

[Answer]:B

### 6. 고객 메뉴 화면 레이아웃

고객용 메뉴 화면의 카테고리 탐색 방식을 선택해주세요.

A) 상단 탭 바 (카테고리 가로 스크롤) + 아래 메뉴 카드 그리드
B) 좌측 사이드바 (카테고리 목록) + 우측 메뉴 카드 그리드
C) 상단 드롭다운 + 메뉴 카드 그리드

[Answer]:B

### 7. 관리자 대시보드 레이아웃

관리자 주문 모니터링 대시보드의 레이아웃을 선택해주세요.

A) 테이블별 카드 그리드 (각 카드에 테이블 번호, 주문 요약, 상태)
B) 좌측 테이블 목록 + 우측 주문 상세 패널
C) 칸반 보드 스타일 (대기중 | 준비중 | 완료 컬럼)

[Answer]:B

### 8. 알림음

신규 주문/서비스 호출 시 브라우저 알림음 구현 방식을 선택해주세요.

A) Web Audio API로 간단한 비프음 생성
B) 미리 준비된 알림음 파일 (mp3/wav) 재생
C) 두 가지 모두 지원 (기본 비프음 + 커스텀 음원 옵션)

[Answer]:A

### 9. 모바일 반응형

고객용 화면의 반응형 지원 범위를 선택해주세요.

A) 태블릿 전용 (768px~1024px 최적화)
B) 태블릿 + 모바일 반응형 (320px~1024px)
C) 데스크톱 + 태블릿 + 모바일 전체 반응형

[Answer]:B

### 10. 폼 관리

관리자 페이지의 폼 (메뉴 등록/수정, 카테고리 관리 등) 처리 방식을 선택해주세요.

A) React Hook Form - 성능 우수, 비제어 컴포넌트
B) Formik - 선언적 폼 관리
C) 직접 구현 (useState 기반)

[Answer]:A
