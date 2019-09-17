# happyPack

happyPack 是一个用于加速构建项目的插件，可利用 node 的多线程充分利用 CPU 资源

使用时将原有的 `loader` 换成 `happypack/loader?id=xxx`，再在 `plugins` 里把原先的 `loder` 按 `id` 写入即可。

-   loaders: Array webpack 配置的 loader
-   id: string 定义通信的 ID 资源
-   threads: number 定义 node 线程数量 默认为 3
-   threadPool: 预定义线程池

```js readonly
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HappyPack = require('happypack');

//包含4个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });

const src = path.resolve(process.cwd(), 'src'); // 源码目录
const dist = path.resolve(process.cwd(), 'dist'); // 源码目录
const evn = process.env.NODE_ENV == 'production' ? 'production' : 'development';

module.exports = {
	mode: evn,

	entry: {
		app: path.resolve(src, 'js', 'main.js'),
	},

	output: {
		path: dist,
		filename: '[name].js',
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				// use: ['babel-loader?cacheDirectory'] 之前是使用这种方式直接使用 loader
				// 现在用下面的方式替换成 happypack/loader，并使用 id 指定创建的 HappyPack 插件
				use: ['happypack/loader?id=babel'],
				include: path.resolve(__dirname, 'src'),
			},
			{
				test: /\.(css|less|sass)$/,
				// 之前是使用这种方式直接使用 loader
				// use: ['style-loader',
				// {
				//     loader: 'css-loader',
				//     options: {
				//         sourceMap: true
				//     }
				// },
				// {
				//     loader: 'postcss-loader',
				//     options: {
				//         plugins: () => [autoprefixer()]
				//     }
				// },
				// {
				//     loader: 'less-loader',
				//     options: {
				//         javascriptEnabled: true,
				//     }
				// }]
				// 现在用下面的方式替换成 happypack/loader，并使用 id 指定创建的 HappyPack 插件
				use: ['happypack/loader?id=style'],
				include: path.resolve(__dirname, 'src'),
			},
		],
	},

	resolve: {
		alias: {
			// 常用组件路径map
			jquery: path.resolve(src, 'components', 'jquery'),
		},
		extensions: ['.js'],
	},

	plugins: [
		// dllPlugin关联配置
		new webpack.DllReferencePlugin({
			context: process.cwd(), // 跟dll.config里面DllPlugin的context一致
			manifest: require(path.join(src, 'js', 'dll', 'vendor-manifest.json')),
		}),
		new HtmlWebpackPlugin({
			// 文件路徑
			template: path.resolve(process.cwd(), 'index.html'),
			// src後面的路徑，前面不要加/
			filename: 'index.html',
			inject: 'body',
			// 需要加載的js，對應entries屬性名
			chunks: ['app'],
		}),

		new HappyPack({
			//与前面的对应
			id: 'babel',
			//loader还是原先的loader
			loaders: ['babel-loader?cacheDirectory'],
			// 使用共享进程池中的进程处理任务
			threadPool: happyThreadPool,
		}),

		new HappyPack({
			//与前面的对应
			id: 'style',
			//loader还是原先的loader
			loaders: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
					},
				},
				{
					loader: 'postcss-loader',
					options: {
						plugins: () => [autoprefixer()],
					},
				},
				{
					loader: 'less-loader',
					options: {
						javascriptEnabled: true,
					},
				},
			],
			// 使用共享进程池中的进程处理任务
			threadPool: happyThreadPool,
		}),
	],
};
```

页面可见`Happy[lodaer]`

```bash
Happy[babel]: Version: 5.0.1. Threads: 4 (shared pool)
Happy[babel]: All set; signaling webpack to proceed.
Happy[style]: Version: 5.0.1. Threads: 4 (shared pool)
Happy[style]: All set; signaling webpack to proceed.
Hash: 0a9da185951b43e0cc0f
Version: webpack 4.39.3
Time: 1009ms
Built at: 2019-09-10 15:50:33
     Asset       Size  Chunks             Chunk Names
    app.js   1.07 KiB       0  [emitted]  app
index.html  395 bytes          [emitted]
Entrypoint app = app.js
[0] delegated ./src/components/jquery.js from dll-reference vendor_3551d4de29d9111a8013 42 bytes {0} [built]
[1] ./src/js/main.js 229 bytes {0} [built]
[2] external "vendor_3551d4de29d9111a8013" 42 bytes {0} [built]
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./index.html 548 bytes {0} [built]
    [1] ./node_modules/lodash/lodash.js 528 KiB {0} [built]
    [2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [3] (webpack)/buildin/module.js 497 bytes {0} [built]
```
