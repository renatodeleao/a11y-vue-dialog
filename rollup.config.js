import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';

//https://stackoverflow.com/questions/41128621/proper-way-to-chain-postcss-and-sass-in-rollup
import postcss from 'postcss';
import pkg from './package.json';


const external = Object.keys(pkg.dependencies || {});
const postcssConfig = require('./postcss.config.js');

const rollupBabelConfig = {
	extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.ts']
}

const rollupSassOptions = {
	output: `dist/${pkg.name}.css`,
	// Processor will be called with two arguments:
	// - style: the compiled css
	// - id: import id
	// Processor will be called with two arguments:
  // - style: the compiled css
  // - id: import id
  processor: css => postcss(postcssConfig.plugins)
    .process(css)
    .then(result => result.css)
}

const terserConfig = {
	output: {
		comments: "some"
	}
}

const commonUmdPlugins = [
	resolve(),
	commonjs(),
	sass(rollupSassOptions),
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
		input: pkg.main,
		output: {
			name: pkg.name,
			file: pkg.browser,
			banner,
			format: 'umd',
			sourcemap: true
		},
		plugins: commonUmdPlugins
	},
	// minified
	{
		input: pkg.main,
		output: {
			name: pkg.name,
			file: `dist/${pkg.name}.umd.min.js`,
			banner,
			format: 'umd',
			sourcemap: false
		},
		plugins: [
			...commonUmdPlugins,
			terser(terserConfig)
		]
	},
	// module
	{
		input: pkg.main,
		output: [
			{ file: pkg.module, format: 'es' }
		],
		external,
		plugins: [
			sass(rollupSassOptions),
			vue({ css: false }),
			babel(rollupBabelConfig)
		]
	}
];