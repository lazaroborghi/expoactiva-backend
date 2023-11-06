export function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
        .random() * (maxm - minm + 1)) + minm;
}

export function localZoneHour(date) {
    date.setTime(date.getTime() - (180 * 60 * 1000));
}


