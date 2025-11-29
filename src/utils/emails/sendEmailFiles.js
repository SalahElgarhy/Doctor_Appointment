import nodemailer from 'nodemailer';

export const sendEmail = async ({to, subject, text, html}) => {
        console.log("Starting email setup...");
        console.log("Email user:", process.env.email_user);
        console.log("Email pass length:", process.env.email_pass?.length);

      
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.email_user,
                pass: process.env.email_pass

            },
            debug: true, // عشان يطلع لوجز مفصلة
            logger: true
           
        });
        

        console.log("Testing SMTP connection...");
        
        await transport.verify();
        console.log("✅ SMTP connection successful!");

        console.log("Sending email...");

        const info = await transport.sendMail({
            from: `"Sarah App" <${process.env.email_user}>`,
            to,
            subject,
            text,
            html: html || `<b>${text}</b>`,
        });

        console.log("Message sent:", info.messageId);

        return info.rejected.length === 0 ? true : false;
        
        

    } 


export const subjects = {
    register: "Activate Account",
    resetPassword : "Reset Password"
}