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
