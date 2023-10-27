import { OAuth2Client } from 'google-auth-library';
import { getSecret } from '../utils/secretManager.js';

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

async function getAccessToken() {
    const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = await getSecrets();

    const oAuth2Client = new OAuth2Client(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);

    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    return accessToken.token;
}

export default getAccessToken;