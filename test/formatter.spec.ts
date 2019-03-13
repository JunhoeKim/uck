import * as uck from '../src/index';

function validateFormat(value: number, format: string, expectedResult: string) {
    it('The result should be equal to expected results', () => {
        const result = uck.format(format)(value);
        expect(result).toBe(expectedResult);
    });
}

function validateConvert(value: number, format: string, expectedResult: string) {
    it('The result should be equal to expected results', () => {
        const result = uck.convert(format, value);
        expect(result).toBe(expectedResult);
    });
}

describe('A suite to check wheter the formatter works valid or not', () => {

    validateFormat(12345678, '', '1234만5678');
    validateConvert(12345678, '', '1234만5678');

    validateFormat(123456780000, '', '1234억5678만');
    validateFormat(-123456780000, '', '-1234억5678만');
    validateFormat(-1, '', '-1');
    validateFormat(100000001, '', '1억1');
    validateFormat(12345678900000000000000, '', '123해4567경8900조');
    validateFormat(12345678, '.2', '1200만');
    validateFormat(12345678, '$.3', '1230만원');
    validateFormat(12345678, '.6s', '1234만 5700');
    validateFormat(12, '.4s', '12.00');
    validateFormat(12, '.4sb+', '1십 2.00');
    validateFormat(1234567890, '.6sb+', '1십 2억 3천 4백 5십 7만');
    validateFormat(1234567890, '.6sf천', '1234570천');
    validateFormat(1230000, '~f천', '1230천');
    validateFormat(1, '~f만', '0.0001만');
    validateFormat(1, 'f만', '0.0001만');
    validateFormat(-0.001, 'f백', '-0.00001백');
    validateFormat(12345678900000000000000, 'sf해', '123.456789해');
    validateFormat(1234567890, ',f천', '1,234,567.89천');
    validateFormat(12345678, ',$.8', '1,234만5,678원');
    validateFormat(12345678, ',$.6s', '1,234만 5,700원');
    validateFormat(12345678, ',$.6f백', '123,457백원');
    validateFormat(12345678, ',$.6b+', '1천2백3십4만5천7백원');
    validateFormat(123456.78, ',.9~b', '12만3,456.78');
    validateFormat(12345, '8,.3', ' 1만2,300');
    validateFormat(12345, '<9,$.3', '1만2,300원 ');
    validateFormat(12345, '^12,$.3', '  1만2,300원  ');
    validateFormat(-54321, 'k', '-오만사천삼백이십일');
    validateFormat(12345, '^12,$.3k', '   만이천삼백원   ');
    validateFormat(40000000, 'b+', '4천만')

});
