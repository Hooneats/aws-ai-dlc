# 도메인 엔티티 설계 - Backend

---

## 엔티티 관계도

```
Store (1) ──── (1) Admin
  │
  └──── (N) Table ──── (N) Order ──── (N) OrderItem ──── Menu
                │                                          │
                ├──── (N) ServiceCall ─────────────────── Menu
                │
                └──── (N) OrderHistory ──── (N) OrderHistoryItem

Category (1) ──── (N) Menu
```

---

## 엔티티 정의

### Store
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 매장 식별 코드 |
| name | VARCHAR(100) | NOT NULL | 매장명 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |

### Admin
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| storeId | INT | FK(Store), NOT NULL | |
| username | VARCHAR(50) | NOT NULL | |
| password | VARCHAR(255) | NOT NULL | bcrypt 해시 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |

### Table
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| storeId | INT | FK(Store), NOT NULL | |
| tableNo | INT | NOT NULL | 테이블 번호 |
| sessionId | VARCHAR(36) | NULLABLE | 현재 세션 UUID (NULL=비활성) |
| sessionStartedAt | DATETIME | NULLABLE | 세션 시작 시각 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |
| **UNIQUE** | (storeId, tableNo) | | |

### Category
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| storeId | INT | FK(Store), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | 카테고리명 |
| sortOrder | INT | NOT NULL, DEFAULT 0 | 노출 순서 |
| isServiceCategory | BOOLEAN | NOT NULL, DEFAULT FALSE | 서비스 요청 카테고리 여부 |
| isDefault | BOOLEAN | NOT NULL, DEFAULT FALSE | 기본 "기타" 카테고리 여부 (삭제 불가) |
| isHidden | BOOLEAN | NOT NULL, DEFAULT FALSE | 관리자 전용 (고객 미노출) |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |

> "기타" 카테고리: isDefault=true, isHidden=true. Seed 데이터로 생성. 삭제 불가. 카테고리 삭제 시 메뉴 이동 대상.

### Menu
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| storeId | INT | FK(Store), NOT NULL | |
| categoryId | INT | FK(Category), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | 메뉴명 |
| price | INT | NOT NULL, >= 0 | 원래 가격 (원) |
| description | TEXT | NULLABLE | 설명 |
| imageUrl | VARCHAR(500) | NULLABLE | 이미지 경로 |
| sortOrder | INT | NOT NULL, DEFAULT 0 | 노출 순서 |
| isRecommended | BOOLEAN | NOT NULL, DEFAULT FALSE | 추천 여부 |
| discountRate | INT | NOT NULL, DEFAULT 0 | 할인율 (0=할인없음, 1~99%) |
| isSoldOut | BOOLEAN | NOT NULL, DEFAULT FALSE | 품절 여부 |
| isActive | BOOLEAN | NOT NULL, DEFAULT TRUE | 활성 여부 (Soft Delete) |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |
| updatedAt | DATETIME | NOT NULL, DEFAULT NOW ON UPDATE | |

### Order
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| tableId | INT | FK(Table), NOT NULL | |
| sessionId | VARCHAR(36) | NOT NULL | 테이블 세션 ID |
| status | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING/PREPARING/COMPLETED/CANCELLED |
| totalAmount | INT | NOT NULL | 총 금액 (할인 적용) |
| memo | TEXT | NULLABLE | 요청사항 |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |
| updatedAt | DATETIME | NOT NULL, DEFAULT NOW ON UPDATE | |

> 고객 화면 표시 규칙: PENDING/PREPARING → "주문완료", COMPLETED → "주문완료", CANCELLED → "주문취소"

### OrderItem
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| orderId | INT | FK(Order), NOT NULL | |
| menuId | INT | FK(Menu), NOT NULL | |
| menuName | VARCHAR(100) | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | INT | NOT NULL, >= 1 | 수량 |
| unitPrice | INT | NOT NULL | 주문 시점 단가 (할인 적용가) |
| originalPrice | INT | NOT NULL | 주문 시점 원래 가격 |
| discountRate | INT | NOT NULL, DEFAULT 0 | 주문 시점 할인율 |

### OrderHistory
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| tableId | INT | FK(Table), NOT NULL | |
| sessionId | VARCHAR(36) | NOT NULL | |
| totalAmount | INT | NOT NULL | 세션 총 금액 |
| orderCount | INT | NOT NULL | 주문 건수 |
| settledAt | DATETIME | NOT NULL | 정산 시각 |
| createdAt | DATETIME | NOT NULL | 세션 시작 시각 |

### OrderHistoryItem
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| historyId | INT | FK(OrderHistory), NOT NULL | |
| orderId | INT | NOT NULL | 원본 주문 ID (참조용) |
| status | ENUM | NOT NULL | COMPLETED/CANCELLED |
| totalAmount | INT | NOT NULL | 주문 금액 |
| memo | TEXT | NULLABLE | 요청사항 |
| items | JSON | NOT NULL | 주문 항목 스냅샷 [{menuName, quantity, unitPrice, originalPrice, discountRate}] |
| orderedAt | DATETIME | NOT NULL | 원본 주문 시각 |

### ServiceCall
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | INT | PK, AUTO_INCREMENT | |
| tableId | INT | FK(Table), NOT NULL | |
| menuId | INT | FK(Menu), NOT NULL | 서비스 항목 (서비스 카테고리의 Menu) |
| menuName | VARCHAR(100) | NOT NULL | 요청 시점 항목명 (스냅샷) |
| status | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING/CONFIRMED/COMPLETED |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW | |
| updatedAt | DATETIME | NOT NULL, DEFAULT NOW ON UPDATE | |

---

## Seed 데이터

| 엔티티 | 데이터 |
|--------|--------|
| Store | code: "store01", name: "우리매장" |
| Admin | username: "admin", password: bcrypt("admin1234") |
| Category | name: "기타", isDefault: true, isHidden: true, sortOrder: 9999 |
| Category | name: "서비스 요청", isServiceCategory: true, sortOrder: 9998 |
