import nodemailer from 'nodemailer';
import {getSecret} from '../utils/secretManager.js';
import getAccessToken from './emailTokenRefresher.js';

async function getSecrets() {

    const [EMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN,] = await Promise.all([
        getSecret('EMAIL_USER'),
        getSecret('GMAIL_CLIENT_ID'),
        getSecret('GMAIL_CLIENT_SECRET'),
        getSecret('GMAIL_REFRESH_TOKEN')
    ]);

    const secrets = {
        EMAIL_USER,
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REFRESH_TOKEN
    };

    return secrets;

}

const createTransporter = async () => {
    try {
        const accessToken = await getAccessToken();
        const {EMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN} = await getSecrets();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_USER,
                clientId: GMAIL_CLIENT_ID,
                clientSecret: GMAIL_CLIENT_SECRET,
                refreshToken: GMAIL_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        return transporter;
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw error;
    }
};

export default createTransporter;
