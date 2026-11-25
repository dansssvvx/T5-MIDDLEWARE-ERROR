import Joi from 'joi';
import { AppError } from '../errors/app-error.js';

const pesan = {
  'any.required': '{{#label}} wajib diisi',
  'string.base': '{{#label}} harus berupa teks',
  'string.empty': '{{#label}} tidak boleh kosong',
  'string.min': '{{#label}} minimal {#limit} karakter',
  'string.max': '{{#label}} maksimal {#limit} karakter',
  'number.base': '{{#label}} harus berupa angka',
  'number.integer': '{{#label}} harus bilangan bulat',
  'number.min': '{{#label}} minimal {#limit}',
  'number.max': '{{#label}} maksimal {#limit}',
  'any.only': '{{#label}} harus salah satu dari: makanan, minuman, camilan',
  'boolean.base': '{{#label}} harus berupa boolean'
};

export const menuSchema = Joi.object({
  nama: Joi.string().min(3).max(50).required().messages(pesan),
  harga: Joi.number().integer().min(1000).max(100000).required().messages(pesan),
  kategori: Joi.string().valid('makanan', 'minuman', 'camilan').required().messages(pesan),
  tersedia: Joi.boolean().default(true).messages(pesan)
});

export function validate(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const detail = error.details.map((item) => ({
        field: item.path.join('.'),
        pesan: item.message
      }));
      return next(new AppError(422, 'Data menu tidak valid', 'VALIDATION_ERROR', detail));
    }
    req.body = value;
    next();
  };
}

export default validate;
