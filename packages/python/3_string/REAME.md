# string

序列中操作除了`赋值、切片赋值`外都可适用

## 设置格式

### `%`字符串格式设置

```py
    format = "hellp, %s.%s enough of you"
    values = ('world', 'hot')
    formatValue =  format % values
    print(formatValue)   # hellp, world.hot enough of you
```

`%s`代表格式为字符串
`%.5f`代表格式为 5 为小数的浮点数

- 模板字符串 `Template`

```py
    from string import Template
    tmpl = Template("hello, $who! $what enough for you")
    values = tmpl.substitute(who="lomean", what='12')
    print(values)   #hello, lomean! 12 enough for you
```

- 字符串方法 `format`
  `{value:5.3f}.format(value=10.123456)`

```py
   #   value          5              .3f
   #  /               |               \
   #  格式化的值     格式化的宽度       小数点位数
```

```py
    "{},{}and{}".format("first","second","third")  # first, second and third
    # 带索引    不能同时适用手动编号和自动编号
    value =  "{0},{2} and {1}".format("first","second","third")
    print(value)       # first,third and second
    # 命名
    value =  "{name},{value:.2f} and {age}".format(value=10.123456,age=20,name="lomean")
    print(value)       # lomean,10.12 and 20
    # 浮点数    默认显示6位小数，可依据需求填充
    value = "{num:10}".format(num = 3)    #           3
    # <    ^     >       左  中  右对齐
    value = "{0:<10.2f}\n {0:^10.2f}\n {0:>10.2f}"
    print(value)
    #  =具体说明符         + 正数     - 负数
```

### 字符串方法

```py
    # center 居中显示   (value, 填充)
    value = "lomean".center(20)
    # find 查找,没有返回-1   (value,start,end)
    value = "lomean".find("m")    "lomean".find("w")
    # join 拼接
    value = ['1','2','3'].join('%')
    # lower upper
    value = 'lomean'.lower()    'lomean'.upper()
    # replace   (a,b)
    value = 'lomean'.replace('o','k')
    # split   (type)  return list
    value = 'lomean'.split(" ")        #['lomean']
    value = 'l o m e a n'.split(" ")   # ['l', 'o', 'm', 'e', 'a', 'n']
    # strip   (?value)  开头和结尾的value
    value = ' lomean '.strip()
    # translate   (ab, ce)  替换多个值
    # string   =>    maketrans
    table = str.maketrans('om', 'aa')    # str.maketrans  used python3
    value = "lomean".translate(table)    # laaean
```
