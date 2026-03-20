# Frontend Components - Frontend (React)

## 라우트 구조 (TanStack Router)

```
/                           → 리다이렉트 (/table/setup 또는 /admin/login)
/table/setup                → TableSetupPage (초기 설정)
/table/:tableNo             → 고객 레이아웃
  /table/:tableNo/menu      → MenuPage (기본)
  /table/:tableNo/cart      → CartPage
  /table/:tableNo/order     → OrderPage
  /table/:tableNo/history   → OrderHistoryPage
/admin/login                → LoginPage
/admin                      → 관리자 레이아웃
  /admin/dashboard          → DashboardPage (기본)
  /admin/tables             → TableManagementPage
  /admin/menus              → MenuManagementPage
  /admin/categories         → CategoryManagementPage
  /admin/statistics         → StatisticsPage
```

---

## 컴포넌트 계층

### 공통 레이아웃

#### CustomerLayout
- **Props**: children
- **구성**: 하단 네비게이션 바 (메뉴, 장바구니(뱃지), 주문내역)
- **State**: cartStore에서 장바구니 아이템 수 (뱃지)

#### AdminLayout
- **Props**: children
- **구성**: 좌측 사이드바 네비게이션 (대시보드, 테이블, 메뉴, 카테고리, 통계) + 상단 헤더 (매장명, 로그아웃)
- **State**: authStore에서 인증 상태

---

### 고객용 페이지

#### TableSetupPage
- **State**: storeCode, tableNo (로컬)
- **API**: POST /auth/table-login
- **동작**: 성공 시 authStore에 JWT 저장 → /table/:tableNo/menu 리다이렉트

#### MenuPage
- **구성**:
  - CategorySidebar (좌측)
  - MenuGrid (우측)
  - MenuCard (그리드 아이템)
  - ServiceCallButton (서비스 카테고리 선택 시)
- **API**: GET /categories, GET /menus
- **State**: selectedCategoryId (로컬), TanStack Query 캐시

##### CategorySidebar
- **Props**: categories[], selectedId, onSelect
- **표시**: "추천" 탭 + 카테고리 목록 (서비스 요청 포함)

##### MenuGrid
- **Props**: menus[]
- **구성**: MenuCard 그리드 (반응형: 모바일 1열, 태블릿 2~3열)

##### MenuCard
- **Props**: menu, onAddToCart
- **표시**: 이미지, 메뉴명, 가격, 할인 배지, 품절 오버레이
- **동작**: 클릭 시 장바구니 추가 (품절/비활성이면 비활성화)

#### CartPage
- **구성**: CartItemList, CartSummary, OrderButton
- **State**: cartStore
- **동작**: 수량 변경, 항목 삭제, 장바구니 비우기

##### CartItemRow
- **Props**: cartItem, onQuantityChange, onRemove
- **표시**: 메뉴명, 단가, 수량 (+/-), 소계, 삭제 버튼

#### OrderPage
- **구성**: OrderSummary (읽기 전용), MemoInput, ConfirmButton
- **API**: POST /orders
- **State**: memo (로컬), cartStore (읽기)

#### OrderHistoryPage
- **구성**: OrderList → OrderCard
- **API**: GET /orders/session/:sessionId
- **SSE**: order-status 이벤트로 TanStack Query invalidate

##### OrderCard
- **Props**: order
- **표시**: 주문 번호, 시각, 메뉴 목록, 금액, 상태("주문완료")

---

### 관리자용 페이지

#### LoginPage
- **구성**: React Hook Form (storeCode, username, password)
- **API**: POST /auth/admin-login
- **동작**: 성공 시 authStore에 JWT 저장 → /admin/dashboard 리다이렉트

#### DashboardPage
- **구성**:
  - TableList (좌측 패널)
  - OrderDetailPanel (우측 패널)
  - ServiceCallAlert (상단 알림 영역)
  - SoundToggle
- **SSE**: /sse/admin 연결
- **State**: selectedTableId (로컬), sseStore

##### TableList
- **Props**: tables[], selectedId, onSelect
- **표시**: 테이블 번호, 주문 건수, 총액, 신규 주문 하이라이트

##### OrderDetailPanel
- **Props**: tableId
- **API**: GET /orders?tableId=X
- **구성**: OrderCard (상태 변경 버튼 포함) → OrderItemRow (삭제 버튼 포함)

##### OrderActionButtons
- **Props**: order
- **동작**: 상태 변경 (PENDING→PREPARING→COMPLETED), 취소 버튼
- **규칙**: 현재 상태에 따라 활성화/비활성화

#### TableManagementPage
- **구성**: TableGrid, AddTableDialog, SettleDialog, HistoryDialog
- **API**: GET/POST/DELETE /tables, POST /tables/:id/settle, GET /tables/:id/history

##### SettleDialog
- **Props**: tableId
- **동작**: 정산 시도 → 미완료 주문 있으면 목록 표시 → 처리 후 재시도

#### MenuManagementPage
- **구성**: MenuTable (목록), MenuFormDialog (등록/수정), CategoryFilter
- **API**: GET/POST/PATCH/DELETE /menus, POST /upload
- **폼**: React Hook Form (name, price, description, categoryId, image)
- **토글**: 추천(isRecommended), 할인(discountRate), 품절(isSoldOut)

#### CategoryManagementPage
- **구성**: CategoryList, CategoryFormDialog
- **API**: GET/POST/PATCH/DELETE /categories
- **규칙**: 기본/서비스 카테고리 삭제 버튼 숨김

#### StatisticsPage
- **구성**: MUI Tabs (실시간 | 일별 | 기간별)
- **탭 1 - TodayDashboard**: KPI 카드 4개 + TopMenusChart + HourlyChart
- **탭 2 - DailyStats**: DatePicker + TableSalesChart + MenuSalesChart
- **탭 3 - PeriodStats**: DateRangePicker + TrendLineChart + MenuRankingTable + DayOfWeekChart
- **차트**: Chart.js (Bar, Line, Doughnut)

---

## Zustand Stores

### authStore
```
state: { token, role, storeId, tableId, tableNo, sessionId }
actions: { setAuth, clearAuth, isAuthenticated }
persist: localStorage
```

### cartStore
```
state: { items: CartItem[], totalAmount }
actions: { addItem, removeItem, updateQuantity, clear }
persist: localStorage
computed: totalAmount = Σ(finalPrice × quantity)
```

### sseStore
```
state: { connected, soundEnabled }
actions: { setConnected, toggleSound }
```

---

## API 함수 구조 (api/)

```
api/
├── axios.ts          # Axios 인스턴스 (baseURL, interceptor)
├── auth.ts           # adminLogin, tableLogin
├── categories.ts     # getCategories, createCategory, updateCategory, deleteCategory
├── menus.ts          # getMenus, createMenu, updateMenu, deleteMenu, setDiscount, setSoldOut, setRecommended
├── orders.ts         # createOrder, getOrdersBySession, getOrdersByTable, updateOrderStatus, cancelOrder, deleteOrderItem
├── tables.ts         # getTables, createTable, deleteTable, settleTable, getTableHistory
├── serviceCalls.ts   # createServiceCall, confirmServiceCall, completeServiceCall, getPendingServiceCalls
├── statistics.ts     # getTodayDashboard, getDailySummary, getByTable, getByMenu, getPeriodSummary
└── upload.ts         # uploadImage
```
