#!/usr/bin/env python

import math
import cmath

x = 10
print(x)


y = 10 // 3
print(y)


x = input("please input my name")
print(x)


x = 9.2
print(int(x))
y = 9
print(float(y))


x = -9.1
print(abs(x))
y = 5.7
print(round(y))
z = pow(5, 3)
print(z)


x = cmath.sqrt(4)
y = cmath.sqrt(-4)
print("x", x, "y", y)


print(repr("hello,\nworld!"))
print(str("hello,\nworld!"))

print('''aaa
    bbb
    ccc
    ddd'''
      )


print("C:\nwhere")
print("C:\\nwhere")
print(r"C:\\nwhere")


x = math.ceil(5.6)
y = math.floor(5.6)
z = math.sqrt(5.6)
print(x, y, z)
