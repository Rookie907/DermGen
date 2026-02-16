import express from 'express';
import { generateImages, getImagesHandler } from '../controllers/generateController.js';

const router = express.Router();

router.post('/generate', generateImages);
router.get('/images', getImagesHandler);

export default router;
