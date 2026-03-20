/**
 * US-C05: 장바구니에 메뉴 추가
 * US-C06: 장바구니 수량 조절 및 삭제
 */
import { test, expect } from './fixtures';

test.describe('US-C05: 장바구니에 메뉴 추가', () => {
  test('메뉴 담기 → 스낵바 표시 → 장바구니에서 확인', async ({ customerPage: page }) => {
    // 메뉴 카드의 담기 버튼 클릭
    const addBtn = page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    // 스낵바 "담김" 메시지
    await expect(page.getByText(/담김/)).toBeVisible();

    // 장바구니 페이지로 이동
    await page.getByTestId('nav-cart').click();
    await expect(page).toHaveURL(/\/cart/);

    // 장바구니에 아이템 존재
    await expect(page.locator('[data-testid^="cart-item-"]').first()).toBeVisible();
  });
});

test.describe('US-C06: 장바구니 수량 조절 및 삭제', () => {
  test('수량 증가/감소 및 삭제', async ({ customerPage: page }) => {
    // 먼저 메뉴 담기
    const addBtn = page.locator('[data-testid^="add-to-cart-"]:not(:disabled)').first();
    await addBtn.click();
    await page.waitForTimeout(500);

    // 장바구니로 이동
    await page.getByTestId('nav-cart').click();
    await expect(page.locator('[data-testid^="cart-item-"]').first()).toBeVisible();

    // 수량 증가
    const plusBtn = page.locator('[data-testid^="cart-plus-"]').first();
    await plusBtn.click();

    // 수량 감소
    const minusBtn = page.locator('[data-testid^="cart-minus-"]').first();
    await minusBtn.click();

    // 삭제
    const removeBtn = page.locator('[data-testid^="cart-remove-"]').first();
    await removeBtn.click();

    // 장바구니 비어있음
    await expect(page.getByText('장바구니가 비어있습니다')).toBeVisible();
  });

  test('전체 비우기', async ({ customerPage: page }) => {
    // 메뉴 2개 담기
    const addBtns = page.locator('[data-testid^="add-to-cart-"]:not(:disabled)');
    await addBtns.first().click();
    await page.waitForTimeout(300);
    await addBtns.first().click();
    await page.waitForTimeout(300);

    // 장바구니로 이동
    await page.getByTestId('nav-cart').click();

    // 비우기 버튼
    await page.getByTestId('cart-clear').click();
    // 확인 다이얼로그
    await page.getByTestId('confirm-dialog-confirm').click();

    await expect(page.getByText('장바구니가 비어있습니다')).toBeVisible();
  });
});
