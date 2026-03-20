# 유저 스토리 생성 계획

## 개요
테이블오더 서비스의 요구사항을 기반으로 유저 스토리와 페르소나를 생성합니다.

---

## 스토리 생성 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 뒤에 선택한 옵션 문자를 입력해 주세요.

### Question 1
유저 스토리 분류 방식을 어떻게 하시겠습니까?

A) 사용자 여정 기반 - 사용자의 실제 사용 흐름 순서대로 스토리 구성
B) 기능 기반 - 시스템 기능 단위로 스토리 구성
C) 페르소나 기반 - 사용자 유형별로 스토리 그룹화
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 2
유저 스토리의 상세 수준을 어떻게 하시겠습니까?

A) 간결 - 핵심 스토리와 기본 인수 기준만 포함
B) 표준 - 스토리 + 인수 기준 + 주요 시나리오 포함
C) 상세 - 스토리 + 인수 기준 + 시나리오 + 엣지 케이스 + UI 힌트 포함
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 3
인수 기준(Acceptance Criteria) 형식을 어떻게 하시겠습니까?

A) Given-When-Then 형식 (BDD 스타일)
B) 체크리스트 형식 (간단한 조건 나열)
C) Other (please describe after [Answer]: tag below)

[Answer]: C - A랑 B 둘 다 해줘

### Question 4
고객 페르소나를 어떻게 설정하시겠습니까?

A) 단일 페르소나 - 일반 식당 고객 1명
B) 다중 페르소나 - 다양한 고객 유형 (예: 디지털 친숙한 젊은 고객, 디지털 미숙한 고령 고객 등)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 5
관리자 페르소나를 어떻게 설정하시겠습니까?

A) 단일 페르소나 - 매장 사장님/운영자 1명
B) 다중 페르소나 - 역할별 구분 (예: 매장 사장님, 홀 매니저 등)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

질문 답변 승인 후 아래 순서로 실행합니다:

- [x] 1단계: 페르소나 정의 (personas.md 생성)
  - [x] 고객 페르소나 작성
  - [x] 관리자 페르소나 작성
- [x] 2단계: 고객용 유저 스토리 작성 (stories.md)
  - [x] 테이블 자동 로그인 및 세션 관리 스토리
  - [x] 메뉴 조회 및 탐색 스토리
  - [x] 장바구니 관리 스토리
  - [x] 주문 생성 스토리
  - [x] 주문 내역 조회 스토리
- [x] 3단계: 관리자용 유저 스토리 작성 (stories.md)
  - [x] 매장 인증 스토리
  - [x] 실시간 주문 모니터링 스토리
  - [x] 테이블 관리 스토리
  - [x] 메뉴 관리 스토리
- [x] 4단계: INVEST 기준 검증
- [x] 5단계: 페르소나-스토리 매핑
