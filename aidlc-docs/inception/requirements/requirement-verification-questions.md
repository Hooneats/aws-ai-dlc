# Requirements Verification Questions

테이블오더 서비스 요구사항을 분석했습니다. 아래 질문에 답변해 주세요.
각 질문의 [Answer]: 뒤에 선택한 옵션 문자를 입력해 주세요.

---

## Question 1
Backend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Spring Boot (Java/Kotlin)
C) FastAPI (Python)
D) NestJS (TypeScript)
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 2
Frontend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 풀스택)
D) Svelte/SvelteKit
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) Amazon DynamoDB (NoSQL)
D) MongoDB
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬 개발 환경만 (Docker Compose 등)
C) Vercel/Netlify (Frontend) + AWS (Backend)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
고객용 UI와 관리자용 UI를 어떻게 구성하시겠습니까?

A) 하나의 Frontend 프로젝트에서 라우팅으로 분리
B) 별도의 Frontend 프로젝트로 분리 (고객용 / 관리자용)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
메뉴 이미지 관리 방식은 어떻게 하시겠습니까? (요구사항에 이미지 URL로 명시되어 있습니다)

A) 외부 이미지 URL 직접 입력 (별도 업로드 없음)
B) S3 등 클라우드 스토리지에 업로드 후 URL 자동 생성
C) 로컬 서버에 이미지 파일 업로드
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 7
매장(Store) 데이터는 어떻게 관리하시겠습니까?

A) 단일 매장만 지원 (MVP 단순화)
B) 다중 매장 지원 (매장별 독립 데이터)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
관리자 계정 생성은 어떻게 처리하시겠습니까?

A) 시스템 초기 데이터(Seed)로 미리 생성
B) 관리자 회원가입 기능 구현
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9
주문 상태 실시간 업데이트(고객 화면)는 MVP에 포함하시겠습니까? (요구사항에 "선택사항"으로 명시됨)

A) 포함 (SSE로 고객 화면에서도 주문 상태 실시간 반영)
B) 제외 (고객은 페이지 새로고침으로 상태 확인)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
메뉴 관리 기능은 MVP에 포함하시겠습니까? (요구사항 3.2.4에 정의되어 있으나 MVP 범위 4장에는 명시되지 않음)

A) 포함 (관리자가 메뉴 CRUD 가능)
B) 제외 (초기 데이터 Seed로만 메뉴 관리, MVP 이후 추가)
C) Other (please describe after [Answer]: tag below)

[Answer]: A
