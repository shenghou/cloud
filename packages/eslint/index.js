module.export = {
	parserOptions: {
		ecmaVersion: 6, //es版本
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true, // 启用jsx
			globalReturn: true, //允许全局return
			impliedStrict: true, //严格模式
			experimentalObjectRestSpread: true, //试验性语法
		},
	},
    parser: 'esprima', //解析器  babel-ESLint   @typescript/parser 与ESLint兼容
    //可以修改配置文件的规则，off/0   warn/1   error/2
	rules: {
        semi: 'error',
        curly: 'off',
        quotes: ['error','double'] //前面是严重程度，
	},
	//插件可以提供处理器，处理器可以从另一个种文件提取js代码检测或预处理中转换js代码
	plugins: ['a-plugin', 'eslint-plugin-plugin2'],
	processor: 'a-plugin/a-processor',
	//指定文件转换使用overrides 和 processor组件
	overrides: [
		{
			file: ['*.md'],
			processor: 'a-plugin/markdown',
        },
        //还可以配置已命名的部分
		{
			file: ['**/*.md/*.js'],
            processor: 'a-plugin/markdown',
            rules: {
                strict: 'off'
            }
		},
    ],
    //一个环境定义了一组预定义的全局变量
    env: {
        browser: true,
        node: true
    },
};
