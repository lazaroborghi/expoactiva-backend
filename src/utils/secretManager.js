import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import dotenv from 'dotenv';

dotenv.config();

const client = new SecretManagerServiceClient();

export async function getSecret(secretName) {
    if (process.env.NODE_ENV !== 'development') {
        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${secretName}/versions/latest`
        });
        return version.payload.data.toString('utf8');
    } else {
        return process.env[secretName];
    }
}
