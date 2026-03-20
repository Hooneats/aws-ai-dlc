# NFR Requirements 계획 - Backend

## 개요
Backend Unit의 비기능 요구사항을 상세화하고 기술 스택 세부 결정을 확정합니다.

---

## 질문

### Question 1: NestJS ORM 선택
NestJS에서 사용할 ORM을 어떻게 하시겠습니까?

A) TypeORM (NestJS 공식 통합, 데코레이터 기반, Active Record/Data Mapper 패턴)
B) Prisma (타입 안전, 스키마 기반, 자동 마이그레이션)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2: API 문서화
API 문서화를 어떻게 하시겠습니까?

A) Swagger/OpenAPI (NestJS @nestjs/swagger 통합, 자동 생성)
B) 문서화 없음 (MVP에서는 생략)
C) Other (please describe after [Answer]: tag below)

[Answer]:A

### Question 3: 에러 처리 전략
Backend 에러 응답 형식을 어떻게 하시겠습니까?

A) 표준화된 에러 응답 (Global Exception Filter, {statusCode, message, error, timestamp})
B) NestJS 기본 에러 응답 그대로 사용
C) Other (please describe after [Answer]: tag below)

[Answer]:A

### Question 4: 로깅 수준
Backend 로깅을 어떻게 하시겠습니까?

A) NestJS 기본 Logger 사용 (console 출력)
B) Winston/Pino 등 외부 로거 (구조화된 JSON 로깅)
C) 로깅 최소화 (MVP에서는 에러만)
D) Other (please describe after [Answer]: tag below)

[Answer]:B

### Question 5: 데이터 검증
요청 데이터 검증을 어떻게 하시겠습니까?

A) class-validator + class-transformer (NestJS ValidationPipe, DTO 데코레이터)
B) Joi/Zod 등 스키마 기반 검증
C) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## 생성 실행 계획

질문 답변 승인 후 아래 순서로 실행합니다:

- [x] 1단계: NFR 요구사항 상세화 (nfr-requirements.md)
- [x] 2단계: 기술 스택 결정 (tech-stack-decisions.md)
