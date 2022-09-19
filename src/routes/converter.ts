import express from 'express';
import { convertToPdf, convertToPng, validateHtml, validateSize } from '../controllers/converter';

const router = express.Router();

router.post('/png', validateHtml, convertToPng);
router.post('/pdf', validateHtml, validateSize, convertToPdf);

export default router;
