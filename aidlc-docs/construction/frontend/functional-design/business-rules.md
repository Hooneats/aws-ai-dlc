# Business Rules - Frontend (React)

## 인증 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-AUTH-01 | JWT 만료 시 자동 로그아웃 → 로그인 페이지 리다이렉트 | Axios interceptor |
| BR-AUTH-02 | 고객: localStorage에 storeCode+tableNo 존재 시 자동 tableLogin | TableSetupPage |
| BR-AUTH-03 | 관리자: JWT 없으면 /admin/* 접근 불가 → LoginPage | Router guard |
| BR-AUTH-04 | 고객: JWT 없으면 /table/* 접근 불가 → TableSetupPage | Router guard |

## 장바구니 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-CART-01 | 품절 메뉴(isSoldOut=true) 장바구니 추가 불가 | MenuPage |
| BR-CART-02 | 비활성 메뉴(isActive=false) 장바구니 추가 불가 | MenuPage |
| BR-CART-03 | 수량 최소 1, 0이면 항목 자동 삭제 | CartPage |
| BR-CART-04 | 서비스 카테고리 메뉴는 장바구니 추가 불가 (즉시 서비스 호출) | MenuPage |
| BR-CART-05 | 장바구니 데이터 localStorage 동기화 (새로고침 유지) | cartStore |
| BR-CART-06 | 세션 종료 SSE 이벤트 수신 시 장바구니 초기화 | SSE handler |
| BR-CART-07 | 총 금액 = Σ(할인가 × 수량) | cartStore |

## 주문 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-ORD-01 | 빈 장바구니로 주문 불가 | OrderPage |
| BR-ORD-02 | 주문 성공 시 장바구니 자동 비우기 + 메뉴 화면 리다이렉트 | OrderPage |
| BR-ORD-03 | 주문 실패 시 장바구니 유지 + 에러 메시지 표시 | OrderPage |
| BR-ORD-04 | 고객 화면: 주문 상태 "주문완료"로 통합 표시 | OrderHistoryPage |
| BR-ORD-05 | 고객 화면: CANCELLED 주문 목록에서 제외 | OrderHistoryPage |

## 관리자 주문 관리 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-ADM-01 | 상태 변경: PENDING→PREPARING→COMPLETED 순서만 허용 | DashboardPage |
| BR-ADM-02 | 취소: PENDING/PREPARING만 취소 가능, COMPLETED 취소 불가 | DashboardPage |
| BR-ADM-03 | 주문/항목 삭제 시 확인 다이얼로그 필수 | DashboardPage |
| BR-ADM-04 | 신규 주문/서비스 호출 시 비프음 재생 (토글 가능) | DashboardPage |

## 테이블 관리 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-TBL-01 | 활성 세션 있는 테이블 삭제 불가 | TableManagementPage |
| BR-TBL-02 | 정산: 미완료 주문(PENDING/PREPARING) 존재 시 목록 표시 후 처리 유도 | TableManagementPage |
| BR-TBL-03 | 테이블 번호 중복 불가 | TableManagementPage |

## 메뉴 관리 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-MENU-01 | 필수 필드: 메뉴명, 가격, 카테고리 | MenuManagementPage |
| BR-MENU-02 | 가격: 양의 정수만 허용 | React Hook Form validation |
| BR-MENU-03 | 할인율: 0~99% 범위 | MenuManagementPage |
| BR-MENU-04 | 이미지: jpg/jpeg/png/gif만 허용, 최대 5MB | MenuManagementPage |

## 카테고리 관리 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-CAT-01 | 기본 카테고리("기타") 삭제/수정 불가 | CategoryManagementPage |
| BR-CAT-02 | 서비스 카테고리("서비스 요청") 삭제 불가 | CategoryManagementPage |
| BR-CAT-03 | 카테고리 삭제 시 소속 메뉴 "기타"로 이동 안내 | CategoryManagementPage |

## 통계 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-STAT-01 | 기간별 통계: 최대 365일 | StatisticsPage |
| BR-STAT-02 | 종료일 ≥ 시작일 | StatisticsPage |

## UI/UX 규칙

| ID | 규칙 | 적용 위치 |
|----|------|----------|
| BR-UI-01 | 터치 타겟 최소 44x44px | 전체 |
| BR-UI-02 | 반응형: 320px~1024px | 전체 (고객용 우선) |
| BR-UI-03 | 파괴적 액션(삭제, 취소, 정산)은 확인 다이얼로그 필수 | 전체 |
