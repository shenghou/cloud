## AJV json 格式的数据校验

### start

- ajv 文档介绍的一般如下格式开始创建一个 shemas 格式的校验

```js
import Ajv from "ajv";
const ajv = new Ajv();
const validate = ajv.compile(shema);
const valid = validate(data);
if (!vali) {
  // do something
}
```

- 一般我们会把数据校验封装成一个函数来调用

```js
import Ajv from "ajv";
import shemas from "./schemas"; //定义是shecma集合

function validateData(shema, data) {
  const ajv = new Ajv();
  const validate = ajv.compile(shemas[shema]);
  const valid = validate(data);
  if (!vali) {
    // do something
  }
}

export default validateData;
```

### keywords

- validation 支持 draft-07 标准的关键字校验

* `number`

- 例如

```js
// 当输入数字时候可以通过校验
    const inputNumber = {
        type: "number",
    }

    //必须是整形
    const inputInteger = {
        type: 'integer';
    }

    //还可以限制最大最小值
    const inputMaxAndMin = {
        type: "number",
        maximum: 10,
        minimun: 1,
    }

    //倍数
    const mulipleof = {
        type: "number",
        multipleOf: 5, // 5的倍数
    }

    export default {
        inputNumber,
        inputInteger,
        inputMaxAndMin,
        mulipleof
    }

```

- string
- array
- boolean
- object
  ...

* 详情可以参考[https://ajv.js.org/keywords.html](https://ajv.js.org/keywords.html)

### formats

- 对于一些常用类型的数据校验，`ajv`也提供了我们方便使用例如 `data, time, data-time, uri, email`等；

* 详情可参考[https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js](https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js)

### combine

- 有时候我们在一个表单校验时候可能会校验多条数据，而这些条件又是单独的，这时候就可以使用 combine 模式来同时校验多个数据；

#### `$ref`

```js
const schema = {
  $id: "http://example.com/schemas/schema.json",
  type: "object",
  properties: {
    foo: { $ref: "defs.json#/definitions/int" },
    bar: { $ref: "defs.json#/definitions/str" }
  }
};

const defsSchema = {
  $id: "http://example.com/schemas/defs.json",
  definitions: {
    int: { type: "integer" },
    str: { type: "string" }
  }
};
const ajv = new Ajv({ schemas: [schema, defsSchema] });
const validate = ajv.getSchema("http://example.com/schemas/schema.json");

//或者
const ajv = new Ajv();
const validate = ajv.addSchema(defsSchema).compile(schema);
```

#### `$data`

- 我们还可以把之前的校验格式引用拿来

```js
var ajv = new Ajv({ $data: true });

var schema = {
  properties: {
    smaller: {
      type: "number",
      maximum: { $data: "1/larger" }
    },
    larger: { type: "number" }
  }
};

var validData = {
  smaller: 5,
  larger: 7
};
ajv.validate(schema, validData); // true
===============================

var schema = {
  additionalProperties: {
    type: "string",
    format: { $data: "0#" }  //引用
  }
};

var validData = {
  "date-time": "1963-06-19T08:30:06.283185Z",
  email: "joe.bloggs@example.com"
};
```

#### 还有 `$merge` `$path`

- [https://github.com/epoberezkin/ajv-merge-patch](https://github.com/epoberezkin/ajv-merge-patch)

### define keywords

- 我们还可以通过添加关键字的形式来定义自定义名称的校验

```js
ajv.addKeyword("range", {
  type: "number",
  compile: function(sch, parentSchema) {
    var min = sch[0];
    var max = sch[1];

    return parentSchema.exclusiveRange === true
      ? function(data) {
          return data > min && data < max;
        }
      : function(data) {
          return data >= min && data <= max;
        };
  }
});
// 使用关键字 range
var schema = { range: [2, 4], exclusiveRange: true };
var validate = ajv.compile(schema);
console.log(validate(2.01)); // true
console.log(validate(3.99)); // true
console.log(validate(2)); // false
console.log(validate(4)); // false
```

### filter data

- `removeAdditional`可以用来过滤数据当进行校验的时候

```js
var ajv = new Ajv({ removeAdditional: true });
var schema = {
  additionalProperties: false,
  properties: {
    foo: { type: "number" },
    bar: {
      additionalProperties: { type: "number" },
      properties: {
        baz: { type: "string" }
      }
    }
  }
};

var data = {
  foo: 0,
  additional1: 1, // will be removed; `additionalProperties` == false
  bar: {
    baz: "abc",
    additional2: 2 // will NOT be removed; `additionalProperties` != false
  }
};

var validate = ajv.compile(schema);

console.log(validate(data)); // true
console.log(data);
```

### assign defaults

- use properites

```js
var ajv = new Ajv({ useDefaults: true });
var schema = {
  type: "object",
  properties: {
    foo: { type: "number" },
    bar: { type: "string", default: "baz" }
  },
  required: ["foo", "bar"]
};

var data = { foo: 1 };

var validate = ajv.compile(schema);

console.log(validate(data)); // true
console.log(data); // { "foo": 1, "bar": "baz" }
```

- use items

```js
var schema = {
  type: "array",
  items: [{ type: "number" }, { type: "string", default: "foo" }]
};

var data = [1];

var validate = ajv.compile(schema);

console.log(validate(data)); // true
console.log(data); // [ 1, "foo" ]
```

- 实际开发中我们会做到数据校验错别并且提示

```js
const description = {
  type: "string",
  maxLength: 128,
  errorMessage: t("请输入合法的描述（不超过128个字符）")
};
const name = {
  type: "string",
  minLength: 1,
  maxLength: 128,
  pattern: "^[a-zA-Z0-9_.\\-]+$"
};
const VolumeGroupSnapshotCreate = {
  type: "object", //定义类型，其实就是combine
  properties: { name, description }, //校验项
  required: ["name"], //name
  errorMessage: {
    properties: {
      name: t(
        "请输入合法的名称（%s~%s个字符，支持大小写字母、数字、下划线、中划线）",
        { args: [name.minLength, name.maxLength] }
      ),
      description: t("请输入合法的描述（不超过128个字符）")
    },
    required: {
      name: t("请输入名称")
    }
  }
};

export default {
  VolumeGroupSnapshotCreate
};
```

### Coercing type (一般用到转化，建议用 ts 开发做原始数据校验)

### 附 options 默认表

```json
{
  // validation and reporting options:
  "$data": false,
  "allErrors": false,
  "verbose": false,
  "$comment": false, // NEW in Ajv version 6.0
  "jsonPointers": false,
  "uniqueItems": true,
  "unicode": true,
  "nullable": false,
  "format": "fast",
  "formats": {},
  "unknownFormats": true,
  "schemas": {},
  "logger": undefined,
  // referenced schema options:
  "schemaId": "$id",
  "missingRefs": true,
  "extendRefs": "ignore", // recommended 'fail'
  "loadSchema": undefined, // function(uri: string): Promise {}
  // options to modify validated data:
  "removeAdditional": false,
  "useDefaults": false,
  "coerceTypes": false,
  // strict mode options
  "strictDefaults": false,
  "strictKeywords": false,
  // asynchronous validation options:
  "transpile": undefined, // requires ajv-async package
  // advanced options:
  "meta": true,
  "validateSchema": true,
  "addUsedSchema": true,
  "inlineRefs": true,
  "passContext": false,
  "loopRequired": Infinity,
  "ownProperties": false,
  "multipleOfPrecision": false,
  "errorDataPath": "object", // deprecated
  "messages": true,
  "sourceCode": false,
  "processCode": undefined, // function (str: string): string {}
  "cache": new Cache(),
  "serialize": undefined
}
```
