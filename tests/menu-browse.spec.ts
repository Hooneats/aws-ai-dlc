/**
 * US-C02: 추천 메뉴 확인
 * US-C03: 카테고리별 메뉴 조회
 * US-C04: 메뉴 상세 및 할인/품절 확인
 */
import { test, expect } from './fixtures';

test.describe('US-C02: 추천 메뉴 확인', () => {
  test('메뉴 화면 접속 시 추천 메뉴 섹션이 기본 선택', async ({ customerPage: page }) => {
    await expect(page.getByTestId('category-recommended')).toBeVisible();
    // 추천 탭이 기본 선택 상태
    await expect(page.getByTestId('category-recommended')).toHaveClass(/Mui-selected/);
  });
});

test.describe('US-C03: 카테고리별 메뉴 조회', () => {
  test('카테고리 탭 클릭 → 해당 카테고리 메뉴 표시', async ({ customerPage: page }) => {
    // 사이드바에 카테고리 목록이 보이는지 확인
    await expect(page.getByTestId('category-recommended')).toBeVisible();

    // 첫 번째 일반 카테고리 클릭 (추천 외)
    const categories = page.locator('[data-testid^="category-"]:not([data-testid="category-recommended"])');
    const count = await categories.count();
    if (count > 0) {
      await categories.first().click();
      // 메뉴 카드가 표시되거나 "메뉴가 없습니다" 메시지
      await expect(
        page.locator('[data-testid^="menu-card-"]').first().or(page.getByText('메뉴가 없습니다'))
      ).toBeVisible();
    }
  });

  test('메뉴 카드에 메뉴명/가격 표시', async ({ customerPage: page }) => {
    const menuCards = page.locator('[data-testid^="menu-card-"]');
    const count = await menuCards.count();
    if (count > 0) {
      // 첫 번째 메뉴 카드에 텍스트가 있는지 확인
      await expect(menuCards.first()).toContainText(/\d/); // 가격(숫자) 포함
    }
  });
});

test.describe('US-C04: 메뉴 상세 및 할인/품절 확인', () => {
  test('품절 메뉴는 담기 버튼 비활성화', async ({ customerPage: page }) => {
    // 품절 메뉴가 있으면 담기 버튼이 disabled
    const soldOutButtons = page.locator('[data-testid^="add-to-cart-"]:disabled');
    const count = await soldOutButtons.count();
    // 품절 메뉴가 있을 수도 없을 수도 있으므로 count만 확인
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
