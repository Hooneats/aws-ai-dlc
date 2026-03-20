/**
 * US-C01: 테이블 태블릿 자동 로그인
 * US-A01: 관리자 로그인
 */
import { test, expect, TEST_CONFIG } from './fixtures';

test.describe('US-A01: 관리자 로그인', () => {
  test('매장코드+사용자명+비밀번호로 로그인 → 대시보드 이동', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByText('관리자 로그인')).toBeVisible();

    await page.getByTestId('admin-login-store-code').locator('input').fill(TEST_CONFIG.storeCode);
    await page.getByTestId('admin-login-username').locator('input').fill(TEST_CONFIG.admin.username);
    await page.getByTestId('admin-login-password').locator('input').fill(TEST_CONFIG.admin.password);
    await page.getByTestId('admin-login-submit').click();

    await page.waitForURL('**/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('잘못된 비밀번호 → 에러 메시지 표시', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByTestId('admin-login-store-code').locator('input').fill(TEST_CONFIG.storeCode);
    await page.getByTestId('admin-login-username').locator('input').fill(TEST_CONFIG.admin.username);
    await page.getByTestId('admin-login-password').locator('input').fill('wrong-password');
    await page.getByTestId('admin-login-submit').click();

    await expect(page.getByText('로그인에 실패했습니다')).toBeVisible();
  });
});

test.describe('US-C01: 테이블 태블릿 자동 로그인', () => {
  test('매장코드+테이블번호 입력 → 메뉴 화면 이동', async ({ page }) => {
    await page.goto('/table/setup');
    await expect(page.getByText('테이블 설정')).toBeVisible();

    await page.getByTestId('table-setup-store-code').locator('input').fill(TEST_CONFIG.storeCode);
    await page.getByTestId('table-setup-table-no').locator('input').fill(String(TEST_CONFIG.tableNo));
    await page.getByTestId('table-setup-submit').click();

    await page.waitForURL(`**/table/${TEST_CONFIG.tableNo}/menu`);
    await expect(page).toHaveURL(new RegExp(`/table/${TEST_CONFIG.tableNo}/menu`));
  });

  test('잘못된 매장코드 → 에러 메시지', async ({ page }) => {
    await page.goto('/table/setup');
    await page.getByTestId('table-setup-store-code').locator('input').fill('WRONG');
    await page.getByTestId('table-setup-table-no').locator('input').fill('999');
    await page.getByTestId('table-setup-submit').click();

    await expect(page.getByText(/로그인에 실패했습니다/)).toBeVisible();
  });
});
