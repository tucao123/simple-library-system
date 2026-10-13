const request = require('supertest');
const app = require('../app');

describe('Book API Tests', () => {

  test('GET /books should return book list', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
  });

  test('GET /books/add should return add form', async () => {
    const res = await request(app).get('/books/add');
    expect(res.status).toBe(200);
  });

  test('GET / should redirect to /books', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(302);
  });
});

describe('Book Type Tests', () => {

  test('GET /types should return type management page', async () => {
    const res = await request(app).get('/types');
    expect(res.status).toBe(200);
    expect(res.text).toContain('图书类型管理');
  });

  test('GET /types/api should return JSON array', async () => {
    const res = await request(app).get('/types/api');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('typeName');
  });

  test('POST /types should create a type and redirect with success', async () => {
    const res = await request(app)
      .post('/types')
      .type('form')
      .send({ typeName: '自动化测试类型' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=success');
  });

  test('POST /types should reject duplicate type name', async () => {
    const res = await request(app)
      .post('/types')
      .type('form')
      .send({ typeName: '自动化测试类型' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=error');
  });

  test('POST /types should reject empty type name', async () => {
    const res = await request(app)
      .post('/types')
      .type('form')
      .send({ typeName: '   ' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=error');
  });

  test('POST /types/:id should rename a type', async () => {
    const list = await request(app).get('/types/api');
    const target = list.body.find(t => t.typeName === '自动化测试类型');
    expect(target).toBeDefined();

    const res = await request(app)
      .post(`/types/${target.id}`)
      .type('form')
      .send({ typeName: '自动化测试类型改名' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=success');
  });

  test('POST /types/:id/delete should be blocked when books reference the type', async () => {
    const list = await request(app).get('/types/api');
    const referenced = list.body.find(t => t.typeName === '小说');
    expect(referenced).toBeDefined();

    const res = await request(app).post(`/types/${referenced.id}/delete`);
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=error');

    const after = await request(app).get('/types/api');
    expect(after.body.some(t => t.typeName === '小说')).toBe(true);
  });

  test('POST /types/:id/delete should remove an unused type', async () => {
    const list = await request(app).get('/types/api');
    const target = list.body.find(t => t.typeName === '自动化测试类型改名');
    expect(target).toBeDefined();

    const res = await request(app).post(`/types/${target.id}/delete`);
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('type=success');

    const after = await request(app).get('/types/api');
    expect(after.body.some(t => t.id === target.id)).toBe(false);
  });
});

describe('Statistics Dashboard Tests', () => {

  test('GET /stats should return dashboard', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.text).toContain('借阅统计看板');
  });

  test('GET /stats should inject borrow statistics', async () => {
    const res = await request(app).get('/stats');
    const match = res.text.match(/var borrowStats = (\{.*?\});/);
    expect(match).not.toBeNull();

    const stats = JSON.parse(match[1]);
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('borrowedCount');
    expect(stats).toHaveProperty('availableCount');
    expect(stats.borrowedCount + stats.availableCount).toBe(stats.total);
  });

  test('GET /stats should inject per-type statistics', async () => {
    const res = await request(app).get('/stats');
    const match = res.text.match(/var typeStats = (\[.*?\]);/);
    expect(match).not.toBeNull();

    const typeStats = JSON.parse(match[1]);
    expect(Array.isArray(typeStats)).toBe(true);
    expect(typeStats.length).toBeGreaterThan(0);
    expect(typeStats[0]).toHaveProperty('typeName');
    expect(typeStats[0]).toHaveProperty('borrowedCount');
    expect(typeStats[0]).toHaveProperty('availableCount');
  });

  test('GET /stats should render all three chart containers', async () => {
    const res = await request(app).get('/stats');
    expect(res.text).toContain('id="borrowChart"');
    expect(res.text).toContain('id="typeChart"');
    expect(res.text).toContain('id="compareChart"');
  });
});
