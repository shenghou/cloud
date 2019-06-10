### as 操作符
as操作符在.ts和.tsx里都可用，并且与尖括号类型断言行为是等价的。
```ts
    //类型断言
    const foo = <foo>bar;
    //tsx中
    const foo = bar as foo;
    
```