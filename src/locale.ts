import { default as FormatSpecifier } from './specifiler';

const suffixToValue = {
    '십': 10,
    '백': 100,
    '천': 1000,
    '만': 10000,
    '억': 10e8,
    '조': 10e12,
    '경': 10e16,
    '해': 10e20,
    '자': 10e24,
    '양': 10e28,
}

class Formatter {

    public locale: string = '';

    constructor(locale: string) {
        this.locale = locale;
    }

    format(value: number): string {
        const specifier = new FormatSpecifier(this.locale);
        let { width, comma, precision, spacing, type } = specifier;
        precision = Math.max(0, Math.min(20, precision));
        let roundedDigits = this.round(value, precision);

        let format = '';
        switch (type) {
            case 'b':
            default:
                format = this.basicFormat(roundedDigits);
        }

        return format;
    }

    private basicFormat(roundedValue: string) {
        let result = '';
        let [integer, decimal] = roundedValue.split('.');
        decimal = decimal || '';
        if (integer.length <= 1) {
            return roundedValue;
        }

        result += integer.charAt(integer.length - 1).replace('0', '');
        result += decimal ? '.' + decimal : '';
        const suffixEntries = Object.entries(suffixToValue);
        suffixEntries.forEach((pair, index) => {
            const [suffix, value] = pair;
            const digitCount = Math.log10(value);
            if (integer.length > digitCount) {

                if (index < suffixEntries.length - 1) {
                    const fromIndex = integer.length - Math.log10(suffixEntries[index + 1][1]) 
                    const toIndex = integer.length - Math.log10(pair[1]);
                    let chunk = integer.substring(fromIndex, toIndex);
                    if (![...chunk].every(c => c === '0')) {
                        result = integer.substring(fromIndex, toIndex).replace('0', '') + suffix + result;
                    }
                } else {
                    const toIndex = integer.length - Math.log10(pair[1]);
                    integer.substring(0, toIndex).replace('0', '') + suffix + result;
                }
            }
        });
        return result;
    }

    private round(value: number, precision: number): string {
        const digitCount = Math.floor(Math.log10(value));
        const precisionValue = Math.pow(10, precision);
        if (precision > digitCount) {
            return value.toString() + '.' + '0'.repeat(precision - digitCount);
        } 
        return (Math.round(value / precisionValue) * precisionValue).toString();
    }
}

export default function(locale: string) {
    const formatter = new Formatter(locale);
    return formatter.format.bind(formatter);
}
