# 컴포넌트 메서드 시그니처

> 상세 비즈니스 로직은 Construction Phase의 Functional Design에서 정의

## AuthModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| adminLogin | storeCode, username, password | JWT token | 관리자 로그인 |
| tableLogin | storeCode, tableNo | JWT token | 테이블 태블릿 인증 (비밀번호 없음) |
| validateToken | token | payload | JWT 검증 |
| hashPassword | password | hashedPassword | bcrypt 해싱 |

## StoreModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| getStore | - | Store | 매장 정보 조회 |
| seed | - | void | 초기 데이터 생성 |

## TableModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| create | tableNo | Table | 테이블 추가 |
| delete | tableId | void | 테이블 삭제 |
| findAll | - | Table[] | 전체 테이블 조회 |
| setup | tableId | session | 태블릿 초기 설정 (비밀번호 없음) |
| settle | tableId | void | 테이블 정산 (이력 이동+리셋) |
| getHistory | tableId, date? | OrderHistory[] | 과거 주문 내역 조회 |

## CategoryModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| create | name, sortOrder | Category | 카테고리 추가 |
| update | categoryId, name?, sortOrder? | Category | 카테고리 수정 |
| delete | categoryId | void | 카테고리 삭제 |
| findAll | - | Category[] | 전체 카테고리 조회 (순서대로) |
| updateOrder | categoryId[], sortOrders[] | void | 순서 일괄 변경 |

## MenuModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| create | name, price, desc, categoryId, image? | Menu | 메뉴 등록 |
| update | menuId, fields | Menu | 메뉴 수정 |
| delete | menuId | void | 메뉴 삭제 |
| findByCategory | categoryId | Menu[] | 카테고리별 메뉴 조회 |
| findByIds | menuId[] | Menu[] | 복수 메뉴 조회 (주문 생성 시 검증용) |
| findAll | - | Menu[] | 전체 메뉴 조회 |
| findRecommended | - | Menu[] | 추천 메뉴 조회 |
| getDiscountedPrice | menuId | {originalPrice, discountRate, finalPrice} | 할인가 계산 |
| setRecommended | menuId, isRecommended | Menu | 추천 설정/해제 |
| setDiscount | menuId, discountRate | Menu | 할인율 설정/해제 |
| setSoldOut | menuId, isSoldOut | Menu | 품절 설정/해제 |
| updateOrder | menuId[], sortOrders[] | void | 순서 일괄 변경 |
| uploadImage | menuId, file | imageUrl | 이미지 업로드 |

## OrderModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| create | tableId, sessionId, items[], memo? | Order | 주문 생성 |
| updateStatus | orderId, status | Order | 상태 변경 (PENDING→PREPARING→COMPLETED, 취소: PENDING/PREPARING→CANCELLED) |
| cancel | orderId | Order | 주문 취소 |
| deleteItem | orderId, orderItemId | void | 주문 내 특정 항목 삭제 |
| findBySession | sessionId | Order[] | 현재 세션 주문 조회 |
| findByTable | tableId, date? | Order[] | 테이블별 주문 조회 |
| delete | orderId | void | 주문 전체 삭제 |
| batchUpdateStatus | orderIds[], status | void | 주문 일괄 상태 변경 (정산 전 처리) |
| moveToHistory | sessionId | void | 정산 시 이력 이동 |

## ServiceCallModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| create | tableId, menuId(서비스항목) | ServiceCall | 서비스 호출 요청 |
| confirm | serviceCallId | ServiceCall | 요청 확인 처리 |
| complete | serviceCallId | ServiceCall | 요청 완료 처리 |
| findPending | - | ServiceCall[] | 미처리 요청 조회 |
| clearByTable | tableId | void | 테이블 정산 시 서비스 호출 정리 |

## SseModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| connectAdmin | - | SSE stream | 관리자 SSE 연결 |
| connectTable | tableId | SSE stream | 고객 SSE 연결 |
| emitNewOrder | order | void | 신규 주문 이벤트 |
| emitOrderStatus | orderId, status | void | 상태 변경 이벤트 |
| emitOrderDeleted | orderId, tableId | void | 주문 삭제 이벤트 (관리자+고객) |
| emitOrderUpdated | orderId, tableId, items, totalAmount | void | 주문 항목 삭제 이벤트 (관리자+고객) |
| emitServiceCall | serviceCall | void | 서비스 호출 이벤트 |
| emitSessionEnd | tableId | void | 테이블 세션 종료 이벤트 (장바구니 초기화) |

## StatisticsModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| getTodayDashboard | - | {sales, orders, activeTables, totalTables, avgPerTable, topMenus[], hourlyStats[]} | 실시간 현황 대시보드 |
| getDailySummary | date | {totalSales, totalOrders} | 일별 매출 요약 |
| getByTable | date | TableStat[] | 테이블별 매출 (일별) |
| getByMenu | date | MenuStat[] | 메뉴별 판매 현황 (일별) |
| getPeriodSummary | startDate, endDate | {totalSales, totalOrders, avgDailySales, dailyTrend[], menuRanking[], tableRanking[], dayOfWeekPattern[]} | 기간별 매출 통계 |

## UploadModule

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| uploadImage | file | imageUrl | 이미지 업로드 |
| serveStatic | path | file | 정적 파일 서빙 |
