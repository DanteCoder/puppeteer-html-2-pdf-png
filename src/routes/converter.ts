import express from 'express';
import { convertToPng, validateBody } from '../controllers/converter';

const router = express.Router();

router.post('/png', validateBody, convertToPng);

export default router;
