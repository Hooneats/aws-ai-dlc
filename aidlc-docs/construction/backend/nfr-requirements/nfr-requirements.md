# NFR 요구사항 - Backend

---

## 1. 성능

| ID | 요구사항 | 기준 |
|----|---------|------|
| NFR-PERF-01 | SSE 이벤트 전달 지연 | 주문 생성 후 2초 이내 관리자 화면 표시 |
| NFR-PERF-02 | API 응답 시간 | 일반 CRUD: 200ms 이내, 통계 조회: 1초 이내 |
| NFR-PERF-03 | 동시 SSE 연결 | 최소 50개 (테이블 + 관리자) |
| NFR-PERF-04 | 장바구니 | 클라이언트 로컬 저장 (서버 부하 없음) |

## 2. 보안

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-SEC-01 | 인증 | JWT 토큰 (관리자 16시간, 테이블 16시간) |
| NFR-SEC-02 | 비밀번호 | bcrypt 해싱 (saltRounds: 10) |
| NFR-SEC-03 | API 보호 | JWT Guard (관리자용/테이블용 분리) |
| NFR-SEC-04 | CORS | Frontend 도메인만 허용 |
| NFR-SEC-05 | 입력 검증 | class-validator DTO 검증, SQL Injection 방지 (TypeORM 파라미터 바인딩) |
| NFR-SEC-06 | 파일 업로드 | 확장자/크기 제한, 실행 파일 차단 |

## 3. 안정성

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-REL-01 | 에러 처리 | Global Exception Filter, 표준화된 에러 응답 |
| NFR-REL-02 | SSE 재연결 | 클라이언트 자동 재연결 (EventSource 기본 동작) |
| NFR-REL-03 | 로깅 | Winston 구조화 JSON 로깅 (요청/에러/비즈니스 이벤트) |
| NFR-REL-04 | DB 연결 | TypeORM 커넥션 풀 (기본 10개) |

## 4. 배포

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-DEP-01 | 컨테이너화 | Docker Compose (Backend + Frontend + MySQL) |
| NFR-DEP-02 | 환경 변수 | .env 파일 기반 설정 분리 |
| NFR-DEP-03 | DB 초기화 | TypeORM synchronize (개발) + Seed 스크립트 |
| NFR-DEP-04 | 헬스체크 | /health 엔드포인트 |

## 5. 유지보수성

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-MNT-01 | API 문서 | Swagger/OpenAPI 자동 생성 (@nestjs/swagger) |
| NFR-MNT-02 | 코드 구조 | NestJS 모듈 패턴 (Module/Controller/Service/Entity/DTO) |
| NFR-MNT-03 | 타입 안전 | TypeScript strict mode |
| NFR-MNT-04 | 데이터 검증 | class-validator + class-transformer (ValidationPipe) |
