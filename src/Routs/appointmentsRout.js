import express from 'express';
import { asyncHandler } from '../utils/errorHandler/asyncHandler.js';
import { authMiddleware } from '../utils/errorHandler/authMiddleware.js';
import { validateSchema } from '../validation/validation.middleware.js';
import { createAppointmentValidation } from '../validation/appointmentValidation.js';
import { getAppointmentsByUserId, createAppointment, cancelAppointment } from '../controller/appointmentsController.js';

const router = express.Router();    

// Apply auth middleware to all appointment routes
router.use(authMiddleware);

// Create appointment
router.post('/createApointment', validateSchema(createAppointmentValidation), asyncHandler(createAppointment));

// Get user's appointments
router.get('/my_appointments', asyncHandler(getAppointmentsByUserId));

// Cancel appointment
router.delete('/cancel/:appointment_id', asyncHandler(cancelAppointment));

export default router;
