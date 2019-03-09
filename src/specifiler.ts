/**
 * 
 * The general form of a specifier is:
 * 
 * [align][width][,][$][.precision][~][s][type]
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

    public align: string;
    public width: number;
    public comma: boolean;
    public currency: boolean;
    public precision: number;
    public spacing: boolean;
    public trim: boolean;
    public type: string;

    constructor(specifier: string) {

        const re = /^([<^>])?(\d+)?(,)?(\$)?(\.\d+)?(s)?(~)?((b\+?)|k|f[십백천만억조경해자양])?$/;
        const match = re.exec(specifier);
        if (!match) { 
            throw new Error('Invalid format: ' + specifier); 
        }
        this.align = match[1] || ">";
        this.width = match[2] && +match[2];
        this.comma = !!match[3];
        this.currency = !!match[4];
        this.precision = match[5] ? +match[5].slice(1) : 12;
        this.spacing = !!match[6];
        this.trim = !!match[7];
        this.type = match[8] || "b";
    }
}
