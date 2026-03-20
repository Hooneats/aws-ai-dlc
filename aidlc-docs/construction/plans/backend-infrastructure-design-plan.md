# Infrastructure Design 계획 - Backend

## 개요
로컬 Docker Compose 환경의 인프라 설계를 확정합니다.

---

## 질문

### Question 1: MySQL 데이터 영속성
Docker Compose 재시작 시 MySQL 데이터를 어떻게 하시겠습니까?

A) Named Volume으로 영속 보존 (docker-compose down 후에도 유지, -v 옵션으로만 삭제)
B) 매번 초기화 (Seed 데이터로 재생성)
C) Other (please describe after [Answer]: tag below)

[Answer]:C. 통계 데이터는 플라이웨이로 도커 이미지가 뜰 때 더미 데이터 넣어줘. 대시보드가 보일 수 있게.

### Question 2: Frontend 빌드/서빙 방식
Docker에서 Frontend를 어떻게 서빙하시겠습니까?

A) Nginx 정적 서빙 (빌드 후 dist/ 서빙, 프로덕션 유사)
B) Vite dev server (HMR 지원, 개발 편의)
C) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## 생성 실행 계획

- [x] 1단계: 인프라 설계 (infrastructure-design.md)
- [x] 2단계: 배포 아키텍처 (deployment-architecture.md)
