/**
 * 
 * The general form of a specifier is:
 * 
 * [width][,][.precision][~][s][type]
 *
 * s: space between types
 * The available type values are:
 * 
 *  b: basic suffix notation.
 *  b+: basic suffix notation using combination of available suffixes.
 *  k: korean notation without digits.
 *  f[suffix]: fixed suffix notation.
 *  
 */

export default class FormatSpecifier {

    public width: number;
    public comma: boolean;
    public precision: number;
    public trim: boolean;
    public spacing: boolean;
    public type: string;

    constructor(specifier: string) {

        const re = /^(\d+)?(,)?(\.\d+)?(s)?((b\+?)|k|f[십백천만억조경해자양])?$/;
        const match = re.exec(specifier);
        if (!match) { 
            throw new Error('Invalid format: ' + specifier); 
        }

        this.width = match[1] && +match[1];
        this.comma = !!match[2];
        this.precision = match[3] ? +match[3].slice(1) : 12;
        this.trim = !!match[4];
        this.spacing = !!match[5];
        this.type = match[6] || "b";
    }
}
