import { Request, Response } from 'express';
import { getImageHandler, uploadImage } from '../../../../src/controllers/image.controller';
import * as cacheService from '../../../../src/services/cache.service';
import * as imageService from '../../../../src/services/image.service';

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

describe('uploadImage', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  it('should return 400 if no file is provided', async () => {
    const req = {} as Request;

    await uploadImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No image provided' });
  });

  it('should return 200 with filename and url', async () => {
    const mockBuffer = Buffer.from('test');
    const mockExtension = 'png';
    const req = {
      file: { originalname: 'image.png' },
    } as any;

    jest.spyOn(imageService, 'compressImage').mockResolvedValue({ buffer: mockBuffer, extension: mockExtension });
    jest.spyOn(cacheService, 'setCache').mockResolvedValue(true);
    jest.spyOn(imageService, 'saveImage').mockResolvedValue(undefined);

    await uploadImage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      filename: 'mocked-uuid.png',
      url: '/static/image/mocked-uuid.png',
    });
  });
});

describe('getImageHandler', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;

  it('should return image from cache', async () => {
    const req = { params: { filename: 'test.png' } } as unknown as Request;
    const mockBuffer = Buffer.from('cached image');

    jest.spyOn(cacheService, 'getCache').mockResolvedValue(mockBuffer);

    await getImageHandler(req, res);

    expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockBuffer);
  });

  it('should return 404 if image not found', async () => {
  const req = { params: { filename: 'missing.png' } } as unknown as Request;

    jest.spyOn(cacheService, 'getCache').mockResolvedValue(undefined);
    jest.spyOn(imageService, 'getImage').mockResolvedValue(null);

    await getImageHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Image not found' });
  });
});
