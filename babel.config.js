module.exports = {
	presets: [
		['@vue/babel-preset-app', { useBuiltIns: false }],
		[
			'@babel/preset-typescript', // 引用Typescript插件
		],
	],
	plugins: [
		...[
			{
				libraryName: 'lodash',
				libraryDirectory: '',
				camel2DashComponentName: false, // default: true
			},
		].map((options) => ['import', options, options.libraryName]),
	],
};
