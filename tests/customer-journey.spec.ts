/**
 * 통합 E2E 시나리오: 고객 전체 주문 여정
 * 페르소나: 김민준 (디지털 네이티브 고객)
 *
 * 흐름: 테이블 설정 → 메뉴 탐색 → 장바구니 담기 → 주문 확정 → 주문 내역 확인
 */
import { test as base, expect } from '@playwright/test';
import { TEST_CONFIG } from './fixtures';

base.describe('고객 전체 주문 여정 (김민준 시나리오)', () => {
  base('테이블 설정 → 메뉴 → 장바구니 → 주문 → 내역 확인', async ({ page }) => {
    // 1. 테이블 설정 (US-C01)
    await page.goto('/table/setup');
    await page.getByTestId('table-setup-store-code').locator('input').fill(TEST_CONFIG.storeCode);
    await page.getByTestId('table-setup-table-no').locator('input').fill(String(TEST_CONFIG.tableNo));
    await page.getByTestId('table-setup-submit').click();
    await page.waitForURL(`**/table/${TEST_CONFIG.tableNo}/menu`);

    // 2. 메뉴 탐색 (US-C02, US-C03)
    await expect(page.getByTestId('category-recommended')).toBeVisible();

    // 카테고리 전환
    const categories = page.locator('[data-testid^="category-"]:not([data-testid="category-recommended"])');
    if (await categories.count() > 0) {
      await categories.first().click();
      await page.waitForTimeout(500);
      // 다시 추천으로
      await page.getByTestId('category-recommended').click();
      await page.waitForTimeout(500);
    }

    // 3. 장바구니에 메뉴 추가 (US-C05)
    const addBtn = page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();
    await expect(page.getByText(/담김/)).toBeVisible();
    await page.waitForTimeout(500);

    // 한 번 더 담기 (수량 증가)
    await addBtn.click();
    await page.waitForTimeout(500);

    // 4. 장바구니 확인 (US-C06)
    await page.getByTestId('nav-cart').click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator('[data-testid^="cart-item-"]').first()).toBeVisible();

    // 총 금액 표시 확인
    await expect(page.getByText(/총.*원/)).toBeVisible();

    // 5. 주문 확정 (US-C07)
    await page.getByTestId('cart-order').click();
    await expect(page).toHaveURL(/\/order/);

    // 요청사항 입력
    await page.getByTestId('order-memo').locator('input').fill('덜 맵게 해주세요');

    // 주문 확정
    await page.getByTestId('order-confirm').click();
    await page.waitForURL('**/menu', { timeout: 10000 });

    // 6. 주문 내역 확인 (US-C09)
    await page.getByTestId('nav-history').click();
    await expect(page).toHaveURL(/\/history/);
    await expect(page.locator('[data-testid^="order-card-"]').first()).toBeVisible({ timeout: 5000 });
  });
});
