import moment from 'moment'

export function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
        .random() * (maxm - minm + 1)) + minm;
}

export function localZoneHour(date) {
    date.setTime(date.getTime() - (180 * 60 * 1000));
}

export function isVerificationCodeValid(expirationCode) {
    const now = moment().subtract(3, 'hours');
    return now.isBefore(expirationCode);
}

export function capitalize(word) {
    if (word && typeof word === 'string') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return '';
}