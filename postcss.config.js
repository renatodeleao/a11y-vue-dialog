const pkg = require('./package.json');

const banner = `
@preserve
@name ${pkg.name}
@version ${pkg.version}
@license: ${pkg.license}
© ${pkg.author}`;

module.exports = (context => {
  const plugins =  [
    require('autoprefixer'),
    require('cssnano')({ preset: 'default'}),
    require('postcss-banner')({banner: banner, important: true})
  ]

  return {
    plugins
  }
})();
