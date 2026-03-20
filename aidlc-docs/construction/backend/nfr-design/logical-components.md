# 논리적 컴포넌트 - Backend

---

## NestJS 모듈별 컴포넌트 구조 패턴

```
{Module}/
├── {module}.module.ts
├── {module}.controller.ts
├── {module}.service.ts
├── entities/
│   └── {entity}.entity.ts
└── dto/
    ├── create-{entity}.dto.ts
    └── update-{entity}.dto.ts
```

---

## 공통 컴포넌트

### common/
| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| GlobalExceptionFilter | filters/global-exception.filter.ts | 표준 에러 응답 변환 |
| AdminGuard | guards/admin.guard.ts | 관리자 인증 검증 |
| TableGuard | guards/table.guard.ts | 테이블 인증 검증 |
| JwtStrategy | strategies/jwt.strategy.ts | JWT 토큰 파싱/검증 |
| CurrentUser | decorators/current-user.decorator.ts | 요청에서 사용자 정보 추출 |

### database/
| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| DatabaseModule | database.module.ts | TypeORM 연결 설정 |
| SeedService | seed.service.ts | 초기 데이터 생성 (Store, Admin, 기본 카테고리) |

### logger/
| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| LoggerModule | logger.module.ts | Winston 설정 (Console + 파일, 일별 로테이션 14일) |

---

## 모듈별 컴포넌트

### AuthModule
| 컴포넌트 | 역할 |
|---------|------|
| AuthController | POST /auth/admin/login, POST /auth/table/login |
| AuthService | 로그인 검증, JWT 발급 |

### StoreModule
| 컴포넌트 | 역할 |
|---------|------|
| StoreService | 매장 정보 조회 |
| Store Entity | 매장 엔티티 |

### TableModule
| 컴포넌트 | 역할 |
|---------|------|
| TableController | CRUD, 정산, 과거 내역 |
| TableService | 테이블 관리, 정산 로직 |
| Table Entity | 테이블 엔티티 |

### CategoryModule
| 컴포넌트 | 역할 |
|---------|------|
| CategoryController | CRUD, 순서 변경 |
| CategoryService | 카테고리 관리, 삭제 시 메뉴 이동 |
| Category Entity | 카테고리 엔티티 |

### MenuModule
| 컴포넌트 | 역할 |
|---------|------|
| MenuController | CRUD, 추천/할인/품절, 이미지 |
| MenuService | 메뉴 관리, 할인가 계산, Soft Delete |
| Menu Entity | 메뉴 엔티티 |

### OrderModule
| 컴포넌트 | 역할 |
|---------|------|
| OrderController | 생성, 상태 변경, 삭제, 조회 |
| OrderService | 주문 로직, 이력 이동, 일괄 상태 변경 |
| Order Entity | 주문 엔티티 |
| OrderItem Entity | 주문 항목 엔티티 |
| OrderHistory Entity | 주문 이력 엔티티 |
| OrderHistoryItem Entity | 주문 이력 항목 엔티티 |

### ServiceCallModule
| 컴포넌트 | 역할 |
|---------|------|
| ServiceCallController | 요청 생성, 확인/완료 |
| ServiceCallService | 서비스 호출 관리 |
| ServiceCall Entity | 서비스 호출 엔티티 |

### SseModule
| 컴포넌트 | 역할 |
|---------|------|
| SseController | GET /sse/admin, GET /sse/table/:tableId |
| SseService | 연결 관리, 이벤트 발행, 버퍼 관리 (FIFO 100개, 정산 시 클리어, 연결 해제 5분 후 클리어) |

### StatisticsModule
| 컴포넌트 | 역할 |
|---------|------|
| StatisticsController | 대시보드, 일별, 기간별 통계 |
| StatisticsService | 매출 집계 로직 |

### UploadModule
| 컴포넌트 | 역할 |
|---------|------|
| UploadController | POST /upload/image |
| UploadService | Multer 파일 저장, 정적 파일 서빙 |

---

## Docker Compose 구성

```yaml
services:
  backend:
    build: ./backend
    ports: ["3000:3000"]
    depends_on: [mysql]
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    env_file: ./backend/.env

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: [backend]

  mysql:
    image: mysql:8
    ports: ["3306:3306"]
    volumes: ["mysql_data:/var/lib/mysql"]
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: table_order

volumes:
  mysql_data:
```
