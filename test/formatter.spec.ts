import * as d3 from '../src/index';

describe('A suite to check wheter the formatter works valid or not', () => {

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(12345678);
        expect(result).toBe('1234만5678.0000');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(123456780000);
        expect(result).toBe('1234억5678만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(-123456780000);
        expect(result).toBe('-1234억5678만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(2);
        expect(result).toBe('2.00000000000');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(100000000);
        expect(result).toBe('1억.000');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('')(12345678900000000000000);
        expect(result).toBe('123해4567경8900조');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.2')(12345678);
        expect(result).toBe('1200만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('$.3')(12345678);
        expect(result).toBe('1230만원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.6s')(12345678);
        expect(result).toBe('1234만 5700');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.4s')(12);
        expect(result).toBe('12.00');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('$.3s')(12);
        expect(result).toBe('12.0원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.4sb+')(12);
        expect(result).toBe('1십 2.00');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.6sb+')(1234567890);
        expect(result).toBe('1십 2억 3천 4백 5십 7만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.6sb')(1234567890);
        expect(result).toBe('12억 3457만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('.6sf천')(1234567890);
        expect(result).toBe('1234570천');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('sf천')(1234567890);
        expect(result).toBe('1234568천.00');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('~f천')(1230000);
        expect(result).toBe('1230천');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('~f만')(1);
        expect(result).toBe('0.0001만');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('sf해')(12345678900000000000000);
        expect(result).toBe('123해');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format(',$.8')(12345678);
        expect(result).toBe('1,234만5,678원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format(',$.6s')(12345678);
        expect(result).toBe('1,234만 5,700원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format(',$.6f백')(12345678);
        expect(result).toBe('123,457백원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format(',$.6b+')(12345678);
        expect(result).toBe('1천2백3십4만5천7백원');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format(',.9~b')(123456.78);
        expect(result).toBe('12만3,456.78');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('8,.3')(12345);
        expect(result).toBe(' 1만2,300');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('<9,$.3')(12345);
        expect(result).toBe('1만2,300원 ');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('^12,$.3')(12345);
        expect(result).toBe('  1만2,300원  ');
    });

    it('The result should be equal to expected results', () => {
        const result = d3.format('^12,$.3k')(12345);
        expect(result).toBe('   만이천삼백원   ');
    });

});
