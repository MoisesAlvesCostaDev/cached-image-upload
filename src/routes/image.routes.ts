import { Router } from 'express';
import { getImageHandler, uploadImage } from '../controllers/image.controller';

const router = Router();

router.post('/upload/image',  uploadImage);
router.get('/static/image/:filename', getImageHandler);

export const imageRouter = router;