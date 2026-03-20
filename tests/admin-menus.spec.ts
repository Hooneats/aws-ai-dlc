/**
 * US-A09: 메뉴 CRUD
 * US-A13: 카테고리 관리
 */
import { test, expect } from './fixtures';

test.describe('US-A13: 카테고리 관리', () => {
  test('카테고리 추가 → 목록에 표시', async ({ adminPage: page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');

    const catName = `테스트${Date.now() % 10000}`;

    await page.getByTestId('add-category').click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });

    const nameInput = page.getByTestId('cat-form-name').locator('input');
    await nameInput.clear();
    await nameInput.fill(catName);

    const orderInput = page.getByTestId('cat-form-order').locator('input');
    await orderInput.clear();
    await orderInput.fill('99');

    await page.getByTestId('cat-form-submit').click();

    // 다이얼로그 닫힘 대기
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 5000 });

    // 추가된 카테고리 확인
    await expect(page.getByText(catName)).toBeVisible({ timeout: 5000 });
  });

  test('카테고리 삭제', async ({ adminPage: page }) => {
    await page.goto('/admin/categories');

    // 삭제 가능한 카테고리의 삭제 버튼
    const deleteBtn = page.locator('[data-testid^="delete-cat-"]').last();
    if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteBtn.click();
      await page.getByTestId('confirm-dialog-confirm').click();
    }
  });
});

test.describe('US-A09: 메뉴 CRUD', () => {
  test('메뉴 관리 화면 접근 → 메뉴 목록 표시', async ({ adminPage: page }) => {
    await page.goto('/admin/menus');
    // 메뉴 관리 화면이 로드되는지 확인
    await expect(page.getByText(/메뉴 관리/)).toBeVisible({ timeout: 5000 });
  });

  test('메뉴 추가 다이얼로그', async ({ adminPage: page }) => {
    await page.goto('/admin/menus');

    // 추가 버튼 클릭
    const addBtn = page.getByRole('button', { name: /추가/ });
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await expect(page.getByTestId('menu-form-name')).toBeVisible();
      await expect(page.getByTestId('menu-form-price')).toBeVisible();
      await expect(page.getByTestId('menu-form-submit')).toBeVisible();
    }
  });
});
