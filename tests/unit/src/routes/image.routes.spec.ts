import express from 'express';
import request from 'supertest';
import { imageRouter } from '../../../../src/routes/image.routes';

jest.mock('../../../../src/controllers/image.controller', () => ({
  uploadImage: (req: any, res: any) => res.status(200).json({ message: 'upload handler' }),
  getImageHandler: (req: any, res: any) => res.status(200).send('image content'),
}));

jest.mock('../../../../src/middlewares/upload.middleware', () => ({
  validateImageUpload: (req: any, res: any, next: any) => next(),
}));

describe('imageRouter', () => {
  const app = express();
  app.use(express.json()); 
  app.use(imageRouter);

  it('should call uploadImage on POST /upload/image', async () => {
    const res = await request(app).post('/upload/image');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'upload handler' });
  });

  it('should call getImageHandler on GET /static/image/:filename', async () => {
    const res = await request(app).get('/static/image/test.png');
    expect(res.status).toBe(200);
    expect(res.text).toBe('image content');
  });
});
