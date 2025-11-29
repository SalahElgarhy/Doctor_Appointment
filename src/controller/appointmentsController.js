import db from '../config/database.js';
import { encrypt, decrypt } from '../utils/encrypt/encrypt.js';

export const createAppointment = async (req, res, next) => {
    try {
        let { doctor_id, date, reason } = req.body;
        const user_id = req.user?.id; // Get user ID from token/session
        
        // Encrypt the reason (sensitive medical information)
        const encryptedReason = encrypt({ plaintext: reason });
        
        // 1. Validate required fields
        if (!doctor_id || !date || !reason) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: doctor_id, date, and reason are required"
            });
        }

        // 2. Convert ISO date to MySQL format
        // If date is in ISO format (2025-12-15T10:30:00Z), convert it
        if (date.includes('T')) {
            const dateObj = new Date(date);
            date = dateObj.toISOString().slice(0, 19).replace('T', ' ');
        }

        // 3. Check if doctor exists
        const [doctorCheck] = await db.promise().execute(
            'SELECT id FROM doctors WHERE id = ?',
            [doctor_id]
        );

        if (doctorCheck.length === 0) {
            return next(new Error("Doctor not found"));
        }

        // 4. Create appointment
        const [result] = await db.promise().execute(
            'INSERT INTO appointments (user_id, doctor_id, date, reason, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, doctor_id, date, encryptedReason, 'scheduled']
        );

        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment: {
                id: result.insertId,
                user_id,
                doctor_id,
                date,
                reason,
                status: 'scheduled'
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getAppointmentsByUserId = async (req, res, next) => {
    try {
        const user_id = req.user?.id;

        const [appointments] = await db.promise().execute(
            'SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC',
            [user_id]
        );

        const decryptedAppointments = appointments.map(appointment => ({
            ...appointment,
            reason: decrypt({ ciphertext: appointment.reason })
        }));

        return res.status(200).json({
            success: true,
            appointments: decryptedAppointments
        });

    } catch (error) {
        next(error);
    }
}

export const cancelAppointment = async (req, res, next) => {
    try {
        const { appointment_id } = req.params;
        const user_id = req.user?.id;

        // 1. Check if appointment exists and belongs to user
        const [appointmentCheck] = await db.promise().execute(
            'SELECT * FROM appointments WHERE id = ? AND user_id = ?',
            [appointment_id, user_id]
        );

        if (appointmentCheck.length === 0) {
            return next(new Error("Appointment not found"));
        }

        // 2. Update appointment status to cancelled
        await db.promise().execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['cancelled', appointment_id]
        );

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });

    } catch (error) {
        next(error);
    }
}
   