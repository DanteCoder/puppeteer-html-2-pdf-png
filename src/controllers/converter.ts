import { NextFunction, RequestHandler } from 'express';
import { html2png } from '../utils/html2png';

export const convertToPng: RequestHandler = async (req, res, next) => {
  try {
    const html = req.body.html as string[];
    const style = req.body.style as string | undefined;
    await html2png(html, { style });

    res.sendStatus(200);
  } catch (error) {
    handleError(error, next);
  }
};

export const validateBody: RequestHandler = (req, _res, next) => {
  const { html, style } = req.body;

  if (html == null) {
    throw new Error('Missing "html" array.');
  }

  if (!Array.isArray(html)) {
    throw new Error('Invalid type for "html". Must be an array of html strings.');
  }

  html.forEach(str => {
    if (typeof str !== 'string') {
      throw new Error('Invalid element type on "html" array. Elements must be strings.');
    }
  });

  if (style != null && typeof style !== 'string') {
    throw new Error('"style" must be a string.');
  }

  next();
};

const handleError = (error: any, next: NextFunction) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  next(error);
};
