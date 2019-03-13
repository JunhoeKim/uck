# uck.js
Format numbers for Korean

영어권에서 사용하는 SI 단위계와 한국 사람들이 사용하는 단위 체계는 꽤 다릅니다.

    1000000 = 1M = 100만
    100000000 = 100M = 1억

이런 상황에서 한글 단위계를 직접 구현해서 formatting하는 일은 생각보다 여러분을 귀찮게 할 것입니다. 

웹 상에서 한글이 포함된 숫자를 formatting하려는 사람들이나 시각화를 제작하면서 축에 한글 단위계를 적용하고 싶은 사람들을 위한 모듈입니다.

이 모듈 구현체는 [d3-format](https://github.com/d3/d3-format) repository에서 많은 참고를 했습니다. 


```js
for (let i = 10; i <= 15; i++) {
    console.log(uck.convert('.2b', i * 1000));
}
```

위와 같은 문법을 바탕으로 변환해주면 다음과 같은 결과를 얻을 수 있습니다.

    1만
    1만1000
    1만2000
    1만3000
    1만4000
    1만5000

그 외에도 uck.js는 다양한 format을 지원합니다.

```js
uck.convert('$.3', 12345678);   // 1230만원
uck.convert(',.12', 12345678);  // 1,234만5,678.0000
uck.convert('.4sb+', 12);       // 1십 2.00
uck.convert('~f천', 1230000);   // 1230천
uck.convert('^12$.3k', 12345);  //    만이천삼백원   ///
```


## Installing
NPM 모듈로 지원하고 있기 때문에 `npm install uck`를 통하여 설치하실 수 있습니다.


## API reference

uck.**format**(*specifier*)

value를 argument로 받을 수 있는 format 함수를 반환합니다.
Specifier에 지정할 수 있는 문법은 다음과 같습니다.

    [align][width][,][$][.precision][s][~][type]

*align*: 만들어진 format이 어디로 정렬할지를 결정합니다. width와 같이 쓰이고 width가 실제 format의 길이보다 길어야 의미가 있습니다. 지정하지않으면 기존적으로 오른쪽 정렬로 동작합니다.

* `<` - 왼쪽 정렬
* `>` - 오른쪽 정렬
* `^` - 가운데 정렬

*width*: 만들어진 format이 차지하는 총 width에 해당합니다. 결과 format이 입력값보다 크면 width 값은 무시됩니다.

*,*: 매 천 자리가 반복될 때마다 ,를 찍어줍니다.

*$*: 숫자 뒤에 원을 붙입니다.

*precision*: 유효숫자를 지정해서 왼쪽부터 precision 수만큼의 숫자가 보존됩니다. precision 값은 **0~20** 까지만 유효합니다. 지정하지 않으면 input value의 길이만큼이 precision으로 결정됩니다. 나머지 단위는 마지막 precision 단위에 맞춰 반올림되서 계산합니다.

*~*: 소수 자리에서 의미없는 0을 제거해줍니다.

*s*: 각 한글 단위마다 한 칸 공백을 추가합니다.

*type*: formatting 타입을 결정하고 다음과 같은 formatting 방법이 있습니다.

* `b`: 가장 기본적인 format입니다. 만 자리부터 1e4마다 한글 단위가 생기며 **만억조경해자양** 단위까지 지원합니다. type을 지정하지 않으면 default type으로 결정됩니다.

```js
uck.format('.5b')(1234560000)   // 12억3450만
uck.format('')(100000001)       // 1억1
```

* `b+`: 기본적인 format에서 더해져서 **십백천** 단위를 사이사이에 끼워넣은 버전입니다.

```js
uck.format('$.6b+')(12345678)   // 1천2백3십4만5천7백원
```

* `k`: 모든 숫자 부분을 한글로 변환합니다.

```js
uck.format('k')(-54321)          // -오만사천삼백이십일
```

* `f`: 원하는 숫자단위를 기준으로 formatting합니다.

```js
uck.format('.6sf천')(1234567890) // 1234570천
uck.format('.f만')(1)            // 0.0001만
```

uck.**convert**(*specifier*, *value*)

`uck.format(specifier)(value)`와 똑같이 동작합니다.

버그 리포트나 발전 방향에 대한 제안은 언제나 환영합니다. 지속적으로 테스트 케이스를 늘려서 실험해볼 계획입니다.
