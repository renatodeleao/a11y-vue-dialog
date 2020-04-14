module.exports = (api) => {
  const isTest = api.env('test')

  api.cache(false);
  
  const presets = [
    [
      '@babel/preset-env', 
      !isTest ? {
        modules: false,
        useBuiltIns: false,
        forceAllTransforms: true
      } : {
        targets: {
          node: 'current',
        }
      }
    ],
  ];

  const plugins = [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import"
  ]

  return {
    presets,
    plugins
  }
}