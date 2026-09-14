const request = require('supertest');
const app = require('../server');

describe('GET /api/health', () => {
  it('يرجّع status 200 و status: ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/courses', () => {
  it('يرجّع 200 و array فيه شهادات', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('كل عنصر لازم يحتوي name وvendor', async () => {
    const res = await request(app).get('/api/courses');
    res.body.forEach((course) => {
      expect(course).toHaveProperty('name');
      expect(course).toHaveProperty('vendor');
    });
  });
});

describe('GET /unknown-route', () => {
  it('يرجّع 404 لأي مسار غير معروف', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  });
});
