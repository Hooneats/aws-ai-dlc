# 기술 스택 결정 - Frontend (React)

---

## 핵심 기술 스택

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| Runtime | Node.js | 20 LTS | Backend와 동일 |
| Framework | React | 19.x | 사용자 선택 |
| Language | TypeScript | 5.x | 타입 안전, strict mode |
| 빌드 도구 | Vite | 6.x | 빠른 HMR, 간단한 설정 |
| UI Framework | MUI (Material UI) | 6.x | 풍부한 컴포넌트, 반응형 지원 |

## 상태 관리 / 데이터

| 라이브러리 | 용도 |
|-----------|------|
| Zustand | 전역 상태 (auth, cart, sse) + localStorage persist |
| TanStack Query | 서버 상태 캐싱, 자동 재시도, invalidation |
| Axios | HTTP 클라이언트, interceptor |

## 라우팅

| 라이브러리 | 용도 |
|-----------|------|
| TanStack Router | 타입 안전 라우팅, 코드 스플리팅 |

## 폼 / 검증

| 라이브러리 | 용도 |
|-----------|------|
| React Hook Form | 폼 상태 관리, 비제어 컴포넌트 |

## 차트

| 라이브러리 | 용도 |
|-----------|------|
| Chart.js | 차트 렌더링 엔진 |
| react-chartjs-2 | React 래퍼 |

## 알림

| 기술 | 용도 |
|------|------|
| Web Audio API | 신규 주문/서비스 호출 비프음 |

## 인프라

| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Vite dev server | 개발 환경 (HMR) |

## 환경 변수 (.env)

```
VITE_API_URL=http://localhost:3000
```
