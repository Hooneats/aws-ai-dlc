import { test as base, type Page } from '@playwright/test';

// 테스트 환경 설정 - 실제 환경에 맞게 수정
export const TEST_CONFIG = {
  storeCode: 'store01',
  admin: { username: 'admin', password: 'admin1234' },
  tableNo: 1,
};

/** 관리자 로그인 후 토큰을 localStorage에 저장 */
async function adminLogin(page: Page) {
  await page.goto('/admin/login');
  await page.getByTestId('admin-login-store-code').locator('input').fill(TEST_CONFIG.storeCode);
  await page.getByTestId('admin-login-username').locator('input').fill(TEST_CONFIG.admin.username);
  await page.getByTestId('admin-login-password').locator('input').fill(TEST_CONFIG.admin.password);
  await page.getByTestId('admin-login-submit').click();
  await page.waitForURL('**/admin/dashboard');
}

/** 테이블 태블릿 로그인 */
async function tableLogin(page: Page, tableNo = TEST_CONFIG.tableNo) {
  await page.goto('/table/setup');
  await page.getByTestId('table-setup-store-code').locator('input').fill(TEST_CONFIG.storeCode);
  await page.getByTestId('table-setup-table-no').locator('input').fill(String(tableNo));
  await page.getByTestId('table-setup-submit').click();
  await page.waitForURL(`**/table/${tableNo}/menu`);
}

// 관리자 인증 상태를 공유하는 fixture
export const test = base.extend<{ adminPage: Page; customerPage: Page }>({
  adminPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await adminLogin(page);
    await use(page);
    await ctx.close();
  },
  customerPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await tableLogin(page);
    await use(page);
    await ctx.close();
  },
});

export { adminLogin, tableLogin };
export { expect } from '@playwright/test';
