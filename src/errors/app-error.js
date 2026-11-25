export class AppError extends Error {
  constructor(statusCode, message, code, detail) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    if (detail !== undefined) this.detail = detail;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;
