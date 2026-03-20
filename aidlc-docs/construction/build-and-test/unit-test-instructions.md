# Unit Test 실행 가이드

## 테스트 환경

| 항목 | 값 |
|------|---|
| Framework | Jest 30.x |
| Language | TypeScript (ts-jest) |
| 테스트 파일 패턴 | `src/**/*.spec.ts` |
| 커버리지 디렉토리 | `backend/coverage/` |

## TDD Artifacts 확인

이 프로젝트는 TDD 방식으로 코드가 생성되었습니다.
- `aidlc-docs/construction/plans/backend-test-plan.md` - 42개 테스트 케이스 정의
- `aidlc-docs/construction/plans/backend-contracts.md` - 서비스 계약 정의

## 테스트 실행

### 전체 Unit Test 실행

```bash
cd backend
npm test
```

### 커버리지 포함 실행

```bash
cd backend
npm run test:cov
```

커버리지 리포트: `backend/coverage/lcov-report/index.html`

### 특정 서비스 테스트만 실행

```bash
# AuthService
npx jest --testPathPattern=auth.service.spec

# OrderService
npx jest --testPathPattern=order.service.spec

# TableService (settle 포함)
npx jest --testPathPattern=table

# CategoryService
npx jest --testPathPattern=category.service.spec

# MenuService
npx jest --testPathPattern=menu.service.spec

# ServiceCallService
npx jest --testPathPattern=service-call.service.spec

# SseService
npx jest --testPathPattern=sse.service.spec

# StatisticsService
npx jest --testPathPattern=statistics.service.spec

# SeedService
npx jest --testPathPattern=seed.service.spec

# UploadService
npx jest --testPathPattern=upload.service.spec

# StoreService
npx jest --testPathPattern=store.service.spec
```

### Watch 모드 (개발 중 자동 재실행)

```bash
cd backend
npm run test:watch
```

## 테스트 케이스 목록 (42개)

| 서비스 | 테스트 ID | 설명 |
|--------|----------|------|
| AuthService | TC-BE-001~003 | 관리자 로그인 (성공/실패) |
| AuthService | TC-BE-004~005 | 테이블 로그인 (새 세션/기존 세션) |
| CategoryService | TC-BE-006~010 | 카테고리 CRUD + 삭제 규칙 |
| MenuService | TC-BE-011~016 | 메뉴 CRUD + 할인 계산 |
| OrderService | TC-BE-017~028 | 주문 생성/상태변경/취소/항목삭제 |
| TableService | TC-BE-029~033 | 테이블 CRUD + 정산 |
| ServiceCallService | TC-BE-034~035 | 서비스 호출 |
| SseService | TC-BE-036~037 | SSE 연결 + 재전송 |
| StatisticsService | TC-BE-038~039 | 대시보드 + 기간 조회 |
| UploadService | TC-BE-040~041 | 이미지 업로드 |
| SeedService | TC-BE-042 | Seed 멱등성 |

## 예상 결과

- 전체 테스트: 42개 pass, 0 failures
- 커버리지 목표: 서비스 레이어 80% 이상

## 실패 시 대응

1. 실패한 테스트 확인: `npm test -- --verbose`
2. 특정 테스트 디버그: `npm run test:debug`
3. Mock 설정 확인: 각 `.spec.ts` 파일의 `beforeEach` 블록 점검
