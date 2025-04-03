import express from 'express';
import request from 'supertest';
import { healthRouter } from '../../../../src/routes/health.routes';

describe('healthRouter', () => {
  const app = express();
  app.use('/health', healthRouter);

  it('should return 200 and status UP', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});
