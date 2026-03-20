# 컴포넌트 의존성

## 의존성 매트릭스

| 모듈 (행→열 의존) | Auth | Store | Table | Category | Menu | Order | ServiceCall | Sse | Statistics | Upload |
|-------------------|------|-------|-------|----------|------|-------|-------------|-----|-----------|--------|
| **AuthModule**    |  -   |   O   |       |          |      |       |             |     |           |        |
| **StoreModule**   |      |   -   |       |          |      |       |             |     |           |        |
| **TableModule**   |  O   |       |   -   |          |      |   O   |      O      |  O  |           |        |
| **CategoryModule**|      |       |       |    -     |      |       |             |     |           |        |
| **MenuModule**    |      |       |       |    O     |  -   |       |             |     |           |   O    |
| **OrderModule**   |      |       |       |          |  O   |   -   |             |  O  |           |        |
| **ServiceCall**   |      |       |       |          |      |       |      -      |  O  |           |        |
| **SseModule**     |      |       |       |          |      |       |             |  -  |           |        |
| **Statistics**    |      |       |   O   |          |      |   O   |             |     |     -     |        |
| **UploadModule**  |      |       |       |          |      |       |             |     |           |   -    |

## 통신 패턴

### REST API (동기: Frontend → Backend)
- 고객 → MenuModule: 메뉴/카테고리 조회
- 고객 → OrderModule: 주문 생성, 주문 내역 조회
- 고객 → ServiceCallModule: 서비스 호출 요청
- 고객 → AuthModule: 테이블 태블릿 인증
- 관리자 → AuthModule: 로그인
- 관리자 → TableModule: 테이블 CRUD, 정산
- 관리자 → MenuModule: 메뉴 CRUD, 추천/할인/품절
- 관리자 → CategoryModule: 카테고리 CRUD
- 관리자 → OrderModule: 주문 상태 변경, 삭제
- 관리자 → ServiceCallModule: 요청 확인/완료
- 관리자 → StatisticsModule: 매출 통계 조회
- 관리자 → UploadModule: 이미지 업로드

### SSE (비동기: Backend → Frontend)
- SseModule → 관리자: 신규 주문, 서비스 호출 알림
- SseModule → 고객: 주문 상태 변경

### 내부 호출 (모듈 간)
- OrderModule → MenuModule: 품절 검증(findByIds), 할인가 계산(getDiscountedPrice)
- OrderModule → SseModule: 신규 주문/상태 변경 이벤트 발행
- ServiceCallModule → SseModule: 서비스 호출 이벤트 발행
- TableModule → OrderModule: 정산 시 이력 이동(moveToHistory)
- TableModule → ServiceCallModule: 정산 시 서비스 호출 정리(clearByTable)
- TableModule → SseModule: 정산 시 세션 종료 이벤트 발행(emitSessionEnd)
- MenuModule → CategoryModule: 카테고리 검증
- MenuModule → UploadModule: 이미지 업로드
- StatisticsModule → OrderModule: 주문 데이터 집계
- StatisticsModule → TableModule: 영업 중 테이블 수 조회
- AuthModule → StoreModule: 매장 정보 검증

## 데이터 흐름도

```
+----------+    REST     +-----------+    MySQL    +--------+
|          | ----------> |           | ----------> |        |
| Frontend |             |  Backend  |             |   DB   |
|  (React) | <---------- |  (NestJS) | <---------- |        |
|          |    SSE      |           |             +--------+
+----------+             +-----------+
                               |
                               | 로컬 파일시스템
                               v
                         +-----------+
                         |  uploads/ |
                         |  (이미지) |
                         +-----------+
```
