import fs from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import WebpackObfuscator from 'webpack-obfuscator';
import CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin, { ToType } from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import RunNodeWebpackPlugin from 'run-node-webpack-plugin';
import merge from 'webpack-merge';
import { babelExclude } from './util/loader';
import { Entry } from './config';
import { isDev } from './util/shared';

const config = merge<Configuration>(
	{
		entry: Entry.reduce(
			(pre, name) => {
				pre[name] = resolve(__dirname, `../src/entry/${name}.js`);
				return pre;
			},
			{
				main: resolve(__dirname, `../src/main.ts`),
			}
		),
		target: 'node',
		output: {
			clean: true,
			filename: 'Script/[name].js',
			assetModuleFilename: 'Script/[name].[ext]',
			path: resolve(__dirname, '../dist'),
		},
		module: {
			rules: [
				{
					test: /\.(t|j)sx?$/,
					exclude: (filepath) => babelExclude(filepath, []),
					use: [
						{
							loader: 'babel-loader',
						},
					],
				},
				{
					test: /\.(woff2?|eot|ttf|otf|png|svg|jpg|gif|cur|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					type: 'asset',
					parser: {
						dataUrlCondition: (): boolean => {
							return true;
						},
					},
				},
			],
		},
		externals: [nodeExternals()],
		resolve: {
			extensions: ['.js', '.ts'],
			alias: {
				'@': resolve(__dirname, '../src'),
			},
		},
		plugins: [
			new CopyWebpackPlugin({
				patterns: [
					{
						from: resolve(__dirname, '../public'),
						toType: 'dir' as ToType,
					},
				].filter(({ from }) => fs.existsSync(from)),
			}),
			new ForkTsCheckerWebpackPlugin(),
			new CaseSensitivePathsWebpackPlugin(),
		],
	},
	isDev
		? {
				mode: 'development',
				watch: true,
				plugins: [
					new RunNodeWebpackPlugin({
						scriptToRun: 'main.js',
						scriptsToWatch: ['main.js', ...Entry.map((name) => `${name}.js`)],
					}),
				],
		  }
		: {
				mode: 'production',
				plugins: [
					new WebpackObfuscator(
						{
							obfuscatorOptions: {
								target: 'node',
							},
						},
						[]
					),
				],
				optimization: {
					chunkIds: 'named',
					moduleIds: 'deterministic',
					emitOnErrors: true,
					minimize: true,
					minimizer: [
						new TerserWebpackPlugin({
							parallel: true,
							extractComments: false,
							terserOptions: {
								output: {
									comments: /@license/i,
								},
								compress: {
									drop_debugger: true,
								},
							},
						}),
					],
				},
		  }
);

export default config;
