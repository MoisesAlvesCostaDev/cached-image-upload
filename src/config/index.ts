import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  env: 'development' | 'production';
  server: {
    port: number;
    url: string;
  };
  upload: {
    maxFileSizeMB: number;
    allowedFileTypes: string[];
    uploadDir: string;
  };
}

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config: Config = {
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
  },
};

export default config;