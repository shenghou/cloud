# 模块（指代外部模块）

详情参考`es6`

### export= & import = require()

commonJs 和 AMD 都可以被赋值为一个对象，类似于 export default 但是不兼容，所以 ts 中引入该方法

- 若使用`export =`导出一个模块，则也得使用`import module = require('moduleName')`

```ts
// ZipCodeValidator.ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```

```ts
//test.ts
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(
    `"${s}" - ${validator.isAcceptable(s) ? "matches" : "does not match"}`
  );
});
```
