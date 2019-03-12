import { default as FormatSpecifier } from './specifiler';
import { default as parse } from './parser';

const subSuffixToValue: { [key: string]: number } = {
    '십': 10,
    '백': 100,
    '천': 1000,
}

const baseSuffixToValue: { [key: string]: number } = {
    '': 1,
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
        let { align, width, comma, currency, precision, spacing, type } = new FormatSpecifier(this.locale);
        // console.log({ align, width, comma, currency, precision, spacing, type });
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
            default:
                format = this.fixBaseSuffix(digits, type.substring(1));
                break;
        }

        if (spacing) {
            format = this.applySpacing(format);
        }

        format = format + (decimal ? '.' + decimal : '');

        if (currency) {
            format = format + '원';
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

        suffixEntries.forEach((pair, index) => {
            const [suffix, value] = pair;
            const suffixValueLength = Math.log10(value) + 1;

            if (digits.length >= suffixValueLength) {
                // suffix가 '양' 보다 작을 때와 클 때
                const startIndex = index >= suffixEntries.length - 1 
                    ? 0 : digits.length - Math.log10(suffixEntries[index + 1][1]);
                const endIndex = digits.length - Math.log10(pair[1]);
                const chunk = digits.substring(startIndex, endIndex);
                const notZeroIndex = [...chunk].findIndex(c => c !== '0');
                result = (notZeroIndex === -1 ? '' : chunk.substring(notZeroIndex)) + suffix + result;
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
        const digitLength = value.toString().replace('.', '').length;
        if (precision > digitLength) {
            return value.toString() 
                + (value.toString().includes('.') ? '' : '.')
                + '0'.repeat(precision - digitLength);
        } else {
            const precisionValue = Math.pow(10, precision);
            return (Math.round(value / precisionValue) * precisionValue).toString();
        }
    }

    /**
     * Suffix와 다음 숫자 사이에 빈 칸을 둔다.
     * @param format: 현재까지 preocessing 된 format string
     */
    private applySpacing(format: string): string {
        return format.replace(/([십백천만억조경해자양])(\d+)/g, (_, g1, g2) => [g1, g2].join(' '));
    }

    /**
     * SubSuffix를 기본 format에 더한다.
     * @param format: 현재까지 processing 된 format string
     */
    private addSubSuffix(format: string): string {
        const suffixes = ['', '십', '백', '천'];
        let startIndex = 0;
        let endIndex = 0;
        let result = '';
        // 마지막에 빈 문자열을 하나 추가해서 단위가 없는 1의 자리를 처리한다.
        const formatChars = [...format].concat(['']);
        formatChars.forEach((c, i) => {
            if (isNaN(parseInt(c)) || i === formatChars.length - 1) {
                let chunk = '';
                endIndex = i - 1;
                for (let j = endIndex; j >= startIndex; j--) {
                    chunk = (formatChars[j] !== '0' ? formatChars[j] + suffixes[endIndex - j] : '') + c + chunk;
                }
                startIndex = i + 1;
                result += chunk;
            }
        });
        return result;
    }

    /**
     * 사용자가 정한 한글 숫자 단위에 맞춰서 format을 재구성한다.
     * @param format: 현재까지 processing 된 format string
     * @param base: 기준이 되는 숫자 한글 단위
     */
    private fixBaseSuffix(format: string, base: string): string {
        const baseValue = {...baseSuffixToValue, ...subSuffixToValue}[base];
        return (parseFloat(format) / baseValue).toString() + base;
    } 
}

export default function (locale: string) {
    const formatter = new Formatter(locale);
    return formatter.format.bind(formatter);
}
