# NFR Design Patterns - Frontend (React)

---

## 1. 성능 패턴

### 라우트 기반 코드 스플리팅
- TanStack Router의 `lazy` 옵션으로 라우트별 번들 분리
- 고객용/관리자용 페이지가 별도 청크로 분리됨
- 초기 로딩 시 현재 라우트 청크만 다운로드

### TanStack Query 캐싱 전략
| 데이터 | staleTime | gcTime | 비고 |
|--------|-----------|--------|------|
| 카테고리 | 5분 | 10분 | 변경 빈도 낮음 |
| 메뉴 목록 | 1분 | 5분 | 품절/할인 변경 반영 |
| 주문 목록 | 0 (항상 fresh) | 5분 | SSE 이벤트로 invalidate |
| 테이블 목록 | 30초 | 5분 | 관리자 페이지 |
| 통계 | 1분 | 5분 | 실시간성 필요 |

### 이미지 Lazy Loading
- `loading="lazy"` 속성 + Intersection Observer
- placeholder: MUI Skeleton 컴포넌트
- 뷰포트 진입 시 실제 이미지 로딩

## 2. 안정성 패턴

### TanStack Query 자동 재시도
```
retry: 3
retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
```
- 네트워크 에러 시 1초 → 2초 → 4초 간격 재시도
- 4xx 에러는 재시도 안 함 (onError에서 분기)

### Error Boundary
- 페이지 단위 Error Boundary 적용
- 에러 발생 시 "문제가 발생했습니다" 폴백 UI + 새로고침 버튼
- 전체 앱 크래시 방지

### SSE 재연결
- EventSource 브라우저 기본 자동 재연결
- 연결 상태를 sseStore에 반영 (connected: boolean)
- 재연결 시 Last-Event-ID로 누락 이벤트 복구

### localStorage 동기화
- Zustand persist 미들웨어 사용
- authStore: JWT, role, storeCode, tableNo, sessionId
- cartStore: items[], totalAmount
- 브라우저 새로고침/탭 닫기 후에도 상태 유지

## 3. 보안 패턴

### Axios Interceptor
- 요청 interceptor: Authorization 헤더에 JWT 자동 첨부
- 응답 interceptor: 401 → authStore.clearAuth() → 로그인 리다이렉트
- 토큰 없는 요청은 인증 헤더 생략

### 라우트 가드
- TanStack Router의 `beforeLoad`에서 인증 상태 확인
- 미인증 시 로그인/설정 페이지로 리다이렉트
- 관리자 라우트: role === 'admin' 확인
- 고객 라우트: role === 'table' 확인

## 4. 사용성 패턴

### 반응형 레이아웃
- MUI `useMediaQuery` + `theme.breakpoints`
- 모바일 (320px~767px): 단일 컬럼, 하단 네비게이션
- 태블릿 (768px~1024px): 사이드바 + 콘텐츠 영역

### 사용자 피드백
- MUI Snackbar: 성공/에러 메시지 (3초 자동 닫힘)
- MUI Dialog: 파괴적 액션 확인 (삭제, 취소, 정산)
- MUI CircularProgress: API 호출 중 로딩 표시
- MUI Skeleton: 데이터 로딩 중 placeholder

### 알림음 (Web Audio API)
```
AudioContext → OscillatorNode → GainNode → destination
주파수: 800Hz, 지속: 200ms, 타입: sine
```
- sseStore.soundEnabled 토글로 on/off
- 신규 주문 + 서비스 호출 이벤트에서 트리거
