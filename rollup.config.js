import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const entry = './src/index.js'

const external = Object.keys(pkg.dependencies || {});

const rollupBabelConfig = {
	extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.ts']
}

const terserConfig = {
	output: {
		comments: "some"
	}
}

const commonUmdPlugins = [
	resolve(),
	commonjs(),
	vue({ css: false }),
	babel(rollupBabelConfig),
]

const banner = `
/**
 * @preserve
 * @name ${pkg.name}
 * @version ${pkg.version}
 * @license: ${pkg.license}
 * © ${pkg.author}
*/`;

export default [
	// browser-friendly UMD build
	{
		input: entry,
		output: {
			name: pkg.name,
			file: pkg.browser,
			banner,
			format: 'umd',
			sourcemap: true,
			exports: 'named'
		},
		plugins: commonUmdPlugins
	},
	// minified
	{
		input: entry,
		output: {
			name: pkg.name,
			file: `dist/${pkg.name}.umd.min.js`,
			banner,
			format: 'umd',
			sourcemap: false,
			exports: 'named'
		},
		plugins: [
			...commonUmdPlugins,
			terser(terserConfig)
		]
	},
	// module
	{
		input: entry,
		output: [
			{ file: pkg.module, format: 'es' }
		],
		external,
		plugins: [
			commonjs(),
			vue({ css: false }),
			babel(rollupBabelConfig)
		]
	}
];