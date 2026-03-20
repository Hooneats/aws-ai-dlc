# Domain Entities - Frontend (React TypeScript)

## API 응답 타입 (Backend 엔티티 매핑)

### Store
```typescript
interface Store {
  id: string;
  code: string;
  name: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isDefault: boolean;
  isHidden: boolean;
  isServiceCategory: boolean;
  storeId: string;
}
```

### Menu
```typescript
interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  sortOrder: number;
  isRecommended: boolean;
  discountRate: number;
  isSoldOut: boolean;
  isActive: boolean;
  storeId: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  tableId: string;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  memo: string | null;
  createdAt: string;
  items: OrderItem[];
}

type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
```

### OrderItem
```typescript
interface OrderItem {
  id: string;
  orderId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### OrderHistory
```typescript
interface OrderHistory {
  id: string;
  tableId: string;
  sessionId: string;
  totalAmount: number;
  settledAt: string;
  items: OrderHistoryItem[];
}

interface OrderHistoryItem {
  id: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### Table
```typescript
interface Table {
  id: string;
  tableNo: number;
  sessionId: string | null;
  storeId: string;
}
```

### ServiceCall
```typescript
interface ServiceCall {
  id: string;
  tableId: string;
  tableNo: number;
  menuId: string;
  menuName: string;
  status: ServiceCallStatus;
  createdAt: string;
}

type ServiceCallStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED';
```

### Auth
```typescript
interface LoginResponse {
  accessToken: string;
}

interface TableLoginResponse {
  accessToken: string;
  sessionId: string;
}

interface JwtPayload {
  sub: string;
  role: 'admin' | 'table';
  storeId: string;
  tableId?: string;
  tableNo?: number;
}
```

### Statistics
```typescript
interface TodayDashboard {
  sales: number;
  orders: number;
  activeTables: number;
  totalTables: number;
  avgPerTable: number;
  topMenus: { menuName: string; quantity: number; sales: number }[];
  hourlyStats: { hour: number; orders: number; sales: number }[];
}

interface DailySummary {
  totalSales: number;
  totalOrders: number;
}

interface PeriodSummary {
  totalSales: number;
  totalOrders: number;
  avgDailySales: number;
  dailyTrend: { date: string; sales: number; orders: number }[];
  menuRanking: { menuName: string; quantity: number; sales: number }[];
  tableRanking: { tableNo: number; sales: number; orders: number }[];
  dayOfWeekPattern: { day: string; avgSales: number; avgOrders: number }[];
}
```

---

## 클라이언트 전용 타입

### CartItem (장바구니)
```typescript
interface CartItem {
  menuId: string;
  menuName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  quantity: number;
  imageUrl: string | null;
}
```

### SSE Event
```typescript
interface SseEvent {
  type: 'new-order' | 'order-status' | 'order-updated' | 'order-deleted' | 'service-call' | 'session-end';
  data: unknown;
}
```

### Form DTO
```typescript
interface AdminLoginForm {
  storeCode: string;
  username: string;
  password: string;
}

interface TableSetupForm {
  storeCode: string;
  tableNo: number;
}

interface CreateMenuForm {
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  image?: File;
}

interface CreateCategoryForm {
  name: string;
  sortOrder: number;
}

interface CreateOrderRequest {
  items: { menuId: string; quantity: number }[];
  memo?: string;
}
```
