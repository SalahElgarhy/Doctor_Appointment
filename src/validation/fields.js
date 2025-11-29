import Joi from "joi";

export const generalFields = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required(),

  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
    .required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),

  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
    .required(),

  image: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Image cannot be empty'
    }),

  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'any.required': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 500 characters'
    }),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(60)
    .required()
    .messages({
      'any.required': 'Experience years is required',
      'number.base': 'Experience years must be a number',
      'number.min': 'Experience years must be at least 0',
      'number.max': 'Experience years must not exceed 60'
    }),
};
