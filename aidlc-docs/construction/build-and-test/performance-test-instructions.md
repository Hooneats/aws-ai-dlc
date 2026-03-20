# Performance Test 가이드

## 성능 요구사항 (NFR)

| ID | 항목 | 기준 |
|----|------|------|
| NFR-PERF-01 | SSE 이벤트 전달 지연 | 주문 생성 후 2초 이내 |
| NFR-PERF-02 | API 응답 시간 (CRUD) | 200ms 이내 |
| NFR-PERF-02 | API 응답 시간 (통계) | 1초 이내 |
| NFR-PERF-03 | 동시 SSE 연결 | 최소 50개 |

## 테스트 도구

간단한 성능 검증에는 `curl` + `time` 또는 Apache Bench(`ab`)를 사용합니다.

## 테스트 실행

### 1. API 응답 시간 측정

```bash
# 단일 요청 응답 시간
time curl -s -o /dev/null -w "%{time_total}s" \
  http://localhost:3000/categories \
  -H "Authorization: Bearer <TOKEN>"

# Apache Bench: 100 요청, 동시 10개
ab -n 100 -c 10 \
  -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/categories
```

### 2. SSE 동시 연결 테스트

```bash
# 50개 동시 SSE 연결 (백그라운드)
for i in $(seq 1 50); do
  curl -s -N http://localhost:3000/sse/admin \
    -H "Authorization: Bearer <ADMIN_TOKEN>" &
done

# 연결 상태 확인
jobs | wc -l

# 이 상태에서 주문 생성 → 모든 연결에 이벤트 전달 확인
# 테스트 후 정리
kill $(jobs -p)
```

### 3. 통계 API 응답 시간

```bash
# 대시보드 조회
time curl -s -o /dev/null -w "%{time_total}s" \
  http://localhost:3000/statistics/dashboard \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 기간별 통계 조회
time curl -s -o /dev/null -w "%{time_total}s" \
  "http://localhost:3000/statistics/period?startDate=2026-01-01&endDate=2026-03-20" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## 판정 기준

| 테스트 | Pass 기준 |
|--------|----------|
| CRUD API 응답 | 평균 < 200ms |
| 통계 API 응답 | 평균 < 1000ms |
| SSE 이벤트 전달 | 주문 생성 후 2초 이내 수신 |
| 동시 SSE 연결 | 50개 연결 유지 + 이벤트 정상 전달 |

## 참고

이 프로젝트는 개발/워크샵 환경이므로 대규모 부하 테스트는 범위 밖입니다.
위 테스트는 NFR 요구사항의 기본 충족 여부를 확인하는 수준입니다.
