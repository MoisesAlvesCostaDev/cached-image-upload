import fs from 'fs/promises';
import path from 'path';

const imageService = require('../../../../src/services/image.service');

jest.mock('fs/promises');

describe('saveImageLocal', () => {
  const buffer = Buffer.from('test-data');
  const filename = 'image.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write file to disk at the correct path', async () => {
    jest.spyOn(fs, 'access').mockRejectedValue(new Error('Not found'));
    jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
    const writeSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

    await imageService.saveImageLocal(buffer, filename);

    expect(fs.access).toHaveBeenCalledWith(expect.any(String));
    expect(writeSpy).toHaveBeenCalledWith(
      expect.stringContaining(path.join('uploads', filename)),
      buffer
    );
  });
});

describe('getImageLocal', () => {
  const buffer = Buffer.from('image-data');
  const filename = 'image.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return buffer if file is read successfully', async () => {
    const readSpy = jest.spyOn(fs, 'readFile').mockResolvedValue(buffer);

    const result = await imageService.getImageLocal(filename);

    expect(readSpy).toHaveBeenCalledWith(
      expect.stringContaining(path.join('uploads', filename))
    );
    expect(result).toEqual({ buffer });
  });

  it('should return null if file is not found', async () => {
    jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File not found'));

    const result = await imageService.getImageLocal(filename);

    expect(result).toBeNull();
  });
});
