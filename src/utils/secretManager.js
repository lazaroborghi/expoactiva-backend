import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import dotenv from 'dotenv';

dotenv.config();

const client = new SecretManagerServiceClient();

// Obtiene el valor de un secreto de Secret Manager (en producción) o de las variables de entorno (en desarrollo)
export async function getSecret(secretName) {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${secretName}/versions/latest`
        });
        return version.payload.data.toString('utf8');
    } else {
        return process.env[secretName];
    }
}
