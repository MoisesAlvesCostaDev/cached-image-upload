import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { getCache, setCache } from '../services/cache.service';
import { compressImage, getImage, saveImage } from '../services/image.service';



export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const { buffer, extension } = await compressImage(req.file);
    
    const filename = `${uuidv4()}.${extension}`;
    
    await setCache(filename, buffer, config.cache.defaultTTLInSeconds);
    
    saveImage(buffer, filename)
      .catch(err => console.error('Erro ao salvar imagem:', err));

    res.status(200).json({ 
      filename,
      url: `/static/image/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getImageHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    
    const cachedImage = await getCache(filename);
    if (cachedImage) {
      res.set('Content-Type', `image/${filename.split('.').pop()}`);
      res.set('Cache-Control', 'public, max-age=60');
      res.status(200).send(cachedImage);
      return;
    }
    
    const image = await getImage(filename);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    
    await setCache(filename, image.buffer, config.cache.defaultTTLInSeconds);
    res.set('Content-Type', `image/${filename.split('.').pop()}`);
    res.set('Cache-Control', 'public, max-age=60');
    res.status(200).send(image.buffer);
    
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};