import express from 'express';
import request from 'supertest';
import { createServer } from '../../../../src/config/server';

jest.mock('../../../../src/routes/health.routes', () => ({
  healthRouter: express.Router().get('/', (req, res) => {
    res.status(200).json({ status: 'UP' });
  }),
}));

jest.mock('../../../../src/routes/image.routes', () => ({
  imageRouter: express.Router(),
}));

describe('createServer', () => {
  it('should create an express app and respond 200', async () => {
    const app = createServer();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'UP' });
  });
});
