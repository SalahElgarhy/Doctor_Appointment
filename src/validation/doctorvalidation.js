import Joi from "joi";
import { generalFields } from "./fields.js";

export const addDoctorValidation = Joi.object({
  name: generalFields.name,
  email: generalFields.email,
  phone: generalFields.phone,
  password: generalFields.password,
  confirmPassword: generalFields.confirmPassword,
  specialty: Joi.string().min(3).max(100).required().messages({
    'any.required': 'Specialty is required',
    'string.min': 'Specialty must be at least 3 characters',
    'string.max': 'Specialty must not exceed 100 characters'
  }),
  description: generalFields.description,
  experience_years: generalFields.experience_years
}).unknown(true).required(); // Allow unknown fields like image from multer
