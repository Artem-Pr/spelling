const { override, addWebpackAlias, addBundleVisualizer } = require('customize-cra')
const path = require('path')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const isProd = process.env.NODE_ENV === 'production'

const HTMLSpriteLoader = () => config => {
  const svgSpriteLoader = {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: path.resolve(__dirname, './src/assets/images/svg-icons-html'),
    options: {
      symbolId: 'icon-[name]',
    },
  }

  const oneOf = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf
  oneOf.unshift(svgSpriteLoader)
  return config
}

const CSSSpriteLoader = () => config => {
  const newConfig = Object.assign(config)
  const svgSpriteLoader = {
    test: /\.svg$/,
    include: path.resolve(__dirname, './src/assets/images/svg-icons-css'),
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
    },
  }

  const oneOf = newConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf
  oneOf.unshift(svgSpriteLoader)

  return newConfig
}

const spriteLoaderPlugin = () => config => {
  config.plugins.push(new SpriteLoaderPlugin())
  return config
}

module.exports = override(
  CSSSpriteLoader(),
  HTMLSpriteLoader(),
  spriteLoaderPlugin(),
  addWebpackAlias({
    ['@']: path.resolve(__dirname, 'src'),
  }),
  isProd &&
    addBundleVisualizer({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),
)
