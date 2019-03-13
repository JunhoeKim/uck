import { default as FormatSpecifier } from './specifiler';
import { isDigit, getDigitLength, isFixType, rawString } from './util';

const subSuffixToValue: { [key: string]: number } = {
    '십': 10,
    '백': 100,
    '천': 1000,
}

const baseSuffixToValue: { [key: string]: number } = {
    '': 1,
    '만': 10000,
    '억': 1e8,
    '조': 1e12,
    '경': 1e16,
    '해': 1e20,
    '자': 1e24,
    '양': 1e28,
}

const digitToKorean: { [key: string]: string } = {
    '1': '일',
    '2': '이',
    '3': '삼',
    '4': '사',
    '5': '오',
    '6': '육',
    '7': '칠',
    '8': '팔',
    '9': '구',
}

const totalSuffixToValue = { ...baseSuffixToValue, ...subSuffixToValue };

class Formatter {

    public locale: string = '';

    constructor(locale: string) {
        this.locale = locale;
    }

    convert(value: number): string {
        return this.format(value);
    }

    format(value: number): string {
        let { align, width, comma, currency, precision, spacing, trim, type } = new FormatSpecifier(this.locale);
        // console.log({ align, width, comma, currency, precision, spacing, trim, type });
        let positive = value >= 0;
        value = Math.abs(value);

        let roundedFormat = this.applyPrecision(value, precision);
        let [digits, decimal] = roundedFormat.split('.');
        decimal = decimal || '';
        let format = '';

        switch (type) {
            case 'b':
                format = this.addSuffix(digits);
                break;
            case 'b+':
                format = this.addSuffix(digits);
                format = this.addSubSuffix(format);
                break;
            case 'k':
                format = this.addSuffix(digits);
                console.log({format});
                format = this.addSubSuffix(format);
                console.log({format});
                format = this.convertToKorean(format);
                console.log({format});
                break;
            default:
                format = this.fixBaseSuffix(digits, decimal, type.substring(1));
                break;
        }

        if (!isFixType(type)) {
            if (spacing) {
                format = this.applySpacing(format);
            }

            if (trim) {
                decimal = this.trimDecimal(decimal);
            }
            format = format + (decimal ? '.' + decimal : '');
        }

        if (comma) {
            format = this.addComma(format);
        }

        if (currency) {
            format = format + '원';
        }

        if (!positive) {
            format = '-' + format;
        }

        if (width && width > format.length) {
            format = this.alignFormat(format, width, align);
        }

        return format;
    }

    /**
     * 기본 type b, b+에서 사용되는 formatting,
     * 일반 숫자에 한글을 붙여준다.
     */
    private addSuffix(digits: string) {
        let result = '';

        // 정수 부분 값이 10 미만이라면 아무것도 안한 결과를 뱉음
        if (digits.length <= 1) {
            return digits;
        }

        const suffixEntries = Object.entries(baseSuffixToValue);

        suffixEntries.forEach(pair => {
            const [suffix, value] = pair;
            const suffixValueLength = Math.log10(value) + 1;

            if (digits.length >= suffixValueLength) {
                // suffix가 '양' 보다 작을 때와 클 때
                const endIndex = digits.length - suffixValueLength;
                const startIndex = Math.max(0, endIndex - 3);
                const chunk = digits.substring(startIndex, endIndex + 1);
                const notZeroIndex = [...chunk].findIndex(c => c !== '0');
                result = (notZeroIndex === -1 ? '' : chunk.substring(notZeroIndex) + suffix) + result;
            }
        });
        return result;
    }

    /**
     * SubSuffix를 기본 format에 더한다.
     * @param format 현재까지 processing 된 format string
     */
    private addSubSuffix(format: string): string {
        const suffixes = ['', '십', '백', '천'];
        let startIndex = 0;
        let endIndex = 0;
        let result = '';
        // 마지막에 빈 문자열을 하나 추가해서 단위가 없는 1의 자리를 처리한다.
        const formatChars = [...format].concat(['']);
        formatChars.forEach((c, i) => {
            if (!isDigit(c) || i === formatChars.length - 1) {
                let chunk = '';
                endIndex = i - 1;
                for (let j = endIndex; j >= startIndex; j--) {
                    chunk = (formatChars[j] !== '0' ? formatChars[j] + suffixes[endIndex - j] : '') + chunk;
                }
                chunk += c;
                startIndex = i + 1;
                result += chunk;
            }
        });
        return result;
    }

    /**
     * 숫자를 제거하여 한글로만 구성되게 바꿔준다.
     * @param format 현재까지 process된 format
     */
    public convertToKorean(format: string): string {
        return format.replace(/1([십백천만억조경해자양])/g, (_, g) => g).replace(/([1-9])/g, (_, g) => digitToKorean[g]);
    }

    /**
     * 사용자가 정한 한글 숫자 단위에 맞춰서 format을 재구성한다.
     * @param format 현재까지 processing 된 format string
     * @param base 기준이 되는 숫자 한글 단위
     */
    private fixBaseSuffix(digits: string, decimal: string, base: string): string {
        const baseDigitLength = getDigitLength(totalSuffixToValue[base]);
        const digitLength = getDigitLength(+digits);
        if (baseDigitLength > digitLength) {
            const trimmedDecimal = this.trimDecimal('0'.repeat(baseDigitLength - digitLength - 1) + digits + decimal);
            return trimmedDecimal ? '0.' + trimmedDecimal + base : 0 + base;
        } else {
            const pointIndex = digitLength - baseDigitLength + 1;
            const trimmedDecimal = this.trimDecimal(digits.substring(pointIndex) + decimal);
            return digits.substring(0, pointIndex) + (trimmedDecimal ? '.' + trimmedDecimal : '') + base;
        }
    }

    /**
     * Precision에 따라 반올림을 하거나 소수 점을 붙여서 string으로 바꿔준다.
     * @param value input number value
     * @param precision precision을 적용할 자릿 수
     */
    private applyPrecision(value: number, precision: number) {
        const digitLength = rawString(value).replace(/(\.|-)/g, '').length;
        if (!precision) {
            precision = digitLength;
        }
        precision = Math.max(0, Math.min(20, precision));
        if (precision > digitLength) {
            const result = rawString(value);
            return result
                + (result.includes('.') ? '' : '.')
                + '0'.repeat(precision - digitLength);
        } else if (precision === digitLength) {
            return rawString(value);
        } else {
            const precisionValue = Math.pow(10, digitLength - precision);
            return rawString(Math.round(value / precisionValue) * precisionValue);
        }
    }

    /**
     * Suffix와 다음 숫자 사이에 빈 칸을 둔다.
     * @param format 현재까지 preocessing 된 format string
     */
    private applySpacing(format: string): string {
        return format.replace(/([십백천만억조경해자양])(\d+)/g, (_, g1, g2) => [g1, g2].join(' '));
    }

    /**
     * 천 단위마다 ,를 붙여준다. 
     * @param format 현재까지 processing된 format string
     */
    private addComma(format: string): string {
        let offset = 0;
        let endIndex = [...format].findIndex(c => c === '.') - 1;
        endIndex = endIndex === -1 ? format.length : endIndex;
        for (let i = format.length; i >= 0; i--) {
            offset = isDigit(format[i]) ? offset + 1 : 0;
            if (offset === 4) {
                format = format.substring(0, i + 1) + ',' + format.substring(i + 1);
                offset = 1;
            }
        }
        return format;
    }

    /**
     * 소수부분 뒤에서부터 영향이 없는 0을 제거해준다.
     * @param decimal 소수 부분 문자열
     */
    private trimDecimal(decimal: string): string {
        const trimmedLength = [...decimal].reverse().findIndex(c => c !== '0');
        if (trimmedLength === -1) {
            return '';
        }
        return decimal.substring(0, decimal.length - trimmedLength);
    }

    /**
     * width, align 값에 따라서 결과를 정렬한다.
     * @param format 현재까지 processing된 format string
     * @param width format string이 차지할 영역의 길이
     * @param align 정렬 방향 (오른쪽, 가운데, 왼쪽)
     */
    private alignFormat(format: string, width: number, align: string): string {
        switch (align) {
            case '>':
                return ' '.repeat(width - format.length) + format;
            case '^':
                const leftMargin = Math.round((width - format.length) / 2);
                const rightMargin = width - format.length - leftMargin;
                return ' '.repeat(leftMargin) + format + ' '.repeat(rightMargin);
            case '<':
                return format + ' '.repeat(width - format.length);
        }
    }
}

export function format(locale: string) {
    const formatter = new Formatter(locale);
    return formatter.format.bind(formatter);
}

export function convert(locale: string, value: number) {
    const formatter = new Formatter(locale);
    return formatter.convert(value);
}
