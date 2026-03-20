# Unit of Work 정의

## 아키텍처 결정
- **배포 구조**: 모놀리식 (Backend 1개 + Frontend 1개)
- **개발 순서**: Backend 먼저 → Frontend 나중에
- **개발 우선순위**: 인프라/인증 우선 → 기본 CRUD → 고급 기능

---

## Unit 목록

### Unit 1: Backend (NestJS)
- **유형**: 모놀리식 Backend 서비스
- **기술**: NestJS (TypeScript), MySQL, SSE
- **책임**: 전체 비즈니스 로직, REST API, 실시간 통신, 데이터 관리

**포함 모듈 (개발 순서)**:
1. **인프라 기반** - DB 스키마, StoreModule (Seed), UploadModule
2. **인증** - AuthModule (JWT, Guard)
3. **기본 CRUD** - CategoryModule, MenuModule, TableModule
4. **핵심 비즈니스** - OrderModule, ServiceCallModule
5. **실시간 통신** - SseModule
6. **고급 기능** - StatisticsModule

**코드 구조**:
```
backend/
├── src/
│   ├── auth/           # AuthModule
│   ├── store/          # StoreModule
│   ├── table/          # TableModule
│   ├── category/       # CategoryModule
│   ├── menu/           # MenuModule
│   ├── order/          # OrderModule
│   ├── service-call/   # ServiceCallModule
│   ├── sse/            # SseModule
│   ├── statistics/     # StatisticsModule
│   ├── upload/         # UploadModule
│   ├── common/         # 공통 (Guards, Decorators, Filters)
│   ├── database/       # DB 설정, Migration, Seed
│   ├── app.module.ts
│   └── main.ts
├── uploads/            # 이미지 저장 디렉토리
├── package.json
├── tsconfig.json
├── nest-cli.json
├── Dockerfile
└── .env
```

---

### Unit 2: Frontend (React)
- **유형**: 단일 React SPA
- **기술**: React (TypeScript)
- **책임**: 고객용 UI, 관리자용 UI, 라우팅 분리, 상태 관리

**포함 페이지 (개발 순서)**:
1. **인증/기반** - LoginPage, TableSetupPage, AuthProvider
2. **메뉴/카테고리** - MenuPage, MenuManagementPage, CategoryManagementPage
3. **장바구니/주문** - CartPage, OrderPage, CartProvider
4. **주문 관리** - OrderHistoryPage, DashboardPage, SseProvider
5. **테이블/서비스** - TableManagementPage
6. **고급 기능** - StatisticsPage

**코드 구조**:
```
frontend/
├── src/
│   ├── pages/
│   │   ├── customer/       # 고객용 페이지
│   │   └── admin/          # 관리자용 페이지
│   ├── components/         # 공통 컴포넌트
│   ├── providers/          # Context Providers
│   ├── hooks/              # Custom Hooks
│   ├── api/                # API 호출 함수
│   ├── types/              # TypeScript 타입
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .env
```

---

## 인프라

```
docker-compose.yml          # Backend + Frontend + MySQL
```

---

## 개발 순서 요약

| 순서 | Unit | 단계 | 설명 |
|------|------|------|------|
| 1 | Backend | 인프라 기반 | DB 스키마, Seed, Upload |
| 2 | Backend | 인증 | JWT, Guard |
| 3 | Backend | 기본 CRUD | Category, Menu, Table |
| 4 | Backend | 핵심 비즈니스 | Order, ServiceCall |
| 5 | Backend | 실시간 통신 | SSE |
| 6 | Backend | 고급 기능 | Statistics |
| 7 | Frontend | 인증/기반 | Login, TableSetup |
| 8 | Frontend | 메뉴/카테고리 | 메뉴 조회/관리 |
| 9 | Frontend | 장바구니/주문 | Cart, Order |
| 10 | Frontend | 주문 관리 | Dashboard, OrderHistory |
| 11 | Frontend | 테이블/서비스 | Table 관리 |
| 12 | Frontend | 고급 기능 | Statistics |
