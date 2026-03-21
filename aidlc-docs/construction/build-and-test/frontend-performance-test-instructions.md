# Frontend Performance Test Instructions

## NFR 성능 기준

| ID | 항목 | 기준 |
|----|------|------|
| NFR-FE-PERF-01 | 초기 로딩 (FCP) | 3초 이내 (3G) |
| NFR-FE-PERF-02 | 라우트 전환 | 300ms 이내 |
| NFR-FE-PERF-03 | 코드 스플리팅 | 라우트별 chunk 분리 |
| NFR-FE-PERF-04 | 이미지 로딩 | Lazy loading 적용 |

## 1. 번들 사이즈 분석

```bash
cd frontend

# 프로덕션 빌드
npm run build

# dist/assets/ 폴더에서 chunk 사이즈 확인
ls -lh dist/assets/

# 기대: 메인 번들 < 300KB (gzip)
```

## 2. Lighthouse 성능 측정

```
1. Chrome DevTools → Lighthouse 탭
2. Categories: Performance 선택
3. Device: Mobile 선택
4. Throttling: Simulated Slow 4G
5. Analyze page load 실행
```

기대 결과:

| 메트릭 | 기준 |
|--------|------|
| FCP | < 3s |
| LCP | < 4s |
| TBT | < 300ms |
| CLS | < 0.1 |

## 3. 라우트 전환 성능

```
1. Chrome DevTools → Performance 탭
2. Record 시작
3. 페이지 간 네비게이션 수행
4. Record 중지
5. 라우트 전환 시간 확인
```

기대: 각 라우트 전환 < 300ms

## 4. 코드 스플리팅 확인

```
1. Chrome DevTools → Network 탭
2. 초기 로딩 시 로드되는 JS 파일 확인
3. 다른 라우트로 이동 시 추가 chunk 로드 확인
```

기대: 라우트별 별도 chunk 파일 로드

## 5. API 캐싱 확인

```
1. Network 탭에서 API 요청 모니터링
2. 카테고리 목록 조회 후 다른 페이지 이동 → 복귀
3. staleTime 내 재요청 없음 확인
```

기대:
- 카테고리: 5분간 캐시
- 메뉴: 1분간 캐시

## 검증 체크리스트

- [ ] 번들 사이즈 적정 (메인 < 300KB gzip)
- [ ] Lighthouse Performance 점수 > 70 (Mobile)
- [ ] 라우트 전환 < 300ms
- [ ] 코드 스플리팅 동작 확인
- [ ] API 캐싱 동작 확인
- [ ] 이미지 Lazy loading 동작 확인
