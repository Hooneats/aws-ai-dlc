# 테이블오더 Backend

NestJS 기반 테이블오더 서비스 Backend API 서버입니다.

## 기술 스택

- NestJS 11 + TypeScript
- MySQL 8 + TypeORM
- JWT 인증 (Passport)
- SSE (Server-Sent Events) 실시간 통신
- Swagger API 문서
- Winston 로깅
- Docker Compose

## 실행 방법

### Docker Compose (권장)

```bash
# 프로젝트 루트에서
docker-compose up -d

# 로그 확인
docker-compose logs -f backend
```

- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api
- MySQL: localhost:3306

### 로컬 실행 (개발)

```bash
cd backend
npm install
npm run start:dev
```

> MySQL이 localhost:3306에서 실행 중이어야 합니다. `.env`의 `DB_HOST`를 `localhost`로 변경하세요.

## API 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /auth/admin/login | 관리자 로그인 | - |
| POST | /auth/table/login | 테이블 인증 | - |
| GET/POST/PATCH/DELETE | /categories | 카테고리 CRUD | Admin |
| GET/POST/PATCH/DELETE | /menus | 메뉴 CRUD | Admin/Table |
| GET/POST/DELETE | /tables | 테이블 관리 | Admin |
| POST/PATCH/DELETE/GET | /orders | 주문 관리 | Admin/Table |
| POST/PATCH/GET | /service-calls | 서비스 호출 | Admin/Table |
| GET | /sse/admin | 관리자 SSE | Admin |
| GET | /sse/table/:id | 테이블 SSE | Table |
| GET | /statistics/* | 매출 통계 | Admin |
| POST | /upload/image | 이미지 업로드 | Admin |

## 초기 데이터

앱 시작 시 자동 생성 (멱등성):
- 매장: code=`store01`, name=`우리매장`
- 관리자: username=`admin`, password=`admin1234`
- 카테고리: `기타` (기본), `서비스 요청`

## 테스트

```bash
npm test           # 전체 테스트
npm run test:cov   # 커버리지
```
