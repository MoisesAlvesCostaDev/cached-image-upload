import NodeCache from 'node-cache';

jest.mock('node-cache');

const mockSet = jest.fn();
const mockGet = jest.fn();
const mockDel = jest.fn();

(NodeCache as unknown as jest.Mock).mockImplementation(() => ({
  set: mockSet,
  get: mockGet,
  del: mockDel,
}));

const cacheService = require('../../../../src/services/cache.service');

describe('cache.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set value in cache', async () => {
    mockSet.mockReturnValue(true);
    const result = await cacheService.setCache('key', Buffer.from('data'), 60);
    expect(mockSet).toHaveBeenCalledWith('key', Buffer.from('data'), 60);
    expect(result).toBe(true);
  });

  it('should get value from cache', async () => {
    const buffer = Buffer.from('data');
    mockGet.mockReturnValue(buffer);
    const result = await cacheService.getCache('key');
    expect(mockGet).toHaveBeenCalledWith('key');
    expect(result).toBe(buffer);
  });

  it('should delete value from cache', async () => {
    mockDel.mockReturnValue(1);
    const result = await cacheService.delCache('key');
    expect(mockDel).toHaveBeenCalledWith('key');
    expect(result).toBe(1);
  });
});
