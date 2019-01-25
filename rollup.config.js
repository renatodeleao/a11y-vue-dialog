import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const babelOptions = {
	extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.ts']
}

export default [
	// browser-friendly UMD build
	{
		input: pkg.main,
		output: {
			name: pkg.name,
			file: pkg.browser,
			format: 'umd',
			sourcemap: false
		},
		plugins: [
			resolve(),
			commonjs(),
			vue({
				postcssPlugins: [autoprefixer()]
			}),
			babel(babelOptions),
			//terser()
		]
	},
	{
		input: pkg.main,
		output: [
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			vue({
				postcssPlugins: [autoprefixer ()]
			}),
			babel(babelOptions),
			// terser()
		]
	}
];
