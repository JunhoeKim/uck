export { default as format } from './formatter';
export { default as specifier } from './specifiler';


import { default as format } from './formatter';

console.log(12345678, '', format('')(12345678));
console.log(123.456, '', format('')(123.456));
console.log(12345678, '.4', format('.4')(12345678));
console.log(12345678, '.4f천', format('.4f천')(12345678));
console.log(12345678, '.4f억', format('.4f억')(12345678));
console.log(100, '.2', format('.2')(100));
console.log(12480, '$.2', format('$.2')(12480))
console.log(12480, '$.2b', format('$.2b')(12480))
console.log(12480, '$.2b+', format('$.2b+')(12480))
console.log(12480, '.2sb+', format('.2sb+')(12480))