import { AppError } from '../errors/app-error.js';

export function notFound(req, res, next) {
  next(new AppError(404, 'Rute tidak ditemukan', 'ROUTE_NOT_FOUND'));
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    const error = { pesan: err.message, kode: err.code };
    if (err.code === 'VALIDATION_ERROR') error.detail = err.detail ?? [];
    return res.status(err.statusCode).json({ error });
  }

  console.error('[SERVER_ERROR]', err);
  return res.status(500).json({
    error: { pesan: 'Terjadi kesalahan pada server', kode: 'INTERNAL_ERROR' }
  });
}
