# Unit of Work 의존성 매트릭스

## Unit 간 의존성

| Unit (행→열 의존) | Backend | Frontend |
|-------------------|---------|----------|
| **Backend**       |    -    |          |
| **Frontend**      |    O    |    -     |

- Frontend → Backend: REST API 호출, SSE 연결
- Backend는 독립적 (Frontend에 의존하지 않음)

---

## Backend 내부 모듈 의존성 (개발 순서 기준)

### 1단계: 인프라 기반 (의존성 없음)
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| StoreModule | - | Seed 데이터 |
| UploadModule | - | 파일 저장 |

### 2단계: 인증
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| AuthModule | StoreModule | 매장 정보 검증 |

### 3단계: 기본 CRUD
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| CategoryModule | - | 독립 |
| MenuModule | CategoryModule, UploadModule | 카테고리 검증, 이미지 업로드 |
| TableModule | OrderModule, ServiceCallModule, SseModule | 정산 시 이력 이동/정리/이벤트 |

> ⚠️ TableModule은 3단계에서 기본 CRUD만 구현하고, 정산 기능은 4~5단계 완료 후 통합

### 4단계: 핵심 비즈니스
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| OrderModule | MenuModule, SseModule | 품절 검증, 할인가, 실시간 알림 |
| ServiceCallModule | SseModule | 실시간 알림 |

### 5단계: 실시간 통신
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| SseModule | - | 독립 (이벤트 발행만) |

> ⚠️ SseModule은 독립적이지만, 다른 모듈에서 주입받아 사용하므로 먼저 스텁으로 생성 후 5단계에서 완성

### 6단계: 고급 기능
| 모듈 | 의존 대상 | 비고 |
|------|----------|------|
| StatisticsModule | OrderModule, TableModule | 주문 집계, 테이블 조회 |

---

## 순환 의존성 분석

순환 의존성 없음. 모든 의존 방향이 단방향:
- Auth → Store
- Menu → Category, Upload
- Order → Menu, Sse
- ServiceCall → Sse
- Table → Order, ServiceCall, Sse
- Statistics → Order, Table

---

## 개발 순서 의존성 그래프

```
[StoreModule, UploadModule]     ← 1단계 (독립)
         ↓
    [AuthModule]                ← 2단계
         ↓
[CategoryModule] → [MenuModule] ← 3단계
                   [SseModule stub]
                   [TableModule 기본 CRUD]
         ↓
[OrderModule, ServiceCallModule] ← 4단계
         ↓
    [SseModule 완성]            ← 5단계
         ↓
  [TableModule 정산 통합]
         ↓
  [StatisticsModule]            ← 6단계
```
