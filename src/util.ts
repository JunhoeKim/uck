export function isDigit(c: string) {
    return !isNaN(parseInt(c));
}

export function getDigitLength(value: number) {
    if (value === 0) {
        return 1;
    }
    return Math.floor(Math.log10(value)) + 1;
}

export function isFixType(type: string) {
    return type[0] === 'f';
}

export function rawString(value: number) {
    return value.toLocaleString('fullwide', { useGrouping: false });
}
