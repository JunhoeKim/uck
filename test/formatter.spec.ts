import * as d3 from '../src/index';

function validate(value: number, format: string, expectedResult: string) {
    it('The result should be equal to expected results', () => {
        const result = d3.format(format)(value);
        expect(result).toBe(expectedResult);
    });
}

describe('A suite to check wheter the formatter works valid or not', () => {

    validate(12345678, '', '1234만5678');
    validate(123456780000, '', '1234억5678만');
    validate(-123456780000, '', '-1234억5678만');
    validate(-1, '', '-1');
    validate(100000001, '', '1억1');
    validate(12345678900000000000000, '', '123해4567경8900조');
    validate(12345678, '.2', '1200만');
    validate(12345678, '$.3', '1230만원');
    validate(12345678, '.6s', '1234만 5700');
    validate(12, '.4s', '12.00');
    validate(12, '.4sb+', '1십 2.00');
    validate(1234567890, '.6sb+', '1십 2억 3천 4백 5십 7만');
    validate(1234567890, '.6sf천', '1234570천');
    validate(1230000, '~f천', '1230천');
    validate(1, '~f만', '0.0001만');
    validate(-0.001, 'f백', '-0.00001백');
    validate(12345678900000000000000, 'sf해', '123.456789해');
    validate(1234567890, ',f천', '1,234,567.89천');
    validate(12345678, ',$.8', '1,234만5,678원');
    validate(12345678, ',$.6s', '1,234만 5,700원');
    validate(12345678, ',$.6f백', '123,457백원');
    validate(12345678, ',$.6b+', '1천2백3십4만5천7백원');
    validate(123456.78, ',.9~b', '12만3,456.78');
    validate(12345, '8,.3', ' 1만2,300');
    validate(12345, '<9,$.3', '1만2,300원 ');
    validate(12345, '^12,$.3', '  1만2,300원  ');
    validate(12345, '^12,$.3k', '   만이천삼백원   ');
});
