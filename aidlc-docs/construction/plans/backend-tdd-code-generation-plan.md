# TDD Code Generation Plan - Backend

## Unit Context
- **Workspace Root**: /Users/bl000130/Desktop/aws-ai-dlc
- **Project Type**: Greenfield (모놀리식)
- **Code Location**: `backend/` 디렉토리
- **Stories**: US-C01~C11, US-A01~A18 (29개)
- **Test Framework**: Jest
- **TDD Approach**: A (Test-Driven Development)

---

### Plan Step 0: 프로젝트 초기화 + Entity Skeleton
- [x] 0.1: NestJS 프로젝트 생성 (backend/)
- [x] 0.2: 의존성 설치 (TypeORM, MySQL, JWT, Passport, bcrypt, class-validator, Swagger, Winston, Multer)
- [x] 0.3: 공통 설정 (AppModule, DatabaseModule, LoggerModule, GlobalExceptionFilter, Guards, .env)
- [x] 0.4: 전체 Entity 생성 (Store, Admin, Table, Category, Menu, Order, OrderItem, OrderHistory, OrderHistoryItem, ServiceCall)
- [x] 0.5: 전체 Module/Controller/Service 스켈레톤 생성 (NotImplementedError)
- [x] 0.6: DTO 스켈레톤 생성
- [x] 0.7: docker-compose.yml + Dockerfile 생성
- [x] 0.8: 컴파일 확인

### Plan Step 1: SeedService + StoreService (인프라 기반)
- [x] 1.1: SeedService.seed() - RED-GREEN-REFACTOR (TC-BE-042)
- [x] 1.2: StoreService.getStore() - RED-GREEN-REFACTOR

### Plan Step 2: AuthService (인증)
- [x] 2.1: AuthService.adminLogin() - RED-GREEN-REFACTOR (TC-BE-001~003)
- [x] 2.2: AuthService.tableLogin() - RED-GREEN-REFACTOR (TC-BE-004~005)
- [x] 2.3: JwtStrategy + Guards 통합 테스트

### Plan Step 3: CategoryService (기본 CRUD)
- [x] 3.1: CategoryService.create() - RED-GREEN-REFACTOR (TC-BE-006)
- [x] 3.2: CategoryService.findAll() - RED-GREEN-REFACTOR (TC-BE-010)
- [x] 3.3: CategoryService.update() - RED-GREEN-REFACTOR
- [x] 3.4: CategoryService.delete() - RED-GREEN-REFACTOR (TC-BE-007~009)
- [x] 3.5: CategoryService.updateOrder() - RED-GREEN-REFACTOR

### Plan Step 4: UploadService (파일 업로드)
- [x] 4.1: UploadService.uploadImage() - RED-GREEN-REFACTOR (TC-BE-040~041)

### Plan Step 5: MenuService (메뉴 관리)
- [x] 5.1: MenuService.create() - RED-GREEN-REFACTOR (TC-BE-011)
- [x] 5.2: MenuService.findAll() + findByCategory() + findRecommended() - RED-GREEN-REFACTOR
- [x] 5.3: MenuService.update() - RED-GREEN-REFACTOR
- [x] 5.4: MenuService.delete() (Soft Delete) - RED-GREEN-REFACTOR (TC-BE-012)
- [x] 5.5: MenuService.getDiscountedPrice() - RED-GREEN-REFACTOR (TC-BE-015~016)
- [x] 5.6: MenuService.setRecommended/setDiscount/setSoldOut() - RED-GREEN-REFACTOR (TC-BE-013~014)
- [x] 5.7: MenuService.findByIds() + updateOrder() - RED-GREEN-REFACTOR

### Plan Step 6: TableService (테이블 기본 CRUD)
- [x] 6.1: TableService.create() - RED-GREEN-REFACTOR (TC-BE-029~030)
- [x] 6.2: TableService.delete() - RED-GREEN-REFACTOR (TC-BE-031)
- [x] 6.3: TableService.findAll() + setup() - RED-GREEN-REFACTOR

### Plan Step 7: SseService (실시간 통신)
- [x] 7.1: SseService 연결 관리 + 이벤트 발행 - RED-GREEN-REFACTOR (TC-BE-036)
- [x] 7.2: SseService 이벤트 버퍼 + Last-Event-ID 재전송 - RED-GREEN-REFACTOR (TC-BE-037)
- [x] 7.3: SseService 버퍼 삭제 정책 (정산 클리어, 5분 타이머)

### Plan Step 8: OrderService (핵심 비즈니스)
- [x] 8.1: OrderService.create() - RED-GREEN-REFACTOR (TC-BE-017~020)
- [x] 8.2: OrderService.updateStatus() - RED-GREEN-REFACTOR (TC-BE-021~023)
- [x] 8.3: OrderService.cancel() - RED-GREEN-REFACTOR (TC-BE-024~025)
- [x] 8.4: OrderService.delete() + deleteItem() - RED-GREEN-REFACTOR (TC-BE-026~027)
- [x] 8.5: OrderService.findBySession() + findByTable() - RED-GREEN-REFACTOR (TC-BE-028)
- [x] 8.6: OrderService.batchUpdateStatus() + moveToHistory() - RED-GREEN-REFACTOR

### Plan Step 9: ServiceCallService (서비스 호출)
- [x] 9.1: ServiceCallService.create() - RED-GREEN-REFACTOR (TC-BE-034~035)
- [x] 9.2: ServiceCallService.confirm() + complete() + findPending() - RED-GREEN-REFACTOR
- [x] 9.3: ServiceCallService.clearByTable() - RED-GREEN-REFACTOR

### Plan Step 10: TableService.settle() (정산 통합)
- [x] 10.1: TableService.settle() - RED-GREEN-REFACTOR (TC-BE-032~033)
- [x] 10.2: TableService.getHistory() - RED-GREEN-REFACTOR

### Plan Step 11: StatisticsService (고급 기능)
- [x] 11.1: StatisticsService.getTodayDashboard() - RED-GREEN-REFACTOR (TC-BE-038)
- [x] 11.2: StatisticsService.getDailySummary() + getByTable() + getByMenu() - RED-GREEN-REFACTOR
- [x] 11.3: StatisticsService.getPeriodSummary() - RED-GREEN-REFACTOR (TC-BE-039)

### Plan Step 12: API Layer (Controller 통합)
- [x] 12.1: AuthController 엔드포인트 연결 + Swagger 데코레이터
- [x] 12.2: CategoryController 엔드포인트 + Guard 적용
- [x] 12.3: MenuController 엔드포인트 + Guard 적용
- [x] 12.4: TableController 엔드포인트 + Guard 적용
- [x] 12.5: OrderController 엔드포인트 + Guard 적용
- [x] 12.6: ServiceCallController 엔드포인트 + Guard 적용
- [x] 12.7: SseController 엔드포인트 + Guard 적용
- [x] 12.8: StatisticsController 엔드포인트 + Guard 적용
- [x] 12.9: UploadController 엔드포인트 + Guard 적용

### Plan Step 13: 추가 산출물
- [x] 13.1: Flyway 통계 더미 데이터 마이그레이션 스크립트
- [x] 13.2: Swagger 설정 (main.ts)
- [x] 13.3: README.md (Backend 실행 가이드)

### Plan Step 14: 최종 검증
- [x] 14.1: 전체 테스트 실행 (58개 TC 전체 통과 확인)
- [x] 14.2: 컴파일 확인
- [x] 14.3: test-plan.md 상태 업데이트
