import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import config from '../config';

const BYTES_IN_ONE_MEGABYTE = 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileSizeMB * BYTES_IN_ONE_MEGABYTE }, 
  fileFilter: (req, file, cb) => {
    const allowedMimes = config.upload.allowedFileTypes;
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only ${allowedMimes} are allowed.`));
    }
  },
}).single('image');

export const validateImageUpload = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: `File size exceeds ${config.upload.maxFileSizeMB}MB limit` });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};