# DllPlugin 和 DllReferencePlugin 用于拆分 bundles，可提升构建速度

## DllPlugin

DllPlugin 在一个额外的独立的 webpack 设置中创建一个只有 Dll 的 bundle，这个插件会生成一个名为`mainfest.json`的文件
这个文件是用来让`DllReferencePlugin`映射到相关的依赖上。

-   context: manifest 文件中请求的上下文（precess.cwd()）
-   name: 暴露的函数名
-   path: manifest json 文件输出路径

```js readonly
    new webpack.DllPlugin(
        // 定义程序中打包公共文件的入口文件
        context: process.cwd(),

        // manifest.json文件的输出位置
        path: path.join(src, 'js', 'dll', '[name]-manifest.json'),

        // 定义打包的公共vendor文件对外暴露的函数名
        name: '[name]_[hash]'
    );
```

## DllReferencePlugin

DllReferencePlugin 是在主`webpack`中设置的，把只有 DLL 的 bundle 引用到需要的预编译的依赖；

-   context: mainfest 中请求是上下文，与 dll 中一致
-   mainfest: 包含 content 和 name 的对象，或者在编译时的一个用于加载额 json mainfest 绝对路径
-   content: 请求到模块 ID 的映射，默认值为 mainfest.content
-   name: dll 暴露的地方的名称，默认值为 mainfest.name
-   scope: dll 中内容的前缀
-   sourceType: dll 是如何暴露的

```js readonly
    new webpack.DllReferencePlugin(
        context: process.cwd(), // 跟dll.config里面DllPlugin的context一致
        manifest: require(path.join(src, 'js', "dll", "vendor-manifest.json"))
    );
```
