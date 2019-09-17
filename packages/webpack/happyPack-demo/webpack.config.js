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
