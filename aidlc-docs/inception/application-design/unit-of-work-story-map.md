# Unit of Work - 유저 스토리 매핑

## Unit 1: Backend (NestJS)

### 1단계: 인프라 기반
| 모듈 | 관련 스토리 |
|------|------------|
| DB 스키마 | 전체 (모든 엔티티 기반) |
| StoreModule | US-A01 (매장 인증 - Seed) |
| UploadModule | US-A09 (메뉴 CRUD - 이미지) |

### 2단계: 인증
| 모듈 | 관련 스토리 |
|------|------------|
| AuthModule | US-C01 (테이블 자동 로그인), US-A01 (관리자 로그인) |

### 3단계: 기본 CRUD
| 모듈 | 관련 스토리 |
|------|------------|
| CategoryModule | US-A13 (카테고리 관리), US-C03 (카테고리별 조회) |
| MenuModule | US-C02 (추천 메뉴), US-C03 (카테고리별 조회), US-C04 (할인/품절), US-A09 (메뉴 CRUD), US-A10 (추천 지정), US-A11 (할인 설정), US-A12 (품절 설정), US-A15 (서비스 항목 관리) |
| TableModule (기본) | US-A04 (테이블 추가/삭제), US-A05 (초기 설정) |

### 4단계: 핵심 비즈니스
| 모듈 | 관련 스토리 |
|------|------------|
| OrderModule | US-C05 (장바구니 추가), US-C07 (주문 확정), US-C08 (추가 주문), US-C09 (주문 내역), US-A02 (주문 모니터링), US-A03 (상태 변경), US-A06 (주문 삭제) |
| ServiceCallModule | US-C11 (서비스 요청), US-A14 (서비스 호출 수신/처리) |

### 5단계: 실시간 통신
| 모듈 | 관련 스토리 |
|------|------------|
| SseModule | US-C10 (주문 상태 실시간), US-A02 (실시간 대시보드), US-A14 (서비스 호출 알림) |
| TableModule (정산) | US-A07 (테이블 정산), US-A08 (과거 내역) |

### 6단계: 고급 기능
| 모듈 | 관련 스토리 |
|------|------------|
| StatisticsModule | US-A16 (실시간 대시보드), US-A17 (일별 통계), US-A18 (기간별 통계) |

---

## Unit 2: Frontend (React)

### 1단계: 인증/기반
| 페이지/Provider | 관련 스토리 |
|----------------|------------|
| LoginPage | US-A01 |
| TableSetupPage | US-C01, US-A05 |
| AuthProvider | US-C01, US-A01 |

### 2단계: 메뉴/카테고리
| 페이지 | 관련 스토리 |
|--------|------------|
| MenuPage | US-C02, US-C03, US-C04, US-C11 |
| MenuManagementPage | US-A09, US-A10, US-A11, US-A12, US-A15 |
| CategoryManagementPage | US-A13 |

### 3단계: 장바구니/주문
| 페이지/Provider | 관련 스토리 |
|----------------|------------|
| CartPage | US-C05, US-C06 |
| OrderPage | US-C07, US-C08 |
| CartProvider | US-C05, US-C06 |

### 4단계: 주문 관리
| 페이지/Provider | 관련 스토리 |
|----------------|------------|
| OrderHistoryPage | US-C09, US-C10 |
| DashboardPage | US-A02, US-A03, US-A06, US-A14 |
| SseProvider | US-C10, US-A02, US-A14 |

### 5단계: 테이블/서비스
| 페이지 | 관련 스토리 |
|--------|------------|
| TableManagementPage | US-A04, US-A05, US-A07, US-A08 |

### 6단계: 고급 기능
| 페이지 | 관련 스토리 |
|--------|------------|
| StatisticsPage | US-A16, US-A17, US-A18 |

---

## 스토리 커버리지 검증

### 고객 스토리 (11개) - ✅ 전체 매핑 완료
| 스토리 | Backend | Frontend |
|--------|---------|----------|
| US-C01 | AuthModule | TableSetupPage, AuthProvider |
| US-C02 | MenuModule | MenuPage |
| US-C03 | CategoryModule, MenuModule | MenuPage |
| US-C04 | MenuModule | MenuPage |
| US-C05 | OrderModule | CartPage, CartProvider |
| US-C06 | - (클라이언트 전용) | CartPage, CartProvider |
| US-C07 | OrderModule | OrderPage |
| US-C08 | OrderModule | OrderPage |
| US-C09 | OrderModule | OrderHistoryPage |
| US-C10 | SseModule | OrderHistoryPage, SseProvider |
| US-C11 | ServiceCallModule | MenuPage |

### 관리자 스토리 (18개) - ✅ 전체 매핑 완료
| 스토리 | Backend | Frontend |
|--------|---------|----------|
| US-A01 | AuthModule, StoreModule | LoginPage, AuthProvider |
| US-A02 | SseModule | DashboardPage, SseProvider |
| US-A03 | OrderModule | DashboardPage |
| US-A04 | TableModule | TableManagementPage |
| US-A05 | TableModule, AuthModule | TableManagementPage, TableSetupPage |
| US-A06 | OrderModule | DashboardPage |
| US-A07 | TableModule | TableManagementPage |
| US-A08 | TableModule | TableManagementPage |
| US-A09 | MenuModule, UploadModule | MenuManagementPage |
| US-A10 | MenuModule | MenuManagementPage |
| US-A11 | MenuModule | MenuManagementPage |
| US-A12 | MenuModule | MenuManagementPage |
| US-A13 | CategoryModule | CategoryManagementPage |
| US-A14 | ServiceCallModule, SseModule | DashboardPage, SseProvider |
| US-A15 | MenuModule | MenuManagementPage |
| US-A16 | StatisticsModule | StatisticsPage |
| US-A17 | StatisticsModule | StatisticsPage |
| US-A18 | StatisticsModule | StatisticsPage |

**총 29개 스토리 전체 매핑 완료** ✅
