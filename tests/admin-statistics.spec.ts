/**
 * US-A16: 실시간 운영 현황 대시보드
 * US-A17: 일별 매출 통계 조회
 */
import { test, expect } from './fixtures';

test.describe('US-A16~A17: 매출 통계', () => {
  test('통계 화면 접근 → 대시보드 데이터 표시', async ({ adminPage: page }) => {
    await page.goto('/admin/statistics');
    await page.waitForLoadState('networkidle');
    // 통계 화면 로드 확인
    await expect(page.getByText('매출 통계')).toBeVisible({ timeout: 5000 });
  });
});
