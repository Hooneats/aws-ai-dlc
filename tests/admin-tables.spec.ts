/**
 * US-A04: 테이블 추가/삭제
 * US-A07: 테이블 정산
 */
import { test, expect } from './fixtures';

test.describe('US-A04: 테이블 추가/삭제', () => {
  test('테이블 추가 → 목록에 표시', async ({ adminPage: page }) => {
    await page.goto('/admin/tables');

    const testTableNo = '99';
    await page.getByTestId('new-table-no').locator('input').fill(testTableNo);
    await page.getByTestId('add-table').click();

    // 추가된 테이블 확인
    await expect(page.getByText(`테이블 ${testTableNo}`)).toBeVisible({ timeout: 5000 });

    // 정리: 삭제
    await page.getByTestId(`delete-table-${testTableNo}`).click();
    await page.getByTestId('confirm-dialog-confirm').click();
  });

  test('테이블 삭제 시 확인 팝업', async ({ adminPage: page }) => {
    await page.goto('/admin/tables');

    // 삭제 버튼 클릭
    const deleteBtn = page.locator('[data-testid^="delete-table-"]').first();
    if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteBtn.click();
      // 확인 다이얼로그 표시
      await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible();
      // 취소
      await page.getByTestId('confirm-dialog-cancel').click();
    }
  });
});

test.describe('US-A07: 테이블 정산', () => {
  test('정산 버튼 클릭 → 정산 다이얼로그 표시', async ({ adminPage: page }) => {
    await page.goto('/admin/tables');

    // 세션이 있는 테이블의 정산 버튼
    const settleBtn = page.locator('[data-testid^="settle-"]').first();
    if (await settleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await settleBtn.click();
      await expect(page.getByTestId('settle-confirm')).toBeVisible();
    }
  });
});
