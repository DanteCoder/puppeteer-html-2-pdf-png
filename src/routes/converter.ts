import express from 'express';
import { convertToPdf, convertToPng, validateHtml, validateSize, validateZoom } from '../controllers/converter';

const router = express.Router();

router.post('/png', validateHtml, validateZoom, convertToPng);
router.post('/pdf', validateHtml, validateZoom, validateSize, convertToPdf);

export default router;
