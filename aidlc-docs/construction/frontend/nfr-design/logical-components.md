# Logical Components - Frontend (React)

---

## 컴포넌트 아키텍처

```
┌─────────────────────────────────────────────┐
│                  App                         │
│  ┌─────────────────────────────────────┐    │
│  │      TanStack QueryClientProvider    │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │     TanStack RouterProvider  │    │    │
│  │  │  ┌───────────────────────┐  │    │    │
│  │  │  │    ErrorBoundary      │  │    │    │
│  │  │  │  ┌─────────────────┐  │  │    │    │
│  │  │  │  │  Layout + Pages │  │  │    │    │
│  │  │  │  └─────────────────┘  │  │    │    │
│  │  │  └───────────────────────┘  │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

[Zustand Stores]          [External]
├── authStore ←→ localStorage    ├── Backend REST API
├── cartStore ←→ localStorage    ├── Backend SSE
└── sseStore                     └── Web Audio API
```

---

## Zustand Stores 상세

### authStore
| 필드 | 타입 | 설명 |
|------|------|------|
| token | string \| null | JWT 토큰 |
| role | 'admin' \| 'table' \| null | 사용자 역할 |
| storeId | string \| null | 매장 ID |
| tableId | string \| null | 테이블 ID (고객만) |
| tableNo | number \| null | 테이블 번호 (고객만) |
| sessionId | string \| null | 세션 ID (고객만) |

Actions: `setAuth(data)`, `clearAuth()`, `isAuthenticated()`
Persist: localStorage key `auth-storage`

### cartStore
| 필드 | 타입 | 설명 |
|------|------|------|
| items | CartItem[] | 장바구니 항목 |

Actions: `addItem(item)`, `removeItem(menuId)`, `updateQuantity(menuId, qty)`, `clear()`
Computed: `totalAmount` = Σ(finalPrice × quantity)
Persist: localStorage key `cart-storage`

### sseStore
| 필드 | 타입 | 설명 |
|------|------|------|
| connected | boolean | SSE 연결 상태 |
| soundEnabled | boolean | 알림음 활성화 |

Actions: `setConnected(bool)`, `toggleSound()`

---

## TanStack Query 설정

### QueryClient 기본 설정
```
defaultOptions:
  queries:
    retry: 3
    retryDelay: exponential backoff
    staleTime: 0
    refetchOnWindowFocus: true
  mutations:
    retry: 0
```

### Query Keys 규칙
| Key | 용도 |
|-----|------|
| ['categories', storeId] | 카테고리 목록 |
| ['menus', storeId, categoryId?] | 메뉴 목록 |
| ['orders', sessionId] | 세션별 주문 |
| ['orders', tableId] | 테이블별 주문 (관리자) |
| ['tables', storeId] | 테이블 목록 |
| ['statistics', 'today'] | 오늘 대시보드 |
| ['statistics', 'daily', date] | 일별 통계 |
| ['statistics', 'period', start, end] | 기간별 통계 |
| ['serviceCalls', 'pending'] | 미처리 서비스 호출 |

---

## Axios 인스턴스

```
baseURL: VITE_API_URL (기본 http://localhost:3000)
timeout: 10000ms

Request Interceptor:
  - authStore.token 존재 시 Authorization: Bearer {token} 헤더 추가

Response Interceptor:
  - 401: authStore.clearAuth() → 로그인 리다이렉트
  - 기타 에러: 에러 객체 그대로 throw
```

---

## SSE 연결 관리

### 관리자 SSE
- 엔드포인트: GET /sse/admin
- 이벤트: new-order, order-status, order-updated, order-deleted, service-call
- 처리: 해당 Query Key invalidate + 알림음 트리거

### 고객 SSE
- 엔드포인트: GET /sse/table/:tableId
- 이벤트: order-status, session-end
- 처리: order-status → 주문 Query invalidate, session-end → cartStore.clear() + 메뉴 리다이렉트

---

## 파일 구조

```
frontend/
├── src/
│   ├── main.tsx                    # 앱 진입점
│   ├── App.tsx                     # QueryClient + Router 설정
│   ├── routes/                     # TanStack Router 라우트 정의
│   │   ├── __root.tsx
│   │   ├── table/
│   │   │   ├── setup.lazy.tsx
│   │   │   └── $tableNo/
│   │   │       ├── menu.lazy.tsx
│   │   │       ├── cart.lazy.tsx
│   │   │       ├── order.lazy.tsx
│   │   │       └── history.lazy.tsx
│   │   └── admin/
│   │       ├── login.lazy.tsx
│   │       ├── dashboard.lazy.tsx
│   │       ├── tables.lazy.tsx
│   │       ├── menus.lazy.tsx
│   │       ├── categories.lazy.tsx
│   │       └── statistics.lazy.tsx
│   ├── components/                 # 재사용 컴포넌트
│   │   ├── layout/
│   │   │   ├── CustomerLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── customer/
│   │   │   ├── CategorySidebar.tsx
│   │   │   ├── MenuGrid.tsx
│   │   │   ├── MenuCard.tsx
│   │   │   ├── CartItemRow.tsx
│   │   │   └── OrderCard.tsx
│   │   ├── admin/
│   │   │   ├── TableList.tsx
│   │   │   ├── OrderDetailPanel.tsx
│   │   │   ├── OrderActionButtons.tsx
│   │   │   ├── SettleDialog.tsx
│   │   │   ├── MenuFormDialog.tsx
│   │   │   └── CategoryFormDialog.tsx
│   │   └── common/
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── ImageWithFallback.tsx
│   ├── stores/                     # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── sseStore.ts
│   ├── api/                        # API 함수
│   │   ├── axios.ts
│   │   ├── auth.ts
│   │   ├── categories.ts
│   │   ├── menus.ts
│   │   ├── orders.ts
│   │   ├── tables.ts
│   │   ├── serviceCalls.ts
│   │   ├── statistics.ts
│   │   └── upload.ts
│   ├── hooks/                      # Custom hooks
│   │   ├── useSse.ts
│   │   └── useSound.ts
│   ├── types/                      # TypeScript 타입
│   │   └── index.ts
│   └── utils/                      # 유틸리티
│       └── price.ts                # 할인가 계산
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .env
```
