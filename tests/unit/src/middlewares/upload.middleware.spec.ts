import { NextFunction, Request, Response } from 'express';
import { validateImageUpload } from '../../../../src/middlewares/upload.middleware';

jest.mock('multer', () => {
  const original = jest.requireActual('multer'); 

  const mockSingle = jest.fn((req, res, cb) => cb(null)); 

  const mockMulter = () => ({
    single: () => mockSingle
  });

  mockMulter.memoryStorage = () => ({});
  mockMulter.MulterError = original.MulterError; 

  return mockMulter;
});

describe('validateImageUpload', () => {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if no error', () => {
    validateImageUpload(req, res, next);
    expect(next).toHaveBeenCalled();
  });



});
