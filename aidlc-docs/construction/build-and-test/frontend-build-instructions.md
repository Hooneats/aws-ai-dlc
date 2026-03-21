# Frontend Build Instructions

## Prerequisites

| 항목 | 요구사항 |
|------|---------|
| Node.js | 18.x 이상 |
| npm | 9.x 이상 |
| Docker | Docker Compose v2 |

## 방법 1: Docker Compose (권장)

```bash
# 프로젝트 루트에서 실행
docker-compose up -d frontend
```

Frontend가 `http://localhost:5173`에서 실행됩니다.

## 방법 2: 로컬 개발

```bash
cd frontend

# 1. 의존성 설치
npm install

# 2. 환경 변수 확인
cat .env
# VITE_API_URL=http://localhost:3000

# 3. TypeScript 컴파일 확인
npx tsc -b --noEmit

# 4. Vite 빌드 (프로덕션)
npm run build

# 5. 개발 서버 실행
npm run dev
```

## 빌드 검증

| 항목 | 명령어 | 기대 결과 |
|------|--------|----------|
| TypeScript | `npx tsc -b --noEmit` | 0 errors |
| Vite build | `npm run build` | dist/ 폴더 생성 |
| ESLint | `npm run lint` | 0 errors |

## Troubleshooting

### `Cannot find module '@tanstack/router-plugin/vite'`
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
lsof -i :5173
kill -9 <PID>
```
