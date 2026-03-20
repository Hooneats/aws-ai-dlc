// API Response Types
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  isDefault: boolean;
  isHidden: boolean;
  isServiceCategory: boolean;
  storeId: number;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  sortOrder: number;
  isRecommended: boolean;
  discountRate: number;
  isSoldOut: boolean;
  isActive: boolean;
  storeId: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  tableId: number;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  memo: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface TableEntity {
  id: number;
  tableNo: number;
  sessionId: string | null;
  storeId: number;
}

export interface OrderHistoryItem {
  id: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistory {
  id: number;
  tableId: number;
  sessionId: string;
  totalAmount: number;
  settledAt: string;
  items: OrderHistoryItem[];
}

export type ServiceCallStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED';

export interface ServiceCall {
  id: number;
  tableId: number;
  tableNo: number;
  menuId: number;
  menuName: string;
  status: ServiceCallStatus;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface TableLoginResponse {
  accessToken: string;
  sessionId: string;
  tableId: number;
}

// Statistics
export interface TodayDashboard {
  sales: number;
  orders: number;
  activeTables: number;
  totalTables: number;
  avgPerTable: number;
  topMenus: { menuName: string; quantity: number; sales: number }[];
  hourlyStats: { hour: number; orders: number; sales: number }[];
}

export interface DailySummary {
  totalSales: number;
  totalOrders: number;
}

export interface TableStat { tableNo: number; sales: number; orders: number; }
export interface MenuStat { menuName: string; quantity: number; sales: number; }

export interface PeriodSummary {
  totalSales: number;
  totalOrders: number;
  avgDailySales: number;
  dailyTrend: { date: string; sales: number; orders: number }[];
  menuRanking: MenuStat[];
  tableRanking: TableStat[];
  dayOfWeekPattern: { day: string; avgSales: number; avgOrders: number }[];
}

// Client-only types
export interface CartItem {
  menuId: number;
  menuName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  quantity: number;
  imageUrl: string | null;
}

// Form DTOs
export interface AdminLoginForm {
  storeCode: string;
  username: string;
  password: string;
}

export interface TableSetupForm {
  storeCode: string;
  tableNo: number;
}

export interface CreateOrderRequest {
  items: { menuId: number; quantity: number }[];
  memo?: string;
}

export interface CreateMenuForm {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
}

export interface CreateCategoryForm {
  name: string;
  sortOrder: number;
}
