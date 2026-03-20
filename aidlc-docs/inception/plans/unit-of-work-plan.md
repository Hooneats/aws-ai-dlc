# Unit of Work 계획

## 개요
테이블오더 서비스를 개발 가능한 작업 단위(Unit of Work)로 분해합니다.

---

## 질문

### Question 1
시스템 배포 구조를 어떻게 하시겠습니까?

A) 모놀리식 - Backend 1개 + Frontend 1개 (NestJS 모듈로 논리적 분리)
B) 마이크로서비스 - 기능별 독립 Backend 서비스 (주문, 메뉴, 인증 등 분리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
개발 순서를 어떻게 하시겠습니까?

A) Backend 먼저 → Frontend 나중에 (API 완성 후 UI 개발)
B) 기능 단위로 Backend+Frontend 동시 개발 (메뉴 기능 전체 → 주문 기능 전체)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
개발 우선순위를 어떻게 하시겠습니까?

A) 고객 주문 플로우 우선 (메뉴 조회 → 장바구니 → 주문 → 주문 내역)
B) 관리자 기능 우선 (메뉴/카테고리 관리 → 테이블 관리 → 주문 모니터링)
C) 인프라/인증 우선 (DB 스키마 → 인증 → 기본 CRUD → 고급 기능)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## 생성 실행 계획

질문 답변 승인 후 아래 순서로 실행합니다:

- [x] 1단계: Unit of Work 정의 (unit-of-work.md)
- [x] 2단계: Unit 간 의존성 매트릭스 (unit-of-work-dependency.md)
- [x] 3단계: 유저 스토리-Unit 매핑 (unit-of-work-story-map.md)
- [x] 4단계: Unit 경계 및 의존성 검증
