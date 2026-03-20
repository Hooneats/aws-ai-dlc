/**
 * US-C07: 주문 확정
 * US-C08: 추가 주문
 * US-C09: 현재 세션 주문 내역 조회
 */
import { test, expect } from './fixtures';

test.describe('US-C07: 주문 확정', () => {
  test('장바구니 → 주문 확인 → 주문 완료 → 메뉴 화면 복귀', async ({ customerPage: page }) => {
    // 메뉴 담기
    const addBtn = page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first();
    await addBtn.click();
    await page.waitForTimeout(500);

    // 장바구니로 이동
    await page.getByTestId('nav-cart').click();
    await expect(page.locator('[data-testid^="cart-item-"]').first()).toBeVisible();

    // 주문하기 클릭
    await page.getByTestId('cart-order').click();
    await expect(page).toHaveURL(/\/order/);

    // 요청사항 입력 (선택)
    await page.getByTestId('order-memo').locator('input').fill('덜 맵게 해주세요');

    // 주문 확정
    await page.getByTestId('order-confirm').click();

    // 메뉴 화면으로 복귀
    await page.waitForURL('**/menu', { timeout: 10000 });
    await expect(page).toHaveURL(/\/menu/);
  });
});

test.describe('US-C08: 추가 주문', () => {
  test('첫 주문 후 추가 주문 가능', async ({ customerPage: page }) => {
    // 첫 번째 주문
    await page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first().click();
    await page.waitForTimeout(500);
    await page.getByTestId('nav-cart').click();
    await page.getByTestId('cart-order').click();
    await page.getByTestId('order-confirm').click();
    await page.waitForURL('**/menu', { timeout: 10000 });

    // 추가 주문
    await page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first().click();
    await page.waitForTimeout(500);
    await page.getByTestId('nav-cart').click();
    await page.getByTestId('cart-order').click();
    await page.getByTestId('order-confirm').click();
    await page.waitForURL('**/menu', { timeout: 10000 });

    // 주문 내역에서 2건 확인
    await page.getByTestId('nav-history').click();
    await expect(page).toHaveURL(/\/history/);
    // 최소 2건의 주문 카드가 보이는지 확인
    await expect(page.locator('[data-testid^="order-card-"]').nth(1)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('US-C09: 현재 세션 주문 내역 조회', () => {
  test('주문 후 주문 내역 화면에서 확인', async ({ customerPage: page }) => {
    // 주문 생성
    await page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first().click();
    await page.waitForTimeout(500);
    await page.getByTestId('nav-cart').click();
    await page.getByTestId('cart-order').click();
    await page.getByTestId('order-confirm').click();
    await page.waitForURL('**/menu', { timeout: 10000 });

    // 주문 내역 확인
    await page.getByTestId('nav-history').click();
    await expect(page.locator('[data-testid^="order-card-"]').first()).toBeVisible({ timeout: 5000 });
  });
});
