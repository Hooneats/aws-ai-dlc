# NFR Design 계획 - Backend

## 개요
NFR 요구사항을 구체적인 설계 패턴과 논리적 컴포넌트로 반영합니다.

---

## 질문

### Question 1: SSE 연결 관리 패턴
SSE 연결이 끊어졌을 때 미전달 이벤트를 어떻게 처리하시겠습니까?

A) 재연결 시 최신 상태만 전달 (미전달 이벤트 유실 허용, 단순)
B) Last-Event-ID 기반 미전달 이벤트 재전송 (이벤트 버퍼 유지)
C) Other (please describe after [Answer]: tag below)

[Answer]:B

### Question 2: Winston 로그 출력 대상
Winston 로그를 어디에 출력하시겠습니까?

A) Console만 (Docker logs로 확인, MVP 적합)
B) Console + 파일 (logs/ 디렉토리에 일별 로테이션)
C) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## 생성 실행 계획

- [x] 1단계: NFR 설계 패턴 (nfr-design-patterns.md)
- [x] 2단계: 논리적 컴포넌트 (logical-components.md)
