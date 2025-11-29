import db from '../config/database.js';
import { hashing, compareHash } from "../utils/Hash/hash.js";
import { generateToken, verifyToken } from "../utils/token/token.js";
import { emailEvent } from "../utils/emails/email.event.js";
import { encrypt, decrypt } from "../utils/encrypt/encrypt.js";



export const addDoctor = async (req, res, next) => {
    try {
        const { name, specialty, email, phone, password, description, experience_years } = req.body;
        
        // Encrypt sensitive data (phone only)
        const encryptedPhone = encrypt({ plaintext: phone });
        
        // Get image filename if uploaded
        const image = req.file ? req.file.filename : null;

        // Check if doctor already exists by email or phone
        const [existingDoctor] = await db.promise().execute(
            'SELECT email, phone FROM doctors WHERE email = ? OR phone = ?',
            [email, encryptedPhone]
        );

        if (existingDoctor.length > 0) {
            const existingEmail = existingDoctor.find(doctor => doctor.email === email);
            const existingPhone = existingDoctor.find(doctor => doctor.phone === encryptedPhone);

            if (existingEmail) {
                return next(new Error("Doctor already exists with this email"));
            }
            if (existingPhone) {
                return next(new Error("Doctor already exists with this phone number"));
            }
        }

        // Hash the password
        const hashedPassword = await hashing({ plaintext: password });

        // Insert new doctor into the database (isActive = 0 by default)
        await db.promise().execute(
            'INSERT INTO doctors (name, specialty, email, phone, password, image, description, experience_years, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)',
            [name, specialty, email, encryptedPhone, hashedPassword, image, description, experience_years]
        );

        // Send confirmation email to doctor
        emailEvent.emit("sendEmail", { email, name, userType: 'doctor' });

        res.status(201).json({ 
            success: true,
            message: "Doctor registered successfully. Please check your email to activate your account." 
        });

    } catch (error) {
        next(error);
    }
}

export const activateDoctorAccount = async (req, res, next) => {
    const { token } = req.params;
    
    try {
        // 1. Verify token
        const decoded = verifyToken({ token });
        const { email } = decoded;
        
        // 2. Check if doctor exists
        const [doctorResult] = await db.promise().execute(
            'SELECT * FROM doctors WHERE email = ?',
            [email]
        );
        
        if (doctorResult.length === 0) {
            return next(new Error("Doctor not found"));
        }
        
        // 3. Update doctor status to activated
        await db.promise().execute(
            'UPDATE doctors SET isActive = 1 WHERE email = ?',
            [email]
        );
        
        // 4. Send success response
        return res.status(200).json({
            success: true,
            message: 'Account activated successfully! You can now login.',
        });
        
    } catch (error) {
        console.log("Token verification error:", error.message);
        return next(new Error("Invalid or expired activation token"));
    }
}


export const doctorLogin = async (req , res , next) => {
    const { emailOrPhone, password } = req.body;

    try {
        // Encrypt the input to compare with database (only if it's phone)
        
        // 1. Check if doctor exists (by email or phone)
        const [doctorResult] = await db.promise().execute(
            'SELECT * FROM doctors WHERE email = ? OR phone = ?',
            [emailOrPhone, encrypt({ plaintext: emailOrPhone })]
        );
        
        if (doctorResult.length === 0) {
            return next(new Error("Invalid email/phone or password"));
        }
        const doctor = doctorResult[0];

        // 2. Check if account is activated
        if (!doctor.isActive) {
            return next(new Error("Please activate your account first. Check your email for activation link."));
        }

        // 3. Verify password using compareHash
        const isPasswordValid = await compareHash({ plaintext: password, hash: doctor.password });
        if (!isPasswordValid) {
            return next(new Error("Invalid email/phone or password"));
        }
        
        // 4. Generate JWT token
        const token = generateToken({ payload: { id: doctor.id, email: doctor.email, phone: doctor.phone } , options: { expiresIn: '1h' } });
       return res.status(200).json({
           success: true,
           message: 'Doctor logged in successfully',
           doctor: {
               id: doctor.id,
               name: doctor.name,
               email: doctor.email,
               phone: decrypt({ ciphertext: doctor.phone }),
               specialty: doctor.specialty,
               image: doctor.image
           },
           token
       });
    } catch (error) {
        next(error);
    }
}



export const getOneDoctorById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Check if doctor exists by ID
        const [doctorResult] = await db.promise().execute(
            'SELECT * FROM doctors WHERE id = ?',
            [id]
        );

        if (doctorResult.length === 0) {
            return next(new Error("Doctor not found"));
        }

        const doctor = doctorResult[0];

        // 2. Return doctor data
        return res.status(200).json({
            success: true,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                phone: decrypt({ ciphertext: doctor.phone }),
                specialty: doctor.specialty,
                description: doctor.description,
                experience_years: doctor.experience_years,
                image: doctor.image,
                isActive: doctor.isActive
            }
        });

    } catch (error) {
        next(error);
    }
}


export const getallDoctors = async (req , res , next) => {
    try {
        // Fetch all doctors from the database
        const [doctors] = await db.promise().execute(
            'SELECT id, name, specialty, email, phone, description, experience_years, image, isActive FROM doctors'
        );

        const decryptedDoctors = doctors.map(doctor => ({
            ...doctor,
            phone: decrypt({ ciphertext: doctor.phone })
        }));

        return res.status(200).json({
            success: true,
            doctors: decryptedDoctors
        });
    } catch (error) {
        next(error);
    }
}