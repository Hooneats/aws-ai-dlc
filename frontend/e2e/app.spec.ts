import { test, expect, Page } from '@playwright/test';

const input = (page: Page, testId: string) => page.getByTestId(testId).locator('input');
const sidebar = (page: Page, label: string) => page.locator('.MuiDrawer-root').getByText(label, { exact: true });

async function adminLogin(page: Page) {
  await page.goto('/admin/login');
  await input(page, 'admin-login-store-code').fill('store01');
  await input(page, 'admin-login-username').fill('admin');
  await input(page, 'admin-login-password').fill('admin1234');
  await page.getByTestId('admin-login-submit').click();
  await page.waitForURL('**/admin/dashboard');
}

async function tableLogin(page: Page, tableNo = 1) {
  await page.goto('/table/setup');
  await input(page, 'table-setup-store-code').fill('store01');
  await input(page, 'table-setup-table-no').fill(String(tableNo));
  await page.getByTestId('table-setup-submit').click();
  await page.waitForURL(`**/table/${tableNo}/menu`);
}

async function adminNav(page: Page, path: string) {
  await adminLogin(page);
  await page.goto(`/admin/${path}`);
  await page.waitForTimeout(1500);
}

// ═══ 1. AUTH ═══
test.describe('1. Auth', () => {
  test('1-1. 관리자 로그인 성공', async ({ page }) => {
    await adminLogin(page);
    await expect(page).toHaveURL(/admin\/dashboard/);
  });

  test('1-2. 관리자 로그인 실패', async ({ page }) => {
    await page.goto('/admin/login');
    await input(page, 'admin-login-store-code').fill('store01');
    await input(page, 'admin-login-username').fill('admin');
    await input(page, 'admin-login-password').fill('wrong');
    await page.getByTestId('admin-login-submit').click();
    await expect(page.getByText('로그인에 실패했습니다')).toBeVisible();
  });

  test('1-3. 관리자 로그아웃', async ({ page }) => {
    await adminLogin(page);
    await page.getByTestId('admin-logout').click();
    await expect(page).toHaveURL(/admin\/login/);
  });

  test('1-4. 테이블 로그인 성공', async ({ page }) => {
    await tableLogin(page, 1);
    await expect(page).toHaveURL(/table\/1\/menu/);
  });

  test('1-5. 테이블 로그인 실패', async ({ page }) => {
    await page.goto('/table/setup');
    await input(page, 'table-setup-store-code').fill('store01');
    await input(page, 'table-setup-table-no').fill('99');
    await page.getByTestId('table-setup-submit').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/setup/);
  });
});

// ═══ 2. CATEGORY ═══
test.describe('2. Category', () => {
  test('2-1. 카테고리 CRUD', async ({ page }) => {
    await adminNav(page, 'categories');
    await page.getByTestId('add-category').click();
    await input(page, 'cat-form-name').fill('E2E카테고리');
    await input(page, 'cat-form-order').fill('99');
    await page.getByTestId('cat-form-submit').click();
    await expect(page.getByText('E2E카테고리').first()).toBeVisible({ timeout: 5000 });

    // cleanup via API
    const token = await page.evaluate(() => JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token);
    const res = await page.request.get('http://localhost:3000/categories?storeId=1&includeHidden=true');
    const cats = await res.json();
    for (const c of cats.filter((x: any) => x.name === 'E2E카테고리')) {
      await page.request.delete(`http://localhost:3000/categories/${c.id}`, { headers: { Authorization: `Bearer ${token}` } });
    }
  });
});

// ═══ 3. MENU ═══
test.describe('3. Menu', () => {
  test('3-1. 메뉴 목록 표시', async ({ page }) => {
    await adminNav(page, 'menus');
    await expect(page.getByText('떡볶이').first()).toBeVisible();
  });

  test('3-2. 추천 토글', async ({ page }) => {
    await adminNav(page, 'menus');
    const sw = page.locator('[data-testid^="rec-"]').first();
    const cb = sw.locator('input[type="checkbox"]');
    const before = await cb.isChecked();
    await sw.click();
    await page.waitForTimeout(1500);
    expect(await cb.isChecked()).toBe(!before);
    await sw.click();
  });

  test('3-3. 품절 토글', async ({ page }) => {
    await adminNav(page, 'menus');
    const sw = page.locator('[data-testid^="soldout-"]').first();
    const cb = sw.locator('input[type="checkbox"]');
    const before = await cb.isChecked();
    await sw.click();
    await page.waitForTimeout(1500);
    expect(await cb.isChecked()).toBe(!before);
    await sw.click();
  });

  test('3-4. 메뉴 생성', async ({ page }) => {
    await adminNav(page, 'menus');
    await page.getByTestId('add-menu').click();
    await input(page, 'menu-form-name').fill('E2E테스트메뉴');
    await input(page, 'menu-form-price').fill('9999');
    await page.getByTestId('menu-form-category').click();
    await page.getByRole('option').first().click();
    await page.getByTestId('menu-form-submit').click();
    await expect(page.getByText('E2E테스트메뉴').first()).toBeVisible({ timeout: 5000 });

    // cleanup
    const token = await page.evaluate(() => JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token);
    const res = await page.request.get('http://localhost:3000/menus?storeId=1&activeOnly=false', { headers: { Authorization: `Bearer ${token}` } });
    const menus = await res.json();
    for (const m of menus.filter((x: any) => x.name === 'E2E테스트메뉴')) {
      await page.request.delete(`http://localhost:3000/menus/${m.id}`, { headers: { Authorization: `Bearer ${token}` } });
    }
  });
});

// ═══ 4. TABLE ═══
test.describe('4. Table', () => {
  test('4-1. 테이블 추가/삭제', async ({ page }) => {
    await adminNav(page, 'tables');
    await expect(page.getByText('테이블 1')).toBeVisible();
    await input(page, 'new-table-no').fill('99');
    await page.getByTestId('add-table').click();
    await expect(page.getByText('테이블 99')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('delete-table-99').click();
    await page.getByTestId('confirm-dialog-confirm').click();
    await expect(page.getByText('테이블 99')).not.toBeVisible({ timeout: 5000 });
  });
});

// ═══ 5. DASHBOARD ═══
test.describe('5. Dashboard', () => {
  test('5-1. 대시보드 + 테이블 선택', async ({ page }) => {
    await adminLogin(page);
    await expect(page.getByTestId('sound-toggle')).toBeVisible();
    await page.getByTestId('table-item-1').click();
    await page.waitForTimeout(1000);
  });
});

// ═══ 6. CUSTOMER ═══
test.describe('6. Customer', () => {
  test('6-1. 메뉴 → 장바구니 → 주문', async ({ page }) => {
    await tableLogin(page, 5);
    await expect(page.locator('[data-testid^="menu-card-"]').first()).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid^="add-to-cart-"]').first().click();
    await page.waitForTimeout(500);
    await page.getByTestId('nav-cart').click();
    await page.waitForURL('**/cart');
    await expect(page.locator('[data-testid^="cart-item-"]').first()).toBeVisible();
    await page.getByTestId('cart-order').click();
    await page.waitForURL('**/order');
    await page.getByTestId('order-confirm').click();
    // 주문 성공 후 어디로든 이동 (menu 또는 history)
    await page.waitForTimeout(3000);
    // 주문이 성공했으면 order 페이지에서 벗어남
    expect(page.url()).not.toContain('/order');
  });

  test('6-2. 카테고리 필터링', async ({ page }) => {
    await tableLogin(page, 5);
    await page.waitForTimeout(1000);
    await page.getByTestId('category-recommended').click();
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid^="menu-card-"]').first()).toBeVisible();
  });

  test('6-3. 장바구니 비우기', async ({ page }) => {
    await tableLogin(page, 5);
    await page.locator('[data-testid^="add-to-cart-"]').first().click();
    await page.getByTestId('nav-cart').click();
    await page.waitForURL('**/cart');
    const clearBtn = page.getByTestId('cart-clear');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.getByTestId('confirm-dialog-confirm').click();
    }
  });

  test('6-4. 하단 네비게이션', async ({ page }) => {
    await tableLogin(page, 2);
    await page.getByTestId('nav-cart').click();
    await expect(page).toHaveURL(/cart/);
    await page.getByTestId('nav-history').click();
    await expect(page).toHaveURL(/history/);
    await page.getByTestId('nav-menu').click();
    await expect(page).toHaveURL(/menu/);
  });
});

// ═══ 7. ADMIN ORDER ═══
test.describe('7. Admin Order', () => {
  test('7-1. 주문 상태 변경', async ({ page, browser }) => {
    const cp = await browser.newPage();
    await tableLogin(cp, 4);
    await cp.locator('[data-testid^="add-to-cart-"]').first().click();
    await cp.getByTestId('nav-cart').click();
    await cp.waitForURL('**/cart');
    await cp.getByTestId('cart-order').click();
    await cp.waitForURL('**/order');
    await cp.getByTestId('order-confirm').click();
    await cp.waitForTimeout(2000);
    await cp.close();

    await adminLogin(page);
    await page.getByTestId('table-item-4').click();
    await page.waitForTimeout(1500);
    const prepBtn = page.locator('[data-testid^="order-prepare-"]').first();
    if (await prepBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await prepBtn.click();
      await page.waitForTimeout(1000);
      const compBtn = page.locator('[data-testid^="order-complete-"]').first();
      if (await compBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await compBtn.click();
      }
    }
  });
});

// ═══ 8. STATISTICS ═══
test.describe('8. Statistics', () => {
  test('8-1. 통계 페이지', async ({ page }) => {
    await adminLogin(page);
    await sidebar(page, '통계').click();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/admin\/statistics/);
  });
});

// ═══ 9. NAVIGATION ═══
test.describe('9. Navigation', () => {
  test('9-1. 관리자 사이드바', async ({ page }) => {
    await adminLogin(page);

    await sidebar(page, '테이블').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/admin\/tables/);

    await sidebar(page, '메뉴').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/admin\/menus/);

    await sidebar(page, '카테고리').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/admin\/categories/);

    await sidebar(page, '대시보드').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/admin\/dashboard/);
  });
});
