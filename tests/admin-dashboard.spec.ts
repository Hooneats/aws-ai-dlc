/**
 * US-A02: 실시간 주문 대시보드
 * US-A03: 주문 상태 변경
 */
import { test, expect } from './fixtures';

test.describe('US-A02: 실시간 주문 대시보드', () => {
  test('대시보드에 테이블 카드 그리드 표시', async ({ adminPage: page }) => {
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    // 테이블 목록이 표시되는지 확인
    await expect(page.locator('[data-testid^="table-item-"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('소리 알림 토글', async ({ adminPage: page }) => {
    const soundToggle = page.getByTestId('sound-toggle');
    await expect(soundToggle).toBeVisible();
    await soundToggle.click(); // toggle on/off
  });
});

test.describe('US-A03: 주문 상태 변경', () => {
  test('주문 상태 변경 버튼 표시 (대기중→준비중→완료)', async ({ adminPage: page }) => {
    // 테이블 선택
    const tableItem = page.locator('[data-testid^="table-item-"]').first();
    await tableItem.click();

    // 주문이 있으면 상태 변경 버튼 확인
    const prepareBtn = page.locator('[data-testid^="order-prepare-"]').first();
    if (await prepareBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await prepareBtn.click();
      // 준비중→완료 버튼이 나타나는지 확인
      await expect(page.locator('[data-testid^="order-complete-"]').first()).toBeVisible({ timeout: 3000 });
    }
  });
});
