import createTransporter from '../config/emailConfig.js';
import { getSecret } from './secretManager.js';

export const sendGenericEmail = async (to, subject, html) => {
    let mailOptions = {
        from: `"Expoactiva Nacional" <${await getSecret('EMAIL_USER')}>`,
        to: to,
        subject: subject,
        html: html
    };
    try {
        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};