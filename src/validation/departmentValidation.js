import Joi from 'joi';

export const departmentValidation = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    description: Joi.string().optional(),
    image: Joi.any().optional()
}).unknown(true);
