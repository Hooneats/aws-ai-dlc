# 비즈니스 로직 모델 - Backend

---

## 1. 인증 플로우

### 1.1 관리자 로그인
```
입력: storeCode, username, password
1. Store 조회 (storeCode) → 없으면 에러
2. Admin 조회 (storeId, username) → 없으면 에러
3. bcrypt.compare(password, admin.password) → 불일치 시 에러
4. JWT 발급 (payload: {adminId, storeId, role: 'admin'}, 만료: 16시간)
5. 반환: {accessToken}
```

### 1.2 테이블 태블릿 인증
```
입력: storeCode, tableNo
1. Store 조회 (storeCode) → 없으면 에러
2. Table 조회 (storeId, tableNo) → 없으면 에러
3. 세션 확인:
   - sessionId 존재 → 기존 세션 유지
   - sessionId NULL → 새 세션 생성 (UUID, sessionStartedAt = NOW)
4. JWT 발급 (payload: {tableId, storeId, sessionId, role: 'table'}, 만료: 16시간)
5. 반환: {accessToken, tableNo, sessionId}
```

---

## 2. 메뉴/카테고리 관리 플로우

### 2.1 카테고리 CRUD
```
생성: name, sortOrder → Category 저장
수정: categoryId, name?, sortOrder? → Category 업데이트
삭제:
  1. isDefault=true → 에러 ("기타" 카테고리 삭제 불가)
  2. isServiceCategory=true → 에러 ("서비스 요청" 카테고리 삭제 불가)
  3. 해당 카테고리의 활성 메뉴 조회
  4. 메뉴 존재 → "기타" 카테고리(isDefault=true)로 메뉴 일괄 이동
  5. Category 삭제
조회 (고객): isHidden=false인 카테고리만 sortOrder 순
조회 (관리자): 전체 카테고리 sortOrder 순
```

### 2.2 메뉴 CRUD
```
생성: name, price, description?, categoryId, image? → Menu 저장
수정: menuId, fields → Menu 업데이트 (isActive=false인 메뉴 수정 불가)
삭제 (Soft Delete):
  1. Menu.isActive = false 설정
  2. 고객 메뉴 목록에서 제외
  3. 기존 주문 내역에는 menuName 스냅샷으로 유지
조회 (고객): isActive=true AND 카테고리 isHidden=false인 메뉴만
조회 (관리자): 전체 메뉴 (isActive 상태 표시)
```

### 2.3 할인가 계산
```
입력: menu
1. discountRate == 0 → finalPrice = price
2. discountRate > 0 → finalPrice = price - floor(price * discountRate / 100)
3. 반환: {originalPrice: price, discountRate, finalPrice}
```

---

## 3. 주문 플로우

### 3.1 주문 생성
```
입력: tableId, sessionId, items[{menuId, quantity}], memo?
1. Table 조회 → sessionId 일치 검증
2. 각 item에 대해:
   a. Menu 조회 (menuId)
   b. isActive=false → 에러 ("삭제된 메뉴")
   c. isSoldOut=true → 에러 ("품절 메뉴: {menuName}")
   d. 할인가 계산 → unitPrice 결정
   e. menuName, originalPrice, discountRate 스냅샷 저장
3. totalAmount = SUM(unitPrice * quantity)
4. Order 저장 (status: PENDING)
5. OrderItem 일괄 저장
6. SSE: emitNewOrder → 관리자
7. 반환: {orderId, orderNo, totalAmount}
```

### 3.2 주문 상태 변경 (관리자)
```
입력: orderId, newStatus
허용 전환:
  - PENDING → PREPARING
  - PENDING → CANCELLED
  - PREPARING → COMPLETED
  - PREPARING → CANCELLED
그 외 → 에러 ("허용되지 않는 상태 변경")

1. Order 조회
2. 상태 전환 검증
3. Order.status 업데이트
4. CANCELLED인 경우: Order.totalAmount 재계산 불필요 (이력 보존)
5. SSE: emitOrderStatus → 해당 테이블 고객
```

### 3.3 주문 항목 삭제 (관리자)
```
입력: orderId, orderItemId?
- orderItemId 없음 → 주문 전체 삭제
- orderItemId 있음 → 해당 항목만 삭제

전체 삭제:
  1. Order + OrderItem 전체 삭제
  2. SSE: emitOrderDeleted → 해당 테이블 고객

항목 삭제:
  1. OrderItem 삭제
  2. 남은 항목 확인 → 0개면 Order도 삭제
  3. totalAmount 재계산: SUM(남은 items의 unitPrice * quantity)
  4. SSE: emitOrderUpdated → 해당 테이블 고객
```

### 3.4 고객 주문 내역 조회
```
입력: sessionId
1. Order 조회 (sessionId, status != CANCELLED)
2. 각 Order에 대해 OrderItem 조회
3. 상태 매핑 (고객용):
   - PENDING, PREPARING → "주문완료"
   - COMPLETED → "주문완료"
   ※ CANCELLED 주문은 목록에서 제외
4. 반환: orders[{orderId, items, totalAmount, displayStatus, createdAt}]
```

> 고객에게는 CANCELLED 주문을 표시하지 않음. 관리자가 취소한 주문은 고객 화면에서 사라짐.

---

## 4. 테이블 관리 플로우

### 4.1 테이블 정산
```
입력: tableId
1. Table 조회 → sessionId 존재 검증
2. 현재 세션 주문 조회 (sessionId)
3. 미완료 주문 확인 (status = PENDING 또는 PREPARING)
   - 미완료 주문 존재 → 에러 반환 + 미완료 주문 목록 포함
     {error: "UNSETTLED_ORDERS", pendingOrders: [{orderId, status, items, totalAmount}]}
   - 관리자가 미완료 주문을 개별/전체 선택하여 완료/취소 처리 후 재시도
4. 모든 주문 완료/취소 확인 후:
   a. 세션 총 금액 계산 (COMPLETED 주문만 합산, CANCELLED 제외)
   b. OrderHistory 생성 (totalAmount, orderCount)
   c. 각 Order → OrderHistoryItem 변환 (items JSON 스냅샷)
   d. Order + OrderItem 삭제
   e. ServiceCall 삭제 (해당 테이블)
   f. Table.sessionId = NULL, sessionStartedAt = NULL
   g. SSE: emitSessionEnd → 해당 테이블 (장바구니 초기화 + 메뉴 화면 리셋)
```

### 4.2 주문 일괄 상태 변경 (정산 전 처리)
```
입력: orderIds[], newStatus (COMPLETED 또는 CANCELLED)
1. 각 orderId에 대해 상태 변경 실행 (3.2 로직 재사용)
2. 모든 변경 완료 후 반환
```

---

## 5. 서비스 호출 플로우

### 5.1 서비스 호출 요청
```
입력: tableId, menuId
1. Table 조회 → 세션 활성 검증
2. Menu 조회 → isActive 검증, 카테고리 isServiceCategory 검증
3. ServiceCall 저장 (status: PENDING, menuName 스냅샷)
4. SSE: emitServiceCall → 관리자
5. 반환: {serviceCallId}
```

### 5.2 서비스 호출 처리 (관리자)
```
확인: serviceCallId → status = CONFIRMED
완료: serviceCallId → status = COMPLETED
```

---

## 6. 매출 통계 플로우

### 6.1 실시간 대시보드
```
1. 오늘 날짜 기준 두 소스에서 집계:
   a. OrderHistory (오늘 settledAt 기준) → 정산 완료된 매출/건수
   b. 현재 활성 Order (오늘 createdAt, status=COMPLETED) → 미정산 매출/건수
2. 오늘 매출 = SUM(OrderHistory.totalAmount) + SUM(활성 COMPLETED Order.totalAmount)
3. 오늘 주문 건수 = SUM(OrderHistory.orderCount) + COUNT(활성 COMPLETED Order)
4. 영업 중 테이블 = COUNT(sessionId IS NOT NULL)
5. 객단가 = 오늘 매출 / 영업 중 테이블 (0이면 0)
6. 인기 메뉴 TOP 5 = OrderHistoryItem.items + 활성 OrderItem에서 GROUP BY menuName ORDER BY SUM(quantity) DESC LIMIT 5
7. 시간대별 추이 = OrderHistory.settledAt + 활성 Order.createdAt 기준 시간별 GROUP BY
```

### 6.2 일별 통계
```
입력: date
1. 해당 날짜의 OrderHistory + OrderHistoryItem 조회
2. 총 매출, 총 주문 건수
3. 테이블별 매출 = GROUP BY tableId
4. 메뉴별 판매 = items JSON에서 추출, GROUP BY menuName ORDER BY quantity DESC
```

### 6.3 기간별 통계
```
입력: startDate, endDate (최대 1년 = 365일)
1. endDate - startDate > 365 → 에러
2. 기간 내 OrderHistory 조회
3. 총 매출, 총 주문, 평균 일 매출
4. 일별 추이 = GROUP BY DATE(settledAt)
5. 메뉴별 순위 = items JSON 추출, GROUP BY menuName
6. 테이블별 순위 = GROUP BY tableId
7. 요일별 패턴 = GROUP BY DAYOFWEEK(settledAt)
```
