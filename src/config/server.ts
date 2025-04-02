import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { healthRouter } from '../routes/health.routes';
import config from './index';

export const createServer = (): Express => {
  const app = express();
  

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: `${config.upload.maxFileSizeMB}mb` }));
  

  if (config.env === 'development') {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }
  

  app.use('/health', healthRouter); 
  
  

  
  return app;
};