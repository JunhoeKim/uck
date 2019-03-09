const suffixToValue : { [key: string]: number }= {
    '십': 10,
    '백': 100,
    '천': 1000,
    '만': 10000,
    '억': 10e8,
    '조': 10e12,
    '경': 10e16,
    '해': 10e20,
    '자': 10e24,
    '양': 10e28,
}
export default function(format: string): number {
  let chunk = 0;
  let value = 0;
  for (let c of [...format]) {
    if (suffixToValue[c]) {
      value += chunk * suffixToValue[c];
      chunk = 0;
    } else {
      chunk += chunk * 10 + +c;
    }
  }
  return value;
}