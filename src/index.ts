// export { default as format } from './locale';
// export { default as specifier } from './specifiler';


import { default as format } from './locale';

console.log(12345678, '', format('')(12345678));
console.log(12345678, '.4', format('.4')(12345678));
console.log(100, '.2', format('.2')(100));