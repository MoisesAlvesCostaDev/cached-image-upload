import { Router } from 'express';
import { getImageHandler, uploadImage } from '../controllers/image.controller';
import { validateImageUpload } from '../middlewares/upload.middleware';


const router = Router();

router.post('/upload/image', validateImageUpload, uploadImage);
router.get('/static/image/:filename', getImageHandler);

export const imageRouter = router;