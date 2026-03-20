# NFR 설계 패턴 - Backend

---

## 1. 인증/보안 패턴

### JWT Guard 패턴
- **AdminGuard**: `role: 'admin'` 검증, 관리자 전용 API 보호
- **TableGuard**: `role: 'table'` 검증, 고객(테이블) 전용 API 보호
- **PublicGuard**: 인증 불필요 (로그인, 헬스체크)
- 구현: `@nestjs/passport` + `passport-jwt` Strategy, Custom Guard 데코레이터

### 비밀번호 해싱
- bcrypt (saltRounds: 10)
- 관리자 계정만 해당 (테이블은 비밀번호 없음)

---

## 2. 에러 처리 패턴

### Global Exception Filter
```
모든 예외 → GlobalExceptionFilter → 표준 응답 변환

응답 형식:
{
  statusCode: number,
  message: string,
  error: string,
  timestamp: string
}
```

### 비즈니스 예외 클래스
| 예외 | HTTP 코드 | 용도 |
|------|----------|------|
| NotFoundException | 404 | 리소스 미존재 |
| BadRequestException | 400 | 검증 실패, 비즈니스 규칙 위반 |
| UnauthorizedException | 401 | 인증 실패 |
| ForbiddenException | 403 | 권한 부족 |
| ConflictException | 409 | 중복, 상태 충돌 |

---

## 3. SSE 패턴

### 이벤트 버퍼 + Last-Event-ID 재전송
```
1. 이벤트 발생 → 메모리 버퍼에 저장 (이벤트 ID 부여)
2. 연결된 클라이언트에 즉시 전송
3. 클라이언트 재연결 시 Last-Event-ID 헤더 확인
4. 버퍼에서 해당 ID 이후 이벤트 재전송
5. 버퍼 크기 제한: 최근 100개 이벤트 (FIFO)
```

### 이벤트 버퍼 삭제 정책
| 시점 | 동작 |
|------|------|
| FIFO 초과 | 100개 초과 시 가장 오래된 이벤트 자동 제거 |
| 테이블 정산 | 해당 테이블 채널의 이벤트 버퍼 전체 클리어 |
| 연결 해제 후 5분 경과 | 해당 클라이언트용 버퍼 클리어 (타이머 기반) |
| 서버 재시작 | 메모리 버퍼 자연 초기화 |

### SSE 연결 관리
- 관리자 연결: storeId 기준 (1개 매장 = 1개 채널)
- 테이블 연결: tableId 기준 (테이블별 개별 채널)
- 연결 해제 감지: request close 이벤트
- 하트비트: 30초 간격 ping (연결 유지)

---

## 4. 데이터 검증 패턴

### ValidationPipe + DTO
```
요청 → ValidationPipe → class-transformer (변환) → class-validator (검증) → Controller

실패 시: BadRequestException + 검증 에러 상세
```

- `whitelist: true` (DTO에 없는 필드 자동 제거)
- `forbidNonWhitelisted: true` (알 수 없는 필드 에러)
- `transform: true` (자동 타입 변환)

---

## 5. 로깅 패턴

### Winston 구조화 로깅
```
로그 레벨: error > warn > info > debug
출력 대상:
  - Console: 컬러 포맷 (개발 편의)
  - 파일: JSON 포맷 (logs/ 디렉토리)
    - error.log: error 레벨만
    - combined.log: 전체
    - 일별 로테이션 (14일 보존)
```

### 로그 포맷
```json
{
  "timestamp": "2026-03-20T14:00:00.000Z",
  "level": "info",
  "context": "OrderService",
  "message": "주문 생성",
  "meta": { "orderId": 1, "tableId": 3 }
}
```

---

## 6. DB 패턴

### TypeORM 설정
- synchronize: true (개발 환경, 엔티티 기반 자동 스키마 동기화)
- logging: true (SQL 쿼리 로깅)
- 커넥션 풀: 10개 (기본)

### Seed 패턴
- 앱 시작 시 `OnModuleInit` 훅에서 Seed 실행
- 이미 데이터 존재 시 스킵 (멱등성)

---

## 7. CORS 패턴

```
허용 Origin: CORS_ORIGIN 환경 변수 (기본: http://localhost:5173)
허용 메서드: GET, POST, PUT, PATCH, DELETE
허용 헤더: Content-Type, Authorization
```

---

## 8. 파일 업로드 패턴

### Multer 설정
- 저장: diskStorage (uploads/ 디렉토리)
- 파일명: `{timestamp}-{uuid}.{ext}`
- 크기 제한: 5MB
- 허용 MIME: image/jpeg, image/png, image/gif, image/webp
- 정적 파일 서빙: `ServeStaticModule` 또는 `@nestjs/platform-express`
