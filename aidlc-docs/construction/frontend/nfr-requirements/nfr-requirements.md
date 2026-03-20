# NFR 요구사항 - Frontend (React)

---

## 1. 성능

| ID | 요구사항 | 기준 |
|----|---------|------|
| NFR-FE-PERF-01 | 초기 로딩 (FCP) | 3초 이내 (3G 네트워크 기준) |
| NFR-FE-PERF-02 | 라우트 전환 | 300ms 이내 |
| NFR-FE-PERF-03 | 코드 스플리팅 | 라우트 기반 React.lazy 적용 |
| NFR-FE-PERF-04 | 이미지 로딩 | Lazy loading + placeholder (뷰포트 진입 시) |
| NFR-FE-PERF-05 | API 캐싱 | TanStack Query staleTime 활용 (카테고리 5분, 메뉴 1분) |
| NFR-FE-PERF-06 | 장바구니 | 클라이언트 로컬 저장 (서버 부하 없음) |

## 2. 안정성

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-FE-REL-01 | 네트워크 에러 | 에러 메시지 + TanStack Query 자동 재시도 (3회) |
| NFR-FE-REL-02 | SSE 재연결 | EventSource 자동 재연결 (브라우저 기본 동작) |
| NFR-FE-REL-03 | 상태 유지 | localStorage 동기화 (JWT, 장바구니, 테이블 설정) |
| NFR-FE-REL-04 | 에러 바운더리 | React Error Boundary로 페이지 단위 에러 격리 |

## 3. 보안

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-FE-SEC-01 | JWT 관리 | localStorage 저장, Axios interceptor로 자동 첨부 |
| NFR-FE-SEC-02 | 토큰 만료 | 401 응답 시 자동 로그아웃 + 로그인 리다이렉트 |
| NFR-FE-SEC-03 | 라우트 보호 | 인증 없이 보호된 라우트 접근 불가 (리다이렉트) |
| NFR-FE-SEC-04 | XSS 방지 | React 기본 이스케이핑 + dangerouslySetInnerHTML 미사용 |

## 4. 사용성

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-FE-USE-01 | 반응형 | 320px~1024px (태블릿 + 모바일) |
| NFR-FE-USE-02 | 터치 타겟 | 최소 44x44px |
| NFR-FE-USE-03 | 피드백 | 로딩 스피너, 성공/에러 스낵바, 확인 다이얼로그 |
| NFR-FE-USE-04 | 접근성 | 최소한 (MUI 기본 ARIA 속성 활용) |

## 5. 유지보수성

| ID | 요구사항 | 구현 |
|----|---------|------|
| NFR-FE-MNT-01 | 타입 안전 | TypeScript strict mode |
| NFR-FE-MNT-02 | 코드 구조 | 페이지/컴포넌트/훅/API/타입 분리 |
| NFR-FE-MNT-03 | 린팅 | ESLint + Prettier |
| NFR-FE-MNT-04 | 환경 변수 | Vite 환경 변수 (VITE_ prefix) |
