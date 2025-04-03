import { Request, Response } from 'express';
import { healthCheck } from '../../../../src/controllers/health.controller';

describe('healthCheck', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
    };
  });

  it('should return status UP with 200', async () => {
    await healthCheck(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    const jsonResponse = jsonMock.mock.calls[0][0];

    expect(jsonResponse.status).toBe('UP');
    expect(typeof jsonResponse.uptime).toBe('number');
    expect(new Date(jsonResponse.timestamp).toString()).not.toBe('Invalid Date');
  });


});
