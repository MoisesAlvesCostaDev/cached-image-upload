import { Request, Response } from 'express';


export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).end();

};

export const getImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).end();

};