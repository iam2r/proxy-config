module.exports = {
	presets: [['@vue/babel-preset-app', { useBuiltIns: false }], ['@babel/preset-typescript']],
	plugins: [
		...[
			{
				libraryName: 'lodash',
				libraryDirectory: '',
				camel2DashComponentName: false,
			},
		].map((options) => ['import', options, options.libraryName]),
	],
};
