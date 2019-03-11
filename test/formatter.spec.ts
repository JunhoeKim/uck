import * as d3 from '../src/index';

describe('A suite with some shared setup', () => {
    it('contains spec with an expectation', () => {
        const result = d3.format('')(12345678);
        expect(result).toBe('1234만5678.0000');
    })
});
