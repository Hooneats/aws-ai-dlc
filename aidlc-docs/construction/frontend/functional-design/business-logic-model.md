# Business Logic Model - Frontend (React)

## 기술 스택 결정

| 영역 | 선택 |
|------|------|
| UI Framework | MUI (Material UI) |
| 상태 관리 | Zustand |
| HTTP/캐싱 | TanStack Query + Axios |
| 라우팅 | TanStack Router |
| 차트 | Chart.js + react-chartjs-2 |
| 폼 관리 | React Hook Form |
| 알림음 | Web Audio API |
| 반응형 | 태블릿 + 모바일 (320px~1024px) |

---

## 페이지별 비즈니스 로직

### 고객용 (Customer)

#### MenuPage
- 진입 시 카테고리 목록 + 추천 메뉴 동시 조회
- 좌측 사이드바에서 카테고리 선택 → 우측 메뉴 카드 그리드 갱신
- "추천" 탭 선택 시 isRecommended=true 메뉴만 표시
- "서비스 요청" 카테고리 선택 시 서비스 호출 UI로 전환 (장바구니 아닌 즉시 호출)
- 품절 메뉴: 카드에 품절 오버레이, 장바구니 추가 버튼 비활성화
- 할인 메뉴: 원가 취소선 + 할인율 배지 + 할인가 표시

#### CartPage
- Zustand store에서 장바구니 상태 관리 (localStorage 동기화)
- 수량 변경: +/- 버튼, 최소 1개 (0이면 항목 삭제)
- 총 금액: 실시간 계산 (할인가 기준)
- 장바구니 비우기: 확인 다이얼로그 후 전체 삭제
- 주문 확정 버튼 → OrderPage로 이동

#### OrderPage
- 장바구니 내역 최종 확인 표시
- 요청사항 입력 (선택, 텍스트 필드)
- 주문 확정 → POST /orders API 호출
- 성공: 장바구니 비우기 + 메뉴 화면으로 리다이렉트 + 성공 스낵바
- 실패: 에러 메시지 스낵바 (장바구니 유지)

#### OrderHistoryPage
- 현재 세션의 주문 목록 조회 (CANCELLED 제외)
- SSE로 주문 상태 실시간 업데이트
- 고객 화면에서는 상태를 "주문완료"로 통합 표시 (PENDING/PREPARING/COMPLETED 구분 없음)

#### TableSetupPage
- 매장 코드 + 테이블 번호 입력 → tableLogin API 호출
- 성공 시 JWT + storeCode + tableNo를 localStorage에 저장
- 이후 자동 로그인 (localStorage 확인 → 토큰 유효성 검증)

### 관리자용 (Admin)

#### LoginPage
- 매장 코드, 사용자명, 비밀번호 입력
- adminLogin API 호출 → JWT를 Zustand + localStorage에 저장
- 성공 시 DashboardPage로 리다이렉트

#### DashboardPage
- 좌측: 테이블 목록 (각 테이블의 주문 건수, 총액 요약)
- 우측: 선택된 테이블의 주문 상세 (주문별 메뉴 목록, 요청사항, 상태)
- SSE 연결: 신규 주문, 상태 변경, 서비스 호출 이벤트 수신
- 신규 주문/서비스 호출 시 Web Audio API 비프음 재생 (토글 가능)
- 주문 상태 변경: PENDING→PREPARING→COMPLETED 버튼
- 주문 취소: PENDING/PREPARING 상태에서 취소 버튼 (확인 다이얼로그)
- 주문 항목 삭제: 개별 항목 삭제 버튼 (확인 다이얼로그)
- 서비스 호출 알림: 별도 섹션에 미처리 서비스 호출 목록 표시

#### TableManagementPage
- 테이블 목록 조회 (번호, 세션 상태, 주문 건수)
- 테이블 추가: 번호 입력 → create API
- 테이블 삭제: 활성 세션 없는 테이블만 삭제 가능
- 테이블 정산: 모든 주문 완료/취소 확인 → settle API → 미완료 주문 있으면 목록 표시
- 과거 주문 내역: 테이블 선택 → 날짜 필터 → 이력 조회

#### MenuManagementPage
- 메뉴 목록 (카테고리별 필터)
- 메뉴 등록/수정: React Hook Form 모달 (이름, 가격, 설명, 카테고리, 이미지)
- 이미지 업로드: 파일 선택 → upload API → imageUrl 반환 → 메뉴에 연결
- 추천/할인/품절 토글: 각 메뉴 카드에서 즉시 변경
- Soft Delete: 삭제 확인 후 비활성화

#### CategoryManagementPage
- 카테고리 목록 (순서대로)
- 카테고리 추가/수정/삭제
- 기본 카테고리("기타"), 서비스 카테고리("서비스 요청") 삭제 불가
- 삭제 시 해당 카테고리 메뉴가 "기타"로 이동됨을 안내

#### StatisticsPage
- 탭 구조: 실시간 대시보드 | 일별 통계 | 기간별 통계
- 실시간 대시보드: 오늘 매출, 주문 건수, 영업 테이블, 객단가, TOP5 메뉴, 시간대별 추이 (Chart.js)
- 일별 통계: 날짜 선택 → 테이블별/메뉴별 매출 (Chart.js 바 차트)
- 기간별 통계: 시작일~종료일 → 일별 추이 (라인 차트), 메뉴 순위, 요일 패턴

---

## 데이터 흐름

```
[Zustand Stores]
  ├── authStore: JWT, role, storeCode, tableNo
  ├── cartStore: items[], totalAmount (localStorage 동기화)
  ├── sseStore: SSE 연결 상태, 알림음 on/off
  └── notificationStore: 스낵바 메시지 큐

[TanStack Query]
  ├── 카테고리 목록 (캐싱, staleTime: 5분)
  ├── 메뉴 목록 (캐싱, staleTime: 1분)
  ├── 주문 목록 (SSE 이벤트 시 invalidate)
  ├── 테이블 목록 (관리자, staleTime: 30초)
  └── 통계 데이터 (staleTime: 1분)

[SSE EventSource]
  ├── 관리자: /sse/admin → new-order, order-status, service-call, order-updated, order-deleted
  └── 고객: /sse/table/:tableId → order-status, session-end
```

---

## Axios 인스턴스 설정

- baseURL: 환경변수 VITE_API_URL (기본 http://localhost:3000)
- interceptor: 요청 시 Authorization 헤더에 JWT 자동 첨부
- 401 응답 시: authStore 초기화 → 로그인 페이지 리다이렉트
