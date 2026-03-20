# Code Generation Plan - Frontend (React) - Standard

## Unit Context
- **Unit**: Frontend (React SPA)
- **기술**: React 19 + TypeScript + Vite + MUI + Zustand + TanStack Query/Router + Chart.js
- **Stories**: US-C01~C11 (고객 11개), US-A01~A18 (관리자 18개) = 총 29개
- **의존성**: Backend REST API (http://localhost:3000)
- **코드 위치**: `/frontend/` (workspace root)

## Backend API 엔드포인트 참조
| 엔드포인트 | 메서드 | Guard |
|-----------|--------|-------|
| /auth/admin/login | POST | - |
| /auth/table/login | POST | - |
| /categories | GET/POST | -/Admin |
| /categories/:id | PATCH/DELETE | Admin |
| /categories/order | PATCH | Admin |
| /menus | GET/POST | -/Admin |
| /menus/recommended | GET | - |
| /menus/:id | PATCH/DELETE | Admin |
| /menus/:id/recommended | PATCH | Admin |
| /menus/:id/discount | PATCH | Admin |
| /menus/:id/sold-out | PATCH | Admin |
| /menus/order | PATCH | Admin |
| /orders | POST | Table |
| /orders/session/:sessionId | GET | Table |
| /orders/table/:tableId | GET | Admin |
| /orders/:id/status | PATCH | Admin |
| /orders/:id/cancel | PATCH | Admin |
| /orders/:id | DELETE | Admin |
| /orders/:id/items/:itemId | DELETE | Admin |
| /orders/batch-status | PATCH | Admin |
| /tables | GET/POST | Admin |
| /tables/:id | DELETE | Admin |
| /tables/:id/setup | POST | Admin |
| /tables/:id/settle | POST | Admin |
| /tables/:id/history | GET | Admin |
| /service-calls | POST | Table |
| /service-calls/pending | GET | Admin |
| /service-calls/:id/confirm | PATCH | Admin |
| /service-calls/:id/complete | PATCH | Admin |
| /statistics/dashboard | GET | Admin |
| /statistics/daily | GET | Admin |
| /statistics/daily/tables | GET | Admin |
| /statistics/daily/menus | GET | Admin |
| /statistics/period | GET | Admin |
| /upload/image | POST | Admin |
| /sse/admin | SSE | Admin |
| /sse/table/:tableId | SSE | Table |

---

## 생성 단계

### Step 1: 프로젝트 초기화 및 설정
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] 의존성 설치 (MUI, Zustand, TanStack Query/Router, Axios, Chart.js, React Hook Form)
- [x] tsconfig.json, vite.config.ts, .env, Dockerfile 설정
- [x] ESLint + Prettier 설정

### Step 2: 타입 정의 및 유틸리티
- [x] `src/types/index.ts` - 전체 TypeScript 타입/인터페이스
- [x] `src/utils/price.ts` - 할인가 계산 유틸리티

### Step 3: API 레이어
- [x] `src/api/axios.ts` - Axios 인스턴스 (baseURL, interceptor)
- [x] `src/api/auth.ts` - adminLogin, tableLogin
- [x] `src/api/categories.ts` - CRUD
- [x] `src/api/menus.ts` - CRUD + 추천/할인/품절
- [x] `src/api/orders.ts` - 주문 CRUD + 상태 변경
- [x] `src/api/tables.ts` - CRUD + 정산 + 이력
- [x] `src/api/serviceCalls.ts` - 서비스 호출
- [x] `src/api/statistics.ts` - 통계 API
- [x] `src/api/upload.ts` - 이미지 업로드

### Step 4: Zustand Stores
- [x] `src/stores/authStore.ts` - 인증 상태 (persist)
- [x] `src/stores/cartStore.ts` - 장바구니 (persist)
- [x] `src/stores/sseStore.ts` - SSE 연결 상태 + 알림음

### Step 5: Custom Hooks
- [x] `src/hooks/useSse.ts` - SSE 연결 관리 + TanStack Query invalidation
- [x] `src/hooks/useSound.ts` - Web Audio API 비프음

### Step 6: 공통 컴포넌트 및 레이아웃
- [x] `src/components/common/ErrorBoundary.tsx`
- [x] `src/components/common/ConfirmDialog.tsx`
- [x] `src/components/common/ImageWithFallback.tsx`
- [x] `src/components/layout/CustomerLayout.tsx` - 하단 네비게이션
- [x] `src/components/layout/AdminLayout.tsx` - 사이드바 + 헤더

### Step 7: 라우터 설정 및 앱 진입점
- [x] `src/routes/__root.tsx` - 루트 라우트
- [x] `src/routes/index.tsx` - 리다이렉트
- [x] `src/routeTree.gen.ts` - 라우트 트리
- [x] `src/App.tsx` - QueryClient + RouterProvider
- [x] `src/main.tsx` - 앱 진입점
- [x] `index.html`

### Step 8: 고객용 페이지 - 인증/메뉴
- [x] `src/routes/table/setup.lazy.tsx` - TableSetupPage (US-C01, US-A05)
- [x] `src/components/customer/CategorySidebar.tsx` (US-C03)
- [x] `src/components/customer/MenuGrid.tsx` (US-C02, US-C04)
- [x] `src/components/customer/MenuCard.tsx` (US-C02, US-C04)
- [x] `src/routes/table/$tableNo/menu.lazy.tsx` - MenuPage (US-C02, US-C03, US-C04, US-C06, US-C11)

### Step 9: 고객용 페이지 - 장바구니/주문
- [x] `src/components/customer/CartItemRow.tsx` (US-C05)
- [x] `src/routes/table/$tableNo/cart.lazy.tsx` - CartPage (US-C05, US-C06)
- [x] `src/routes/table/$tableNo/order.lazy.tsx` - OrderPage (US-C07, US-C08)
- [x] `src/components/customer/OrderCard.tsx` (US-C09, US-C10)
- [x] `src/routes/table/$tableNo/history.lazy.tsx` - OrderHistoryPage (US-C09, US-C10)

### Step 10: 관리자 페이지 - 인증/대시보드
- [x] `src/routes/admin/login.lazy.tsx` - LoginPage (US-A01)
- [x] `src/components/admin/TableList.tsx` (US-A02)
- [x] `src/components/admin/OrderDetailPanel.tsx` (US-A02, US-A03, US-A06)
- [x] `src/components/admin/OrderActionButtons.tsx` (US-A03)
- [x] `src/components/admin/ServiceCallAlert.tsx` (US-A14)
- [x] `src/routes/admin/dashboard.lazy.tsx` - DashboardPage (US-A02, US-A03, US-A06, US-A14)

### Step 11: 관리자 페이지 - 테이블/메뉴/카테고리 관리
- [x] `src/components/admin/SettleDialog.tsx` (US-A07)
- [x] `src/routes/admin/tables.lazy.tsx` - TableManagementPage (US-A04, US-A05, US-A07, US-A08)
- [x] `src/components/admin/MenuFormDialog.tsx` (US-A09)
- [x] `src/routes/admin/menus.lazy.tsx` - MenuManagementPage (US-A09~A12, US-A15)
- [x] `src/components/admin/CategoryFormDialog.tsx` (US-A13)
- [x] `src/routes/admin/categories.lazy.tsx` - CategoryManagementPage (US-A13)

### Step 12: 관리자 페이지 - 통계
- [x] `src/routes/admin/statistics.lazy.tsx` - StatisticsPage (US-A16, US-A17, US-A18)

### Step 13: Docker 및 배포 설정
- [x] `frontend/Dockerfile` 업데이트
- [x] `docker-compose.yml` frontend 서비스 확인/업데이트
- [x] `frontend/.env` 환경 변수

### Step 14: 문서 생성
- [x] `frontend/README.md`
- [x] `aidlc-docs/construction/frontend/code/code-generation-summary.md`
