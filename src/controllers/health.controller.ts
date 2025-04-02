import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const status = {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date(),
    };

    res.status(200).json(status);
  } catch (error) {
    const status = {
      status: 'DOWN',
      uptime: process.uptime(),
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    res.status(503).json(status);
  }
};