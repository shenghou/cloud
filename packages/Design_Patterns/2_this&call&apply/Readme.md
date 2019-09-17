# 高阶函数

-   函数可以作为参数被传递
-   函数可以作为返回值输出

eg `Array.prototype.sort`
eg `Object.prototype.toString()`

```ts
const isString = obj => {
  return Object.prototype.toString.call(obj) === '[object String]';
};
const isArray = obj => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
const isNumber = obj => {
  return Object.prototype.toString.call(obj) === '[object Number]';
};
//改造后为

const isType = type => {
  return obj => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
};
const isString = isType( 'String' );
const isArray = isType( 'Array' );
const isNumber = isType( 'Number' );

console.log(isArray([1,2,3]));
// isArray = function(obj) {
//   return Object.prototype.toString.call(obj) === `[object ${type}]`;
// }
```
