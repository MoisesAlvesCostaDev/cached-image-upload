
describe('Config', () => {
  beforeEach(() => {
    process.env.PORT = '4000';
    process.env.SERVER_URL = 'http://localhost:4000';
    process.env.MAX_FILE_SIZE_MB = '10';
    process.env.ALLOWED_FILE_TYPES = 'image/jpeg,image/png';
    process.env.UPLOAD_DIR = '/tmp/uploads';
    process.env.DEFAULT_TTL_IN_SECONDS = '120';
    process.env.STORAGE_TYPE = 'local';
    process.env.S3_ACCESS_KEY = 'test-access-key';
    process.env.S3_SECRET_KEY = 'test-secret';
    process.env.S3_REGION = 'us-west-2';
    process.env.S3_BUCKET_NAME = 'test-bucket';
    process.env.S3_ENDPOINT = 'http://localhost:9000';
  });

  it('shoud load config from environment variables', () => {
    jest.resetModules();
    const config = require('../../../../src/config').default;

    expect(config.env).toBe('development');
    expect(config.server.port).toBe(4000);
    expect(config.server.url).toBe('http://localhost:4000');
    expect(config.upload.maxFileSizeMB).toBe(10);
    expect(config.upload.allowedFileTypes).toEqual(['image/jpeg', 'image/png']);
    expect(config.upload.uploadDir).toBe('/tmp/uploads');
    expect(config.cache.defaultTTLInSeconds).toBe(120);
    expect(config.storage.type).toBe('local');
    expect(config.s3.accessKeyId).toBe('test-access-key');
    expect(config.s3.region).toBe('us-west-2');
  });
});
