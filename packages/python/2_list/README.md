# 列表和元租

列表和元组的不同之处在于列表是可以修改，而元组不可以

- eg

```python
   hou = ['lomean', 26]
   hou = [['lomean', 26],['lomean', 26]]
```

### 索引

列表元素编号 从 0 开始

```py
    hou = 'lomean'
    h = hou[1]    #o
```

### 切片

`[start:end:step]` 分别代表第一个元素索引位置，第二位置，第三个步长，步长为负数时候代表从右往左

```py
    number = [1,2,3,4,5,6,7,8,9]
    a = number[3:6]     #[4,5,6]
    b = number[0:1]     #[1]
    c = number[3:]      #[4,5,6,7,8,9]
    d = number[:6]      #[1,2,3,4,5,6]
    e = number[-3:]     #[7,8,9]
    f = number[:]       #[1,2,3,4,5,6,7,8,9]
    g = number[0:10:2]  #[1,3,5,7,9]
    h = number[0:10:-2] #[]
    i = number[10:0:2]  #[]
    j = number[10:0:-2] #[9,7,5,3]
```

### 序列相加（同类型）

代表拼接

```py
   a = [1,2,3] + [4,5,6]   # [1, 2, 3, 4, 5, 6]
```

### 乘法

代表重复创建序列值的次数

```py
    a = [3] * 5   #[3,3,3,3,3]
```

### in

检查是否存在，返回布尔值

```py
    permission = 'lomean'
    'o' in permisson   #True
```

### len max min

`len`表示长度

### list()

用于创建列表

```py
a = list('lomean')   #['l','o','m','e','a','n']
```

### 基本操作

```py
    a = [1,2,3,4]
    # 修改
    a[1] = 10   #[1,10,3,4]
    # 删除
    del a[1]   #[1,3,4]
    # 切片赋值
    a[3] = [5,6,7]  #[1,2,3,5,6,7]
```

### 列表方法

```py
    a = [1,2,3,4]
    # append 尾部添加（修改原数据）
    a.append(5)
    # clear 清空   （修改原数据）
    a.clear()
    # copy  复制
    b = a.copy()
    b[0] = 10    # a值不变
    # count  计数
    a.count(1)
    # extend 扩展   修改被扩展的列表
    b = [5,6,7]
    a.extend(b)  # a = [1,2,3,4,5,6,7]
    # index  第一次出现的索引
    a.index(3)
    # insert 插入   (index,value)
    a.insert(2,100)   #[1,2,3,100,4]
    # pop 尾部弹出
    a.pop()
    # remove  删除指定值
    a.remove(2)
    # reverse   反转
    a.reverse()   #[4,3,2,1]
    # sort  排序 (key?,reverse?)
    a.sort()
```

## 元组

与列表一样，单不可修改 `(value1,value,value3)` 如果是一个值，则需要带上`，`逗号

```py
   a = (1,2,3,4)
   b = (1,)
```

### tuple

与 list 相似，转换为元组

```py
  a =  tuple([1,2,3])   #(1,2,3)

```
