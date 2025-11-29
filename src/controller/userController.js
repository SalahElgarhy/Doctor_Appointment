import db from "../config/database.js";
import { hashing } from "../utils/Hash/hash.js";
import { generateToken, verifyToken } from "../utils/token/token.js";
import { emailEvent } from "../utils/emails/email.event.js";
import { encrypt, decrypt } from "../utils/encrypt/encrypt.js";

export const registerUser = async (req, res, next) => {
    
    const { name, email, password, phone } = req.body;
    
    // Encrypt sensitive data
    const encryptedPhone = encrypt({ plaintext: phone });
    
    // 1. Check if user already exists (email or phone)
    const [existingUser] = await db.promise().execute(
        'SELECT email, phone FROM users WHERE email = ? OR phone = ?',
        [email, encryptedPhone]
    );

    if (existingUser.length > 0) {
        const existingEmail = existingUser.find(user => user.email === email);
        const existingPhone = existingUser.find(user => user.phone === encryptedPhone);
        
        if (existingEmail) {
            return next(new Error("User already exists with this email"));
        }
        if (existingPhone) {
            return next(new Error("User already exists with this phone number"));
        }
    }

    // 2. Hash the password 
    const hashedPassword = await hashing({ plaintext: password });

    // 3. Create new user in DB (not activated by default)
    await db.promise().execute(
        'INSERT INTO users (name, email, password, phone, isActive) VALUES (?, ?, ?, ?, 0)',
        [name, email, hashedPassword, encryptedPhone]
    );

    // 4. Send confirmation email
    emailEvent.emit("sendEmail", { email, name });

    // 5. Send success response 
    return res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to activate your account.',
    });

}

export const loginUser = async (req, res, next) => {
    const { emailOrPhone, password } = req.body;

    // Encrypt the input to compare with database (only if it's phone)
    // Try to find by email first, then by encrypted phone
    
    // 1. Check if user exists (by email or phone)
    const [userResult] = await db.promise().execute(
        'SELECT * FROM users WHERE email = ? OR phone = ?',
        [emailOrPhone, encrypt({ plaintext: emailOrPhone })]
    );
    
    if (userResult.length === 0) {
        return next(new Error("Invalid email/phone or password"));
    }
    const user = userResult[0];

    // 2. Check if account is activated
    if (!user.isActive) {
        return next(new Error("Please activate your account first. Check your email for activation link."));
    }

    // 3. Verify password
    const isPasswordValid = await hashing({ plaintext: password, hash: user.password });
    if (!isPasswordValid) {
        return next(new Error("Invalid email/phone or password"));
    }
    
    // 4. Generate JWT token
    const token = generateToken({ payload: { id: user.id, email: user.email, phone: user.phone, role: user.role } , options: { expiresIn: '1h' } });
   return res.status(200).json({
       success: true,
       message: 'User logged in successfully',
       user: {
           id: user.id,
           name: user.name,
           email: user.email,
           phone: decrypt({ ciphertext: user.phone })
       },
       token
   });
}

export const activateAccount = async (req, res, next) => {
    const { token } = req.params;
    
    console.log("Received token:", token);
    
    try {
        // 1. Verify token
        const decoded = verifyToken({ token });
        console.log("Decoded token:", decoded);
        
        const { email } = decoded;
        
        // 2. Check if user exists
        const [userResult] = await db.promise().execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (userResult.length === 0) {
            return next(new Error("User not found"));
        }
        
        // 3. Update user status to activated (add isActive column if needed)
        await db.promise().execute(
            'UPDATE users SET isActive = 1 WHERE email = ?',
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


export const getOneUserById = async (req, res, next) => {
    const { id } = req.params; 
    try {
        const [userResult] = await db.promise().execute(
            'SELECT id, name, email, phone FROM users WHERE id = ?',
            [id]
        );
        if (userResult.length === 0) {
            return next(new Error("User not found"));
        }
        const user = userResult[0];
        return res.status(200).json({
            success: true,
            user: {
                ...user,
                phone: decrypt({ ciphertext: user.phone })
            }
        });
    } catch (error) {
        next(error);
    }
}

export const getallUsers = async (req , res , next) => {
    try {
        const [users] = await db.promise().execute(
            'SELECT id, name, email, phone FROM users'
        );
        const decryptedUsers = users.map(user => ({
            ...user,
            phone: decrypt({ ciphertext: user.phone })
        }));
        return res.status(200).json({
            success: true,
            users: decryptedUsers
        }); 
    } catch (error) {
        next(error);
    }
}