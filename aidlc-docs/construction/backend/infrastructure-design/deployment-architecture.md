# 배포 아키텍처 - Backend

---

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────┐
│                Docker Compose                    │
│                                                  │
│  ┌──────────┐   REST    ┌──────────┐            │
│  │ frontend │ --------> │ backend  │            │
│  │  :5173   │ <-------- │  :3000   │            │
│  │  (Vite)  │   SSE     │ (NestJS) │            │
│  └──────────┘           └────┬─────┘            │
│                              │                   │
│                    ┌─────────┼─────────┐        │
│                    │         │         │        │
│                    v         v         v        │
│              ┌─────────┐ ┌───────┐ ┌──────┐    │
│              │  mysql   │ │uploads│ │ logs │    │
│              │  :3306   │ │  vol  │ │ vol  │    │
│              └─────────┘ └───────┘ └──────┘    │
│                    │                            │
│              mysql_data                         │
│            (Named Volume)                       │
└─────────────────────────────────────────────────┘

브라우저 접속:
  고객 태블릿 → http://localhost:5173/table/:tableNo
  관리자      → http://localhost:5173/admin
```

---

## Docker Compose 상세

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: table_order
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    env_file:
      - ./backend/.env
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src
    env_file:
      - ./frontend/.env
    command: npm run dev -- --host

volumes:
  mysql_data:
```

---

## Dockerfile

### backend/Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
```

### frontend/Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

---

## 시작 순서

1. `docker-compose up -d mysql` → MySQL 시작 + healthcheck 대기
2. `docker-compose up -d backend` → NestJS 시작 → TypeORM synchronize → Seed 실행 → Flyway 더미 데이터
3. `docker-compose up -d frontend` → Vite dev server 시작

간편 실행: `docker-compose up -d` (depends_on으로 자동 순서 보장)

---

## 운영 명령어

| 명령어 | 용도 |
|--------|------|
| `docker-compose up -d` | 전체 시작 |
| `docker-compose down` | 전체 중지 (데이터 유지) |
| `docker-compose down -v` | 전체 중지 + 데이터 삭제 |
| `docker-compose logs -f backend` | Backend 로그 확인 |
| `docker-compose restart backend` | Backend 재시작 |
