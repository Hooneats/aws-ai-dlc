# 비즈니스 규칙 - Backend

---

## 1. 인증 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-AUTH-01 | 관리자 JWT 만료: 16시간 | "세션이 만료되었습니다. 다시 로그인해주세요." |
| BR-AUTH-02 | 테이블 JWT 만료: 16시간 | "세션이 만료되었습니다. 초기 설정을 다시 해주세요." |
| BR-AUTH-03 | 비밀번호: bcrypt 해싱 (saltRounds: 10) | - |
| BR-AUTH-04 | 로그인 시도 제한: 없음 (MVP) | - |
| BR-AUTH-05 | 테이블 인증: 테이블 번호만으로 인증 (비밀번호 없음) | - |

---

## 2. 주문 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-ORD-01 | 주문 상태 전환: PENDING→PREPARING→COMPLETED (단방향) | "허용되지 않는 상태 변경입니다." |
| BR-ORD-02 | 주문 취소: PENDING→CANCELLED, PREPARING→CANCELLED 허용 | - |
| BR-ORD-03 | COMPLETED→다른 상태 전환 불가 | "완료된 주문은 변경할 수 없습니다." |
| BR-ORD-04 | CANCELLED→다른 상태 전환 불가 | "취소된 주문은 변경할 수 없습니다." |
| BR-ORD-05 | 품절 메뉴 주문 불가 | "품절된 메뉴입니다: {menuName}" |
| BR-ORD-06 | 비활성(삭제된) 메뉴 주문 불가 | "주문할 수 없는 메뉴입니다: {menuName}" |
| BR-ORD-07 | 주문 시 가격 스냅샷 저장 (menuName, originalPrice, discountRate, unitPrice) | - |
| BR-ORD-08 | 주문 항목 삭제 시 totalAmount 재계산 | - |
| BR-ORD-09 | 주문 항목 전부 삭제 시 주문 자체 삭제 | - |
| BR-ORD-10 | 고객 화면: PENDING/PREPARING/COMPLETED → "주문완료" 표시 | - |
| BR-ORD-11 | 고객 화면: CANCELLED 주문은 목록에서 제외 | - |

---

## 3. 메뉴 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-MENU-01 | 할인율 범위: 1~99% 정수 (0=할인없음) | "할인율은 1~99% 사이여야 합니다." |
| BR-MENU-02 | 할인가 계산: floor(price * discountRate / 100) 차감 | - |
| BR-MENU-03 | 메뉴 삭제: Soft Delete (isActive=false) | - |
| BR-MENU-04 | 비활성 메뉴: 고객 목록 미노출, 재주문 불가 | - |
| BR-MENU-05 | 비활성 메뉴: 관리자 목록에서 비활성 상태 표시 | - |
| BR-MENU-06 | 메뉴 가격: 0 이상 정수 | "가격은 0원 이상이어야 합니다." |
| BR-MENU-07 | 메뉴명: 필수, 최대 100자 | "메뉴명을 입력해주세요." |
| BR-MENU-08 | 이미지: 선택, 로컬 서버 저장 | - |

---

## 4. 카테고리 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-CAT-01 | "기타" 카테고리: isDefault=true, isHidden=true, 삭제 불가 | "기본 카테고리는 삭제할 수 없습니다." |
| BR-CAT-02 | "서비스 요청" 카테고리: isServiceCategory=true, 삭제 불가 | "서비스 요청 카테고리는 삭제할 수 없습니다." |
| BR-CAT-03 | 카테고리 삭제 시: 소속 메뉴를 "기타" 카테고리로 이동 후 삭제 | - |
| BR-CAT-04 | isHidden=true 카테고리: 고객 화면 미노출 | - |
| BR-CAT-05 | 카테고리명: 필수, 최대 100자 | "카테고리명을 입력해주세요." |

---

## 5. 테이블 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-TBL-01 | 테이블 번호: 매장 내 고유 | "이미 존재하는 테이블 번호입니다." |
| BR-TBL-02 | 활성 세션 있는 테이블 삭제 불가 | "활성 세션이 있는 테이블은 삭제할 수 없습니다." |
| BR-TBL-03 | 정산: 모든 주문이 COMPLETED 또는 CANCELLED 상태여야 가능 | "미완료 주문이 있습니다. 완료 또는 취소 처리 후 정산해주세요." |
| BR-TBL-04 | 정산 시: COMPLETED 주문만 매출 합산 (CANCELLED 제외) | - |
| BR-TBL-05 | 정산 후: sessionId=NULL, 주문/서비스호출 정리, SSE 세션종료 이벤트 | - |
| BR-TBL-06 | 테이블 인증: 테이블 번호만으로 인증 (비밀번호 없음) | - |

---

## 6. 서비스 호출 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-SVC-01 | 서비스 호출: 무제한 중복 허용 | - |
| BR-SVC-02 | 서비스 항목: 서비스 카테고리(isServiceCategory=true)의 Menu만 허용 | "서비스 항목이 아닙니다." |
| BR-SVC-03 | 상태 전환: PENDING→CONFIRMED→COMPLETED | - |
| BR-SVC-04 | 정산 시 해당 테이블 ServiceCall 전체 삭제 | - |

---

## 7. 통계 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-STAT-01 | 기간 조회: 최대 365일 | "조회 기간은 최대 1년입니다." |
| BR-STAT-02 | 데이터 보존: 무제한 (MVP) | - |
| BR-STAT-03 | 매출 집계: COMPLETED 주문만 (CANCELLED 제외) | - |
| BR-STAT-04 | 객단가: 오늘 매출 / 영업 중 테이블 수 (0이면 0) | - |

---

## 8. 파일 업로드 규칙

| ID | 규칙 | 에러 메시지 |
|----|------|-----------|
| BR-UPL-01 | 허용 형식: jpg, jpeg, png, gif, webp | "지원하지 않는 이미지 형식입니다." |
| BR-UPL-02 | 최대 크기: 5MB | "이미지 크기는 5MB 이하여야 합니다." |
| BR-UPL-03 | 저장 경로: uploads/{timestamp}-{originalName} | - |

---

## 9. SSE 이벤트 정의

| 이벤트 | 대상 | 페이로드 | 트리거 |
|--------|------|---------|--------|
| newOrder | 관리자 | {orderId, tableNo, items, totalAmount, memo} | 주문 생성 |
| orderStatus | 고객(테이블) | {orderId, status} | 상태 변경 |
| orderDeleted | 관리자 + 고객(테이블) | {orderId, tableId} | 주문 삭제 |
| orderUpdated | 관리자 + 고객(테이블) | {orderId, tableId, items, totalAmount} | 주문 항목 삭제 |
| serviceCall | 관리자 | {serviceCallId, tableNo, menuName} | 서비스 호출 |
| sessionEnd | 고객(테이블) | {tableId} | 테이블 정산 |
