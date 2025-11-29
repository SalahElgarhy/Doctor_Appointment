import Joi from "joi";
import { generalFields } from "./fields.js";

export const registerValidation = Joi.object({
  name: generalFields.name,
  email: generalFields.email,
  phone: generalFields.phone,
  password: generalFields.password,
  confirmPassword: generalFields.confirmPassword,
}).required();

export const loginValidation = Joi.object({
  emailOrPhone: Joi.alternatives()
    .try(
      generalFields.email.optional(),
      generalFields.phone.optional()
    )
    .required()
    .messages({
      'alternatives.match': 'Please enter a valid email or phone number',
      'any.required': 'Email or phone number is required'
    }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
}).required();

export const tokenValidation = Joi.object({
  token: generalFields.token,
}).required();
