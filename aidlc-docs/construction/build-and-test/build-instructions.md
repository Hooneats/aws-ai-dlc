# Build Instructions

## Prerequisites

| 항목 | 요구사항 |
|------|---------|
| Docker | Docker Desktop 설치 (Docker Compose 포함) |
| Node.js | 20 LTS (로컬 개발 시) |
| 포트 | 3000 (Backend), 3306 (MySQL) 사용 가능 |
| 디스크 | MySQL 이미지 + node_modules ≈ 1.5GB |

## 빌드 방법

### 방법 1: Docker Compose (권장)

```bash
# 프로젝트 루트에서 실행
docker-compose up -d
```

시작 순서가 자동 보장됩니다:
1. MySQL 시작 → healthcheck 통과 대기
2. Backend 시작 → TypeORM synchronize → Seed 데이터 생성

개별 서비스 시작:
```bash
docker-compose up -d mysql        # MySQL만 시작
docker-compose up -d backend      # Backend만 시작 (MySQL 의존)
```

### 방법 2: 로컬 개발

```bash
# 1. MySQL 컨테이너만 실행
docker-compose up -d mysql

# 2. Backend 의존성 설치
cd backend
npm install

# 3. 환경 변수 수정 (로컬용)
# backend/.env에서 DB_HOST=mysql → DB_HOST=localhost 변경

# 4. 개발 서버 시작
npm run start:dev
```

## 빌드 확인

```bash
# TypeScript 컴파일 확인
cd backend
npm run build
```

성공 시 `backend/dist/` 디렉토리에 컴파일된 JS 파일 생성

## 서비스 확인

| 확인 항목 | 방법 |
|----------|------|
| Backend 기동 | `curl http://localhost:3000` |
| Swagger API 문서 | 브라우저에서 `http://localhost:3000/api` 접속 |
| MySQL 연결 | `docker-compose logs backend` 에서 에러 없음 확인 |
| Seed 데이터 | 로그에 "Seed completed" 메시지 확인 |

## Troubleshooting

### 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :3000
lsof -i :3306
# 해당 프로세스 종료 후 재시작
```

### MySQL healthcheck 실패
```bash
docker-compose down -v   # 볼륨 포함 삭제
docker-compose up -d     # 재시작
```

### node_modules 문제
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```
