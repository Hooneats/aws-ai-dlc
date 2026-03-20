# Contract/Interface Definition - Backend

## Unit Context
- **Stories**: US-C01~C11, US-A01~A18 (29개)
- **Dependencies**: MySQL, 로컬 파일시스템 (uploads/)
- **Database Entities**: Store, Admin, Table, Category, Menu, Order, OrderItem, OrderHistory, OrderHistoryItem, ServiceCall

---

## Database Entity Layer

### Store Entity
```typescript
@Entity()
class Store {
  id: number;          // PK
  code: string;        // UNIQUE
  name: string;
  createdAt: Date;
}
```

### Admin Entity
```typescript
@Entity()
class Admin {
  id: number;          // PK
  storeId: number;     // FK(Store)
  username: string;
  password: string;    // bcrypt hash
  createdAt: Date;
}
```

### Table Entity
```typescript
@Entity('tables')
class TableEntity {
  id: number;          // PK
  storeId: number;     // FK(Store)
  tableNo: number;
  sessionId: string | null;
  sessionStartedAt: Date | null;
  createdAt: Date;
}
```

### Category Entity
```typescript
@Entity()
class Category {
  id: number;          // PK
  storeId: number;     // FK(Store)
  name: string;
  sortOrder: number;
  isServiceCategory: boolean;
  isDefault: boolean;
  isHidden: boolean;
  createdAt: Date;
}
```

### Menu Entity
```typescript
@Entity()
class Menu {
  id: number;          // PK
  storeId: number;     // FK(Store)
  categoryId: number;  // FK(Category)
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isRecommended: boolean;
  discountRate: number;
  isSoldOut: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Entity
```typescript
@Entity()
class Order {
  id: number;          // PK
  tableId: number;     // FK(Table)
  sessionId: string;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}
```

### OrderItem Entity
```typescript
@Entity()
class OrderItem {
  id: number;          // PK
  orderId: number;     // FK(Order)
  menuId: number;      // FK(Menu)
  menuName: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number;
  discountRate: number;
}
```

### OrderHistory Entity
```typescript
@Entity()
class OrderHistory {
  id: number;          // PK
  tableId: number;     // FK(Table)
  sessionId: string;
  totalAmount: number;
  orderCount: number;
  settledAt: Date;
  createdAt: Date;
  items: OrderHistoryItem[];
}
```

### OrderHistoryItem Entity
```typescript
@Entity()
class OrderHistoryItem {
  id: number;          // PK
  historyId: number;   // FK(OrderHistory)
  orderId: number;
  status: 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  memo: string | null;
  items: JSON;         // [{menuName, quantity, unitPrice, originalPrice, discountRate}]
  orderedAt: Date;
}
```

### ServiceCall Entity
```typescript
@Entity()
class ServiceCall {
  id: number;          // PK
  tableId: number;     // FK(Table)
  menuId: number;      // FK(Menu)
  menuName: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Business Logic Layer

### AuthService
- `adminLogin(storeCode, username, password) -> {accessToken}`
  - Raises: UnauthorizedException (매장/계정 미존재, 비밀번호 불일치)
- `tableLogin(storeCode, tableNo) -> {accessToken, tableNo, sessionId}`
  - Raises: NotFoundException (매장/테이블 미존재)

### StoreService
- `getStore() -> Store`
- `seed() -> void` (멱등성)

### CategoryService
- `create(storeId, name, sortOrder) -> Category`
- `update(categoryId, name?, sortOrder?) -> Category`
- `delete(categoryId) -> void`
  - Raises: BadRequestException (기본/서비스 카테고리 삭제 시도)
- `findAll(storeId, includeHidden?) -> Category[]`
- `updateOrder(categoryIds[], sortOrders[]) -> void`

### MenuService
- `create(storeId, name, price, description?, categoryId, image?) -> Menu`
- `update(menuId, fields) -> Menu`
  - Raises: BadRequestException (비활성 메뉴 수정)
- `delete(menuId) -> void` (Soft Delete)
- `findByCategory(categoryId, activeOnly?) -> Menu[]`
- `findByIds(menuIds[]) -> Menu[]`
- `findAll(storeId, activeOnly?) -> Menu[]`
- `findRecommended(storeId) -> Menu[]`
- `getDiscountedPrice(menu) -> {originalPrice, discountRate, finalPrice}`
- `setRecommended(menuId, isRecommended) -> Menu`
- `setDiscount(menuId, discountRate) -> Menu`
  - Raises: BadRequestException (할인율 범위 초과)
- `setSoldOut(menuId, isSoldOut) -> Menu`
- `updateOrder(menuIds[], sortOrders[]) -> void`

### TableService
- `create(storeId, tableNo) -> TableEntity`
  - Raises: ConflictException (중복 번호)
- `delete(tableId) -> void`
  - Raises: BadRequestException (활성 세션)
- `findAll(storeId) -> TableEntity[]`
- `setup(tableId) -> {sessionId}`
- `settle(tableId) -> void`
  - Raises: BadRequestException (미완료 주문 존재 시 UNSETTLED_ORDERS + 목록)
- `getHistory(tableId, date?) -> OrderHistory[]`

### OrderService
- `create(tableId, sessionId, items[], memo?) -> Order`
  - Raises: BadRequestException (품절/비활성 메뉴)
- `updateStatus(orderId, newStatus) -> Order`
  - Raises: BadRequestException (허용되지 않는 상태 전환)
- `cancel(orderId) -> Order`
- `delete(orderId) -> void`
- `deleteItem(orderId, orderItemId) -> void`
- `findBySession(sessionId) -> Order[]`
- `findByTable(tableId, date?) -> Order[]`
- `batchUpdateStatus(orderIds[], status) -> void`
- `moveToHistory(sessionId) -> void`

### ServiceCallService
- `create(tableId, menuId) -> ServiceCall`
  - Raises: BadRequestException (비서비스 항목)
- `confirm(serviceCallId) -> ServiceCall`
- `complete(serviceCallId) -> ServiceCall`
- `findPending() -> ServiceCall[]`
- `clearByTable(tableId) -> void`

### SseService
- `connectAdmin(storeId) -> Observable<MessageEvent>`
- `connectTable(tableId) -> Observable<MessageEvent>`
- `emitNewOrder(order) -> void`
- `emitOrderStatus(orderId, status) -> void`
- `emitOrderDeleted(orderId, tableId) -> void`
- `emitOrderUpdated(orderId, tableId, items, totalAmount) -> void`
- `emitServiceCall(serviceCall) -> void`
- `emitSessionEnd(tableId) -> void`

### StatisticsService
- `getTodayDashboard(storeId) -> DashboardData`
- `getDailySummary(storeId, date) -> DailySummary`
- `getByTable(storeId, date) -> TableStat[]`
- `getByMenu(storeId, date) -> MenuStat[]`
- `getPeriodSummary(storeId, startDate, endDate) -> PeriodSummary`
  - Raises: BadRequestException (기간 365일 초과)

### UploadService
- `uploadImage(file) -> {imageUrl}`
  - Raises: BadRequestException (형식/크기 초과)

---

## API Layer

### AuthController
- `POST /auth/admin/login` → adminLogin
- `POST /auth/table/login` → tableLogin

### CategoryController (AdminGuard)
- `POST /categories` → create
- `PATCH /categories/:id` → update
- `DELETE /categories/:id` → delete
- `GET /categories` → findAll (query: includeHidden)
- `PATCH /categories/order` → updateOrder

### MenuController (AdminGuard for CUD, TableGuard for R)
- `POST /menus` → create
- `PATCH /menus/:id` → update
- `DELETE /menus/:id` → delete
- `GET /menus` → findAll (query: categoryId, activeOnly)
- `GET /menus/recommended` → findRecommended
- `PATCH /menus/:id/recommended` → setRecommended
- `PATCH /menus/:id/discount` → setDiscount
- `PATCH /menus/:id/sold-out` → setSoldOut
- `PATCH /menus/order` → updateOrder

### TableController (AdminGuard)
- `POST /tables` → create
- `DELETE /tables/:id` → delete
- `GET /tables` → findAll
- `POST /tables/:id/setup` → setup
- `POST /tables/:id/settle` → settle
- `GET /tables/:id/history` → getHistory (query: date)

### OrderController
- `POST /orders` (TableGuard) → create
- `PATCH /orders/:id/status` (AdminGuard) → updateStatus
- `PATCH /orders/:id/cancel` (AdminGuard) → cancel
- `DELETE /orders/:id` (AdminGuard) → delete
- `DELETE /orders/:id/items/:itemId` (AdminGuard) → deleteItem
- `GET /orders/session/:sessionId` (TableGuard) → findBySession
- `GET /orders/table/:tableId` (AdminGuard) → findByTable
- `PATCH /orders/batch-status` (AdminGuard) → batchUpdateStatus

### ServiceCallController
- `POST /service-calls` (TableGuard) → create
- `PATCH /service-calls/:id/confirm` (AdminGuard) → confirm
- `PATCH /service-calls/:id/complete` (AdminGuard) → complete
- `GET /service-calls/pending` (AdminGuard) → findPending

### SseController
- `GET /sse/admin` (AdminGuard) → connectAdmin
- `GET /sse/table/:tableId` (TableGuard) → connectTable

### StatisticsController (AdminGuard)
- `GET /statistics/dashboard` → getTodayDashboard
- `GET /statistics/daily` → getDailySummary (query: date)
- `GET /statistics/daily/tables` → getByTable (query: date)
- `GET /statistics/daily/menus` → getByMenu (query: date)
- `GET /statistics/period` → getPeriodSummary (query: startDate, endDate)

### UploadController (AdminGuard)
- `POST /upload/image` → uploadImage
