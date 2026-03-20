# Test Plan - Backend

## Unit Overview
- **Unit**: Backend (NestJS)
- **Stories**: US-C01~C11, US-A01~A18 (29개)
- **Test Framework**: Jest (NestJS 기본)

---

## AuthService Tests

### AuthService.adminLogin()
- **TC-BE-001**: 유효한 자격증명으로 로그인 성공
  - Given: Seed된 Store/Admin 존재
  - When: adminLogin("store01", "admin", "admin1234")
  - Then: JWT accessToken 반환
  - Story: US-A01 | Status: ⬜

- **TC-BE-002**: 잘못된 매장 코드로 로그인 실패
  - Given: 존재하지 않는 매장 코드
  - When: adminLogin("invalid", "admin", "admin1234")
  - Then: UnauthorizedException
  - Story: US-A01 | Status: ⬜

- **TC-BE-003**: 잘못된 비밀번호로 로그인 실패
  - Given: 유효한 매장/사용자명, 잘못된 비밀번호
  - When: adminLogin("store01", "admin", "wrong")
  - Then: UnauthorizedException
  - Story: US-A01 | Status: ⬜

### AuthService.tableLogin()
- **TC-BE-004**: 유효한 테이블 번호로 로그인 성공 (새 세션)
  - Given: 테이블 존재, sessionId=NULL
  - When: tableLogin("store01", 1)
  - Then: accessToken + 새 sessionId 반환
  - Story: US-C01 | Status: ⬜

- **TC-BE-005**: 기존 세션 유지
  - Given: 테이블에 기존 sessionId 존재
  - When: tableLogin("store01", 1)
  - Then: 기존 sessionId 유지
  - Story: US-C01 | Status: ⬜

---

## CategoryService Tests

### CategoryService.create()
- **TC-BE-006**: 카테고리 생성 성공
  - Given: 유효한 storeId, name
  - When: create(storeId, "한식", 1)
  - Then: Category 반환
  - Story: US-A13 | Status: ⬜

### CategoryService.delete()
- **TC-BE-007**: 기본 카테고리 삭제 시도 → 에러
  - Given: isDefault=true 카테고리
  - When: delete(categoryId)
  - Then: BadRequestException
  - Story: US-A13 | Status: ⬜

- **TC-BE-008**: 서비스 카테고리 삭제 시도 → 에러
  - Given: isServiceCategory=true 카테고리
  - When: delete(categoryId)
  - Then: BadRequestException
  - Story: US-A13 | Status: ⬜

- **TC-BE-009**: 메뉴 있는 카테고리 삭제 → 기타로 이동
  - Given: 카테고리에 메뉴 2개 존재
  - When: delete(categoryId)
  - Then: 메뉴가 "기타" 카테고리로 이동, 카테고리 삭제
  - Story: US-A13 | Status: ⬜

### CategoryService.findAll()
- **TC-BE-010**: 고객용 조회 (isHidden=false만)
  - Given: 일반 카테고리 2개 + 기타(hidden) 1개
  - When: findAll(storeId, includeHidden=false)
  - Then: 2개만 반환
  - Story: US-C03 | Status: ⬜

---

## MenuService Tests

### MenuService.create()
- **TC-BE-011**: 메뉴 생성 성공
  - Given: 유효한 데이터
  - When: create(storeId, "김치찌개", 10000, null, categoryId)
  - Then: Menu 반환 (isActive=true)
  - Story: US-A09 | Status: ⬜

### MenuService.delete()
- **TC-BE-012**: Soft Delete 성공
  - Given: 활성 메뉴
  - When: delete(menuId)
  - Then: isActive=false
  - Story: US-A09 | Status: ⬜

### MenuService.setDiscount()
- **TC-BE-013**: 유효한 할인율 설정
  - Given: 활성 메뉴
  - When: setDiscount(menuId, 20)
  - Then: discountRate=20
  - Story: US-A11 | Status: ⬜

- **TC-BE-014**: 범위 초과 할인율 → 에러
  - Given: 활성 메뉴
  - When: setDiscount(menuId, 100)
  - Then: BadRequestException
  - Story: US-A11 | Status: ⬜

### MenuService.getDiscountedPrice()
- **TC-BE-015**: 할인가 계산 정확성
  - Given: price=10000, discountRate=15
  - When: getDiscountedPrice(menu)
  - Then: finalPrice=8500 (10000 - floor(10000*15/100))
  - Story: US-C04 | Status: ⬜

- **TC-BE-016**: 할인 없는 메뉴
  - Given: price=10000, discountRate=0
  - When: getDiscountedPrice(menu)
  - Then: finalPrice=10000
  - Story: US-C04 | Status: ⬜

---

## OrderService Tests

### OrderService.create()
- **TC-BE-017**: 주문 생성 성공
  - Given: 활성 메뉴 2개, 유효한 세션
  - When: create(tableId, sessionId, [{menuId:1, qty:2}, {menuId:2, qty:1}], "덜 맵게")
  - Then: Order(PENDING) + OrderItems + totalAmount 계산 + SSE emitNewOrder
  - Story: US-C07 | Status: ⬜

- **TC-BE-018**: 품절 메뉴 주문 → 에러
  - Given: isSoldOut=true 메뉴 포함
  - When: create(...)
  - Then: BadRequestException "품절된 메뉴"
  - Story: US-C07 | Status: ⬜

- **TC-BE-019**: 비활성 메뉴 주문 → 에러
  - Given: isActive=false 메뉴 포함
  - When: create(...)
  - Then: BadRequestException "주문할 수 없는 메뉴"
  - Story: US-C07 | Status: ⬜

- **TC-BE-020**: 할인 메뉴 주문 시 할인가 적용
  - Given: price=10000, discountRate=20 메뉴
  - When: create(..., [{menuId, qty:2}])
  - Then: unitPrice=8000, totalAmount=16000
  - Story: US-C07 | Status: ⬜

### OrderService.updateStatus()
- **TC-BE-021**: PENDING → PREPARING 성공
  - Given: PENDING 주문
  - When: updateStatus(orderId, 'PREPARING')
  - Then: status=PREPARING + SSE emitOrderStatus
  - Story: US-A03 | Status: ⬜

- **TC-BE-022**: PREPARING → COMPLETED 성공
  - Given: PREPARING 주문
  - When: updateStatus(orderId, 'COMPLETED')
  - Then: status=COMPLETED
  - Story: US-A03 | Status: ⬜

- **TC-BE-023**: COMPLETED → PREPARING 거부
  - Given: COMPLETED 주문
  - When: updateStatus(orderId, 'PREPARING')
  - Then: BadRequestException
  - Story: US-A03 | Status: ⬜

### OrderService.cancel()
- **TC-BE-024**: PENDING 주문 취소 성공
  - Given: PENDING 주문
  - When: cancel(orderId)
  - Then: status=CANCELLED
  - Story: US-A03 | Status: ⬜

- **TC-BE-025**: COMPLETED 주문 취소 거부
  - Given: COMPLETED 주문
  - When: cancel(orderId)
  - Then: BadRequestException
  - Story: US-A03 | Status: ⬜

### OrderService.deleteItem()
- **TC-BE-026**: 주문 항목 삭제 + totalAmount 재계산
  - Given: 주문에 항목 2개 (9000*2 + 5000*1 = 23000)
  - When: deleteItem(orderId, itemId_of_5000)
  - Then: totalAmount=18000 + SSE emitOrderUpdated
  - Story: US-A06 | Status: ⬜

- **TC-BE-027**: 마지막 항목 삭제 → 주문 자체 삭제
  - Given: 주문에 항목 1개
  - When: deleteItem(orderId, itemId)
  - Then: Order 삭제 + SSE emitOrderDeleted
  - Story: US-A06 | Status: ⬜

### OrderService.findBySession()
- **TC-BE-028**: 고객 조회 시 CANCELLED 제외
  - Given: 세션에 COMPLETED 1개 + CANCELLED 1개
  - When: findBySession(sessionId)
  - Then: 1개만 반환 (CANCELLED 제외)
  - Story: US-C09 | Status: ⬜

---

## TableService Tests

### TableService.create()
- **TC-BE-029**: 테이블 생성 성공
  - Given: 유효한 storeId, tableNo
  - When: create(storeId, 1)
  - Then: TableEntity 반환
  - Story: US-A04 | Status: ⬜

- **TC-BE-030**: 중복 테이블 번호 → 에러
  - Given: tableNo=1 이미 존재
  - When: create(storeId, 1)
  - Then: ConflictException
  - Story: US-A04 | Status: ⬜

### TableService.delete()
- **TC-BE-031**: 활성 세션 테이블 삭제 거부
  - Given: sessionId 존재하는 테이블
  - When: delete(tableId)
  - Then: BadRequestException
  - Story: US-A04 | Status: ⬜

### TableService.settle()
- **TC-BE-032**: 정산 성공 (모든 주문 완료/취소)
  - Given: COMPLETED 2개 + CANCELLED 1개
  - When: settle(tableId)
  - Then: OrderHistory 생성 (COMPLETED만 합산) + Order 삭제 + sessionId=NULL + SSE emitSessionEnd
  - Story: US-A07 | Status: ⬜

- **TC-BE-033**: 미완료 주문 존재 시 정산 거부
  - Given: COMPLETED 1개 + PENDING 1개
  - When: settle(tableId)
  - Then: BadRequestException + pendingOrders 목록
  - Story: US-A07 | Status: ⬜

---

## ServiceCallService Tests

### ServiceCallService.create()
- **TC-BE-034**: 서비스 호출 성공
  - Given: 서비스 카테고리 메뉴, 활성 세션
  - When: create(tableId, menuId)
  - Then: ServiceCall(PENDING) + SSE emitServiceCall
  - Story: US-C11 | Status: ⬜

- **TC-BE-035**: 비서비스 항목으로 호출 → 에러
  - Given: 일반 카테고리 메뉴
  - When: create(tableId, menuId)
  - Then: BadRequestException
  - Story: US-C11 | Status: ⬜

---

## SseService Tests

### SseService
- **TC-BE-036**: 관리자 SSE 연결 + 이벤트 수신
  - Given: 관리자 SSE 연결
  - When: emitNewOrder 호출
  - Then: 관리자에게 이벤트 전달
  - Story: US-A02 | Status: ⬜

- **TC-BE-037**: Last-Event-ID 기반 재전송
  - Given: 이벤트 3개 발행 (ID: 1,2,3), 연결 끊김
  - When: 재연결 (Last-Event-ID: 1)
  - Then: ID 2,3 재전송
  - Story: US-A02 | Status: ⬜

---

## StatisticsService Tests

### StatisticsService.getTodayDashboard()
- **TC-BE-038**: 실시간 대시보드 정확성
  - Given: 오늘 정산 이력 50000원 + 활성 COMPLETED 30000원
  - When: getTodayDashboard(storeId)
  - Then: sales=80000, 정확한 집계
  - Story: US-A16 | Status: ⬜

### StatisticsService.getPeriodSummary()
- **TC-BE-039**: 기간 365일 초과 → 에러
  - Given: startDate~endDate = 366일
  - When: getPeriodSummary(...)
  - Then: BadRequestException
  - Story: US-A18 | Status: ⬜

---

## UploadService Tests

### UploadService.uploadImage()
- **TC-BE-040**: 이미지 업로드 성공
  - Given: 유효한 jpg 파일 (1MB)
  - When: uploadImage(file)
  - Then: imageUrl 반환
  - Story: US-A09 | Status: ⬜

- **TC-BE-041**: 허용되지 않는 형식 → 에러
  - Given: .exe 파일
  - When: uploadImage(file)
  - Then: BadRequestException
  - Story: US-A09 | Status: ⬜

---

## SeedService Tests

- **TC-BE-042**: Seed 데이터 생성 (멱등성)
  - Given: 빈 DB
  - When: seed() 2회 실행
  - Then: Store 1개, Admin 1개, Category 2개 (중복 없음)
  - Story: US-A01 | Status: ⬜

---

## Requirements Coverage

| 요구사항 | 테스트 케이스 | Status |
|---------|-------------|--------|
| FR-C01 (자동 로그인) | TC-BE-004, 005 | ⬜ |
| FR-C02 (메뉴 조회) | TC-BE-010, 015, 016 | ⬜ |
| FR-C04 (주문 생성) | TC-BE-017~020 | ⬜ |
| FR-C05 (주문 내역) | TC-BE-028 | ⬜ |
| FR-C06 (서비스 호출) | TC-BE-034, 035 | ⬜ |
| FR-A01 (매장 인증) | TC-BE-001~003, 042 | ⬜ |
| FR-A02 (실시간 모니터링) | TC-BE-036, 037 | ⬜ |
| FR-A03 (테이블 관리) | TC-BE-029~033 | ⬜ |
| FR-A04 (메뉴 관리) | TC-BE-011~014, 040, 041 | ⬜ |
| FR-A04-1 (카테고리 관리) | TC-BE-006~010 | ⬜ |
| FR-A06 (매출 통계) | TC-BE-038, 039 | ⬜ |
| BR-ORD (주문 규칙) | TC-BE-021~027 | ⬜ |
