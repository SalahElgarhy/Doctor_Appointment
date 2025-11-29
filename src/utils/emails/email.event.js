import { EventEmitter } from "events";
import { sendEmail } from "./sendEmailFiles.js";
import { subjects } from "./sendEmailFiles.js";
import { generateToken } from "../token/token.js";
import { signup } from "./generateHTML.js";



export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async (user) => {
     // generate token for email verification
        const token = generateToken({ 
            payload: { email: user.email }, 
            options: { expiresIn: '24h' } 
        });
        console.log("Generated token for email:", user.email);
        
        // Determine if it's a doctor or user based on the userType property
        const userType = user.userType || 'user'; // default to 'user'
        const link = `http://localhost:3000/${userType}/activate_account/${token}`;

        // sendEmail
        const emailSent = await sendEmail({ 
                to: user.email, 

                subject: subjects.register,

                 html: signup(link, user.name) });

})