import Joi from "joi";
import { registerValidation, loginValidation, tokenValidation } from "./userValidation.js";

// Main validation middleware function
export const validateSchema = (schema) => {
    return (req, res, next) => {
        // Clean up body keys by removing whitespace
        const cleanedBody = {};
        for (let key in req.body) {
            const cleanKey = key.trim();
            cleanedBody[cleanKey] = req.body[key];
        }
        
        // Combine all request data (body, params, query)
        const data = { ...cleanedBody, ...req.params, ...req.query };
        
        // Validate using Joi schema
        const result = schema.validate(data, { abortEarly: false });

        if (result.error) {
            // Extract all error messages
            const errorMessages = result.error.details.map(err => err.message);
            
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errorMessages
            });
        }

        // If validation passes, continue to next middleware
        return next();
    };
};


// Export specific validation middlewares (using schemas from userValidation.js)
export const validateRegister = validateSchema(registerValidation);
export const validateLogin = validateSchema(loginValidation);
export const validateActivateAccount = validateSchema(tokenValidation);

// General middleware functions
export const sanitizeInput = (req, res, next) => {
    // Trim whitespace from all string inputs
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
};

export const validateContentType = (req, res, next) => {
    // Check if content-type is application/json for POST requests
    if (req.method === 'POST' && !req.is('application/json')) {
        return res.status(400).json({
            success: false,
            message: "Content-Type must be application/json"
        });
    }
    next();
};
