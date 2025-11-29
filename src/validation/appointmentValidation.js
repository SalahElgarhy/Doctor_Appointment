import Joi from "joi";

export const createAppointmentValidation = Joi.object({
  doctor_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'Doctor ID is required',
      'number.base': 'Doctor ID must be a number'
    }),
  
  date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'Appointment date is required',
      'date.base': 'Date must be in ISO format (YYYY-MM-DD)'
    }),
  
  reason: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'any.required': 'Reason is required',
      'string.min': 'Reason must be at least 5 characters',
      'string.max': 'Reason must not exceed 500 characters'
    })
}).required();
