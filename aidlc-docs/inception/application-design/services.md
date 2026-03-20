# 서비스 레이어 설계

## 서비스 오케스트레이션 패턴

### 1. 주문 생성 플로우
```
고객 → OrderService.create()
         ├→ MenuService.findByIds() : 메뉴 존재/품절 검증
         ├→ MenuService.getDiscountedPrice() : 할인가 계산
         ├→ OrderRepository.save() : 주문 저장
         └→ SseService.emitNewOrder() : 관리자에게 실시간 알림
```

### 2. 주문 상태 변경 플로우
```
관리자 → OrderService.updateStatus()
           ├→ OrderRepository.update() : 상태 변경
           └→ SseService.emitOrderStatus() : 고객에게 실시간 반영
```

### 3. 테이블 정산 플로우
```
관리자 → TableService.settle()
           ├→ OrderService.moveToHistory() : 주문 이력 이동
           ├→ ServiceCallService.clearByTable() : 서비스 호출 정리
           ├→ TableRepository.resetSession() : 세션 리셋
           └→ SseService.emitSessionEnd() : 태블릿에 세션 종료 이벤트 (장바구니 초기화)
```

### 4. 서비스 호출 플로우
```
고객 → ServiceCallService.create()
         ├→ ServiceCallRepository.save() : 요청 저장
         └→ SseService.emitServiceCall() : 관리자에게 실시간 알림
```

### 5. 매출 통계 플로우
```
관리자 → StatisticsService.getTodayDashboard()
           ├→ OrderRepository.aggregateToday() : 오늘 매출/주문 집계
           ├→ TableRepository.countActive() : 영업 중 테이블 수
           └→ OrderRepository.getHourlyStats() : 시간대별 추이

관리자 → StatisticsService.getDailySummary()
           └→ OrderRepository.aggregate() : 일별 주문 데이터 집계

관리자 → StatisticsService.getPeriodSummary()
           └→ OrderRepository.aggregateRange() : 기간별 주문 데이터 집계
```

---

## 서비스 정의

| 서비스 | 책임 | 의존 서비스 |
|--------|------|------------|
| AuthService | 인증/토큰 관리 | - |
| StoreService | 매장 정보/Seed | - |
| TableService | 테이블 CRUD/정산 | OrderService, ServiceCallService, SseService |
| CategoryService | 카테고리 CRUD/순서 | - |
| MenuService | 메뉴 CRUD/추천/할인/품절 | CategoryService, UploadService |
| OrderService | 주문 생성/상태/이력 | MenuService, SseService |
| ServiceCallService | 서비스 호출 요청/처리 | SseService |
| SseService | SSE 연결/이벤트 발행 | - |
| StatisticsService | 매출 집계/대시보드 | OrderService, TableService |
| UploadService | 파일 업로드 | - |
