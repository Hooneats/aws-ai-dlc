# Integration Test 가이드

## 목적

Backend 서비스 간 상호작용과 실제 DB 연동을 검증합니다.

## 테스트 환경 구성

```bash
# 1. MySQL 컨테이너 시작
docker-compose up -d mysql

# 2. MySQL healthcheck 대기
docker-compose logs -f mysql
# "ready for connections" 메시지 확인
```

## E2E 테스트 실행

```bash
cd backend

# 로컬 DB 연결 설정 (.env에서 DB_HOST=localhost 확인)
npm run test:e2e
```

설정 파일: `backend/test/jest-e2e.json`

## 통합 테스트 시나리오

### 시나리오 1: 고객 주문 플로우

| 단계 | API | 검증 항목 |
|------|-----|----------|
| 1 | `POST /auth/table-login` | 테이블 로그인 → JWT + sessionId 반환 |
| 2 | `GET /categories?includeHidden=false` | 고객용 카테고리 조회 (hidden 제외) |
| 3 | `GET /menus?categoryId=X` | 카테고리별 메뉴 조회 (품절/비활성 표시) |
| 4 | `POST /orders` | 주문 생성 → PENDING 상태 |
| 5 | `GET /orders/session/:sessionId` | 주문 내역 조회 (CANCELLED 제외) |

### 시나리오 2: 관리자 주문 처리 플로우

| 단계 | API | 검증 항목 |
|------|-----|----------|
| 1 | `POST /auth/admin-login` | 관리자 로그인 → JWT 반환 |
| 2 | `GET /sse/admin` | SSE 연결 수립 |
| 3 | (고객이 주문 생성) | SSE로 `new-order` 이벤트 수신 확인 |
| 4 | `PATCH /orders/:id/status` | PENDING → PREPARING 상태 변경 |
| 5 | `PATCH /orders/:id/status` | PREPARING → COMPLETED 상태 변경 |

### 시나리오 3: 테이블 정산 플로우

| 단계 | API | 검증 항목 |
|------|-----|----------|
| 1 | 모든 주문 COMPLETED/CANCELLED 상태 | 전제 조건 |
| 2 | `POST /tables/:id/settle` | 정산 실행 |
| 3 | DB 확인 | OrderHistory 생성, Order 삭제, sessionId=NULL |

### 시나리오 4: 메뉴/카테고리 관리

| 단계 | API | 검증 항목 |
|------|-----|----------|
| 1 | `POST /categories` | 카테고리 생성 |
| 2 | `POST /menus` | 해당 카테고리에 메뉴 생성 |
| 3 | `DELETE /categories/:id` | 카테고리 삭제 → 메뉴가 "기타"로 이동 확인 |

### 시나리오 5: 할인 적용 주문

| 단계 | API | 검증 항목 |
|------|-----|----------|
| 1 | `PATCH /menus/:id/discount` | 할인율 20% 설정 |
| 2 | `POST /orders` | 주문 생성 시 할인가 적용 확인 |
| 3 | DB 확인 | unitPrice = 원가 - floor(원가 * 할인율 / 100) |

## 수동 통합 테스트 (curl)

```bash
# 관리자 로그인
curl -X POST http://localhost:3000/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"store01","username":"admin","password":"admin1234"}'

# 테이블 로그인
curl -X POST http://localhost:3000/auth/table-login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"store01","tableNo":1}'

# 카테고리 조회
curl http://localhost:3000/categories \
  -H "Authorization: Bearer <TOKEN>"

# 주문 생성
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"items":[{"menuId":1,"quantity":2}],"request":"덜 맵게"}'
```

## Swagger UI 활용

`http://localhost:3000/api` 에서 모든 API를 인터랙티브하게 테스트할 수 있습니다.

1. Swagger UI 접속
2. `/auth/admin-login` 또는 `/auth/table-login` 실행
3. 반환된 JWT를 Authorize 버튼에 입력
4. 각 API 엔드포인트 테스트
