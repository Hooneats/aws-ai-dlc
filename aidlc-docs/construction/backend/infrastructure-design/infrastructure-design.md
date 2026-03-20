# 인프라 설계 - Backend

---

## 배포 환경
- **환경**: 로컬 개발 (Docker Compose)
- **클라우드**: 없음 (MVP)

---

## 서비스 구성

| 서비스 | 이미지/빌드 | 포트 | 역할 |
|--------|-----------|------|------|
| backend | ./backend (Dockerfile) | 3000 | NestJS API 서버 |
| frontend | ./frontend (Dockerfile) | 5173 | Vite dev server |
| mysql | mysql:8 | 3306 | 데이터베이스 |

---

## 데이터 관리 전략

### DB 스키마
- TypeORM `synchronize: true` (엔티티 기반 자동 스키마 생성)

### Seed 데이터 (앱 시작 시)
- Store, Admin, 기본 카테고리 ("기타", "서비스 요청")
- `OnModuleInit` 훅, 멱등성 보장

### 통계 더미 데이터 (Flyway)
- Docker 컨테이너 시작 시 Flyway로 더미 데이터 삽입
- OrderHistory, OrderHistoryItem 더미 데이터 (최근 30일분)
- 대시보드/통계 화면 확인용
- Flyway 마이그레이션 파일: `backend/src/database/migrations/`

### 데이터 영속성
- MySQL Named Volume (`mysql_data`)
- `docker-compose down` 후에도 유지
- `docker-compose down -v`로 완전 초기화 가능

---

## 볼륨 매핑

| 볼륨 | 호스트 | 컨테이너 | 용도 |
|------|--------|---------|------|
| mysql_data | Named Volume | /var/lib/mysql | DB 데이터 영속 |
| uploads | ./backend/uploads | /app/uploads | 이미지 파일 |
| logs | ./backend/logs | /app/logs | Winston 로그 파일 |
| backend-src | ./backend/src | /app/src | 소스 코드 (개발용 핫리로드) |
| frontend-src | ./frontend/src | /app/src | 소스 코드 (Vite HMR) |

---

## 네트워크

- Docker Compose 기본 네트워크 (bridge)
- 서비스 간 통신: 서비스명으로 DNS 해석 (backend → mysql)

---

## 환경 변수

### backend/.env
```
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=table_order
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=16h
APP_PORT=3000
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:3000
```

---

## 기술 스택 추가사항

| 기술 | 용도 | 비고 |
|------|------|------|
| Flyway | DB 마이그레이션/더미 데이터 | 통계 더미 데이터 삽입 |
| ts-node-dev / nest start --watch | Backend 핫리로드 | 개발 편의 |
| Vite dev server | Frontend HMR | 개발 편의 |
