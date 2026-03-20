import { TEST_CONFIG } from './fixtures';

const API = 'http://localhost:3000';

async function globalSetup() {
  // 1. 관리자 로그인 → 토큰 획득
  const loginRes = await fetch(`${API}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeCode: TEST_CONFIG.storeCode,
      username: TEST_CONFIG.admin.username,
      password: TEST_CONFIG.admin.password,
    }),
  });
  const { accessToken } = await loginRes.json();
  const auth = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

  // 2. 테이블 1번 확인/생성
  const tablesRes = await fetch(`${API}/tables`, { headers: auth });
  const tables: any[] = await tablesRes.json();
  if (!tables.find((t: any) => t.tableNo === TEST_CONFIG.tableNo)) {
    await fetch(`${API}/tables`, {
      method: 'POST', headers: auth,
      body: JSON.stringify({ tableNo: TEST_CONFIG.tableNo }),
    });
  }

  // 3. storeId 추출 (카테고리 조회로)
  const catsRes = await fetch(`${API}/categories?storeId=1&includeHidden=true`, { headers: auth });
  const cats: any[] = await catsRes.json();

  // 4. "음식" 카테고리가 없으면 생성
  let foodCat = cats.find((c: any) => c.name === '음식');
  if (!foodCat) {
    const res = await fetch(`${API}/categories`, {
      method: 'POST', headers: auth,
      body: JSON.stringify({ name: '음식', sortOrder: 1 }),
    });
    foodCat = await res.json();
  }

  // 5. 메뉴가 없으면 시딩
  const menusRes = await fetch(`${API}/menus?storeId=1`, { headers: auth });
  const menus: any[] = await menusRes.json();
  if (menus.length === 0) {
    const seedMenus = [
      { name: '김치찌개', price: 9000, categoryId: foodCat.id },
      { name: '된장찌개', price: 8000, categoryId: foodCat.id },
      { name: '비빔밥', price: 10000, categoryId: foodCat.id },
    ];
    for (const m of seedMenus) {
      const res = await fetch(`${API}/menus`, {
        method: 'POST', headers: auth,
        body: JSON.stringify(m),
      });
      const created = await res.json();
      // 추천 메뉴로 설정
      await fetch(`${API}/menus/${created.id}/recommended`, {
        method: 'PATCH', headers: auth,
        body: JSON.stringify({ isRecommended: true }),
      });
    }
  }
}

export default globalSetup;
