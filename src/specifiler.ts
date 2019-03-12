/**
 * 
 * Specifier가 감지하는 form은 아래와 같다:
 * 
 * [align][width][,][$][.precision][s][~][type]
 *
 * align: 만들어진 format의 정렬 (<: 왼쪽, ^: 가운데, >: 오른쪽 정렬)
 * width: 만들어진 foramt이 차지하는 총 width, 만약 결과 format이 이 입력값보다 크면
 * width값은 무시된다.
 * ,: 천 자리마다 ,를 찍는다.
 * $: 숫자 뒤에 원을 붙인다.
 * precision: 유효숫자를 정한다.
 * ~: 의미없는 0 padding을 제거해준다.
 * s: 각 suffix마다 space를 만들지 말지를 선택한다.
 * type: formatting 타입이다.
 * 가능한 type의 종류는 다음과 같다.:
 * 
 *  b: 가장 기본적인 type. ex) 1230000 => 123만
 *  b+: 가장 기본적인 type에서 십, 백, 천 단위의 suffix를 추가 ex) 1230000 => 1백2십3만.
 *  k: digits가 없는 순수 한글 format. ex) 1230000 => 백이십삼만
 *  f[suffix]: 단위 suffix를 하나로 고정시킨다. ex) format('~f천')(1230000) => 1230천
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
