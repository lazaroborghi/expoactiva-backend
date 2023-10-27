import { createTransporter } from '../config/emailConfig.js';
import { getSecret } from './secretManager.js';

export const sendGenericEmail = async (to, subject, text) => {
    let mailOptions = {
        from: await getSecret('EMAIL_USER'),
        to: to,
        subject: subject,
        text: text
    };
    try {
        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};