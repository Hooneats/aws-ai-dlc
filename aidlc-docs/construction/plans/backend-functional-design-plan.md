# Functional Design 계획 - Backend

## 개요
Backend Unit(NestJS)의 상세 비즈니스 로직, 도메인 모델, 비즈니스 규칙을 설계합니다.

---

## 질문

### Question 1: 주문 상태 변경 규칙
주문 상태 변경 시 역방향 전환을 허용하시겠습니까?

A) 단방향만 허용 (대기중→준비중→완료, 되돌리기 불가)
B) 역방향 허용 (완료→준비중, 준비중→대기중 가능)
C) Other (please describe after [Answer]: tag below)

[Answer]: C. 단방향인데 관리자가 주문 취소를 할 수 있도록 해줘. 유저한테는 주문완료만 뜨고 대기중 준비중은 관리자만 보이게끔 해줘.

### Question 2: 테이블 정산 시 미완료 주문 처리
정산 시 "대기중" 또는 "준비중" 상태의 주문이 있으면 어떻게 처리하시겠습니까?

A) 정산 차단 (모든 주문이 "완료" 상태여야 정산 가능)
B) 강제 정산 허용 (미완료 주문도 그대로 이력으로 이동)
C) 경고 후 강제 정산 (경고 팝업 표시 후 사용자가 확인하면 정산)
D) Other (please describe after [Answer]: tag below)

[Answer]: C 모든 메뉴 주문이 완료 또는 취소 상태여야 정산 가능. 그게 아니라면 정산 차단하고, 대기중이나 준비중으로 남았던 내역을 보여줘서 완료나 취소를 할 수 있도록 처리해줘. 전체 선택이나 개별 선택도 가능하도록 해줘. 

### Question 3: 메뉴 삭제 시 기존 주문 처리
이미 주문된 메뉴를 삭제하면 기존 주문 내역에서 어떻게 표시하시겠습니까?

A) 삭제 불가 (주문 이력이 있는 메뉴는 삭제 방지)
B) Soft Delete (메뉴 비활성화, 기존 주문에는 메뉴명 유지)
C) 삭제 허용 (기존 주문에 "삭제된 메뉴"로 표시)
D) Other (please describe after [Answer]: tag below)

[Answer]: B. 재주문은 안되도록 처리

### Question 4: 카테고리 삭제 시 메뉴 처리
메뉴가 있는 카테고리를 삭제할 때 어떻게 처리하시겠습니까?

A) 삭제 불가 (메뉴가 있으면 카테고리 삭제 차단)
B) 메뉴를 다른 카테고리로 이동 후 삭제
C) 메뉴와 함께 삭제
D) Other (please describe after [Answer]: tag below)

[Answer]:B. 관리자만 볼 수 있는 기타 카테고리에 모두 넣어줘.

### Question 5: 할인율 범위 및 규칙
할인율 설정 범위와 규칙을 어떻게 하시겠습니까?

A) 1~99% 정수만 허용 (100% 할인 불가)
B) 1~100% 정수 허용 (무료 제공 가능)
C) 1~50% 정수만 허용 (최대 50% 할인)
D) Other (please describe after [Answer]: tag below) 

[Answer]: A

### Question 6: 로그인 시도 제한
관리자 로그인 시도 제한을 어떻게 설정하시겠습니까?

A) 5회 실패 시 5분 잠금
B) 10회 실패 시 30분 잠금
C) 제한 없음 (MVP에서는 단순하게)
D) Other (please describe after [Answer]: tag below)

[Answer]:C

### Question 7: 서비스 호출 중복 요청 처리
고객이 같은 서비스 항목(예: 물)을 연속으로 요청하면 어떻게 처리하시겠습니까?

A) 무제한 허용 (매번 새 요청 생성)
B) 이전 요청이 미처리 상태면 중복 차단
C) 쿨다운 적용 (예: 같은 항목 1분 이내 재요청 차단)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

### Question 8: 주문 삭제 범위
관리자가 주문을 삭제할 때 어떤 범위까지 허용하시겠습니까?

A) 개별 주문 전체 삭제만 가능
B) 주문 내 특정 메뉴 항목 단위 삭제도 가능
C) Other (please describe after [Answer]: tag below)

[Answer]:B

### Question 9: 테이블 비밀번호 규칙
테이블 태블릿 인증용 비밀번호 규칙을 어떻게 하시겠습니까?

A) 4자리 숫자 PIN
B) 자유 형식 (최소 4자)
C) 비밀번호 없이 테이블 번호만으로 인증
D) Other (please describe after [Answer]: tag below)

[Answer]:C

### Question 10: 통계 데이터 보존 기간
매출 통계 데이터를 얼마나 보존하시겠습니까?

A) 무제한 (삭제하지 않음)
B) 1년 보존 후 자동 삭제
C) MVP에서는 보존 정책 없이 무제한 저장
D) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## 생성 실행 계획

질문 답변 승인 후 아래 순서로 실행합니다:

- [x] 1단계: 도메인 엔티티 설계 (domain-entities.md) - 엔티티, 필드, 관계, 제약조건
- [x] 2단계: 비즈니스 로직 모델 (business-logic-model.md) - 상세 알고리즘, 플로우, 검증 로직
- [x] 3단계: 비즈니스 규칙 (business-rules.md) - 규칙, 제약, 에러 처리
- [x] 4단계: 교차 검증 - 기존 산출물과 일관성 확인
