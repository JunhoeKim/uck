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
        let { width, comma, precision, spacing, type } = new FormatSpecifier(this.locale);

        let roundedDigits = this.applyPrecision(value, precision);
        let format = '';

        switch (type) {
            default:
                format = this.basicFormat(roundedDigits);
                format = this.trimBelow10000(format);
        }
        return format;
    }

    /**
     * 기본 type b, b+에서 사용되는 formatting,
     * 일반 숫자에 한글을 붙여준다.
     */
    private basicFormat(roundedValue: string) {
        let result = '';

        // 정수 부분, 소수 부분을 나눔
        let [integer, decimal] = roundedValue.split('.');
        decimal = decimal || '';

        // 정수 부분 값이 10 미만이라면 아무것도 안한 결과를 뱉음
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

    /**
     * Precision에 따라 반올림을 하거나 소수 점을 붙여서 string으로 바꿔준다.
     * @param value input number value
     * @param precision precision을 적용할 자릿 수
     */
    private applyPrecision(value: number, precision: number) {
        precision = Math.max(0, Math.min(20, precision));
        const digitCount = value.toString().length;
        if (precision > digitCount) {
            return value.toString() + '.' + '0'.repeat(precision - digitCount);
        } else {
            const precisionValue = Math.pow(10, precision);
            return (Math.round(value / precisionValue) * precisionValue).toString();
        }
    }

    /**
     * Format string의 만 자리 이하의 한글(십, 백, 천) 을 제거한다.
     * @param format: 현재 까지 processing 된 format string
     */
    private trimBelow10000(format: string): string {
        const targetIndex = format.indexOf('만');

        if (targetIndex === -1) {
            return format;
        } else {
            let belowFormat = format.substring(targetIndex + 1);
            belowFormat = belowFormat.replace(/[십백천]/g, '');
            return format.substring(0, targetIndex + 1) + belowFormat;
        }
    }
}

export default function (locale: string) {
    const formatter = new Formatter(locale);
    return formatter.format.bind(formatter);
}
