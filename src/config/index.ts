import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface IConfig {
  env: 'development' | 'production';
  server: {
    port: number;
    url: string;
  };
  upload: {
    maxFileSizeMB: number;
    allowedFileTypes: string[];
    uploadDir: string;
    allowedFileExtensions: string[];
  };
  cache: {
    defaultTTLInSeconds: number;
  };
  storage: {
    type: 'local' | 's3';
  };
  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    endpoint: string;
  };
}

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config: IConfig = {
  env,
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  },
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp']
  },
  cache: {
    defaultTTLInSeconds: parseInt(process.env.DEFAULT_TTL_IN_SECONDS || '60', 10),
  },
  storage: {
    type: process.env.STORAGE_TYPE === 's3' ? 's3' : 'local',
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
    region: process.env.S3_REGION || 'us-east-1',
    bucketName: process.env.S3_BUCKET_NAME || '',
    endpoint: process.env.S3_ENDPOINT || "",
  },
};

export default config;
