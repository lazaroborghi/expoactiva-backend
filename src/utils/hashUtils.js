import crypto from 'crypto';

export const generateRandomSalt = () => {
    return crypto.randomBytes(16).toString('hex');
}

export const hashMacAddressWithSalt = (macAddress, salt) => {
    const hash = crypto.createHmac('sha256', salt)
                       .update(macAddress)
                       .digest('hex');
    return {
        salt,
        hash
    };
}
