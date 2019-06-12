### 表达式

取整 `//`,向下取整

```py
    10 // 3
```

`input` 获取用户输入值

```py
    x = input("please input my name")
    print(x)

```

`int float`

```py
    x = 9.2
    print(int(x))   # 9
    y = 9
    print(float(y))  # 9.0

```

`abs round pow`

```py
    x = -9.1
    print(abs(x))   #9.1
    y = 5.7
    print(round(y)) #6
    z = pow(5,3)
    print(z)       # 125

```

`math ceil floor sqrt` 向上，向下，正数平方根

```py
    x = math.ceil(5.6);    # 6
    y = math.floor(5.6)    # 5
    z = math.sqrt(5.6)     # 2.3
    print(x,y,z)
```

`cmath.sqrt` 返回平方根，可用于负数

```py
x = cmath.sqrt(4)
y = cmath.sqrt(-4)
print("x",x,"y",y)

```

`str repr` str 用户更友好，repr 机器认识

```py
    print(repr("hello,\nworld!"))
    print(str("hello,\nworld!"))
```

`'''`长字符串

```py
    print('''aaa
    bbb
    ccc
    ddd'''
    )
```

`r` 原始字符串

```py
    print("C:\nwhere")   # where
    print("C:\\nwhere")   # C:\nwhere
    print(r"C:\\nwhere")   #C:\\nwhere
```
