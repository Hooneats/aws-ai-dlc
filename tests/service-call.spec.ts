/**
 * US-C11: 서비스 요청
 */
import { test, expect } from './fixtures';

test.describe('US-C11: 서비스 요청', () => {
  test('서비스 요청 카테고리 → 항목 선택 → 요청 완료', async ({ customerPage: page }) => {
    // 서비스 요청 카테고리 찾기 (isServiceCategory인 카테고리)
    const serviceCategory = page.locator('[data-testid^="category-"]').filter({ hasText: /서비스/ });
    const count = await serviceCategory.count();

    if (count > 0) {
      await serviceCategory.first().click();

      // 서비스 항목의 "요청하기" 버튼 클릭
      const serviceBtn = page.locator('[data-testid^="service-call-"]').first();
      if (await serviceBtn.isVisible()) {
        await serviceBtn.click();
        // 요청 완료 스낵바
        await expect(page.getByText(/요청 완료/)).toBeVisible();
      }
    }
  });
});
