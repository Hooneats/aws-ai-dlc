# 기술 스택 결정 - Backend

---

## 핵심 기술 스택

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| Runtime | Node.js | 20 LTS | 안정성, LTS 지원 |
| Framework | NestJS | 10.x | 사용자 선택, 모듈 아키텍처 |
| Language | TypeScript | 5.x | 타입 안전, NestJS 기본 |
| Database | MySQL | 8.x | 사용자 선택 |
| ORM | TypeORM | 0.3.x | NestJS 공식 통합, 데코레이터 기반 |
| 실시간 통신 | SSE (Server-Sent Events) | - | 사용자 선택, 단방향 실시간 |

## 보안 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| @nestjs/jwt | JWT 발급/검증 |
| @nestjs/passport + passport-jwt | JWT Guard 전략 |
| bcrypt | 비밀번호 해싱 |

## 검증/문서화

| 라이브러리 | 용도 |
|-----------|------|
| class-validator | DTO 데코레이터 기반 검증 |
| class-transformer | 요청 데이터 변환 |
| @nestjs/swagger | Swagger/OpenAPI 자동 생성 |

## 로깅

| 라이브러리 | 용도 |
|-----------|------|
| winston | 구조화 JSON 로깅 |
| nest-winston | NestJS Winston 통합 |

## 파일 업로드

| 라이브러리 | 용도 |
|-----------|------|
| @nestjs/platform-express (multer) | 파일 업로드 처리 |

## 인프라

| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 오케스트레이션 |

## 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "품절된 메뉴입니다: 김치찌개",
  "error": "Bad Request",
  "timestamp": "2026-03-20T13:00:00.000Z"
}
```

## 환경 변수 (.env)

```
# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=table_order

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=16h

# App
APP_PORT=3000
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173
```
