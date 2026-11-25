import { AppError } from '../errors/app-error.js';

if (!process.env.API_KEY) {
  console.warn('[API_KEY] process.env.API_KEY tidak diset; memakai kunci default.');
}

export function cekApiKey(req, res, next) {
  const kunci = req.get('x-api-key');
  if (!kunci) {
    return next(new AppError(401, 'API key wajib disertakan', 'API_KEY_MISSING'));
  }
  if (kunci !== (process.env.API_KEY || 'pwl-secret-key-2026')) {
    return next(new AppError(401, 'API key tidak valid', 'API_KEY_INVALID'));
  }
  next();
}

export default cekApiKey;
