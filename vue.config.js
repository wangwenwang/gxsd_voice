// vue-cli3.0+
module.exports = {
  parallel: false,
  chainWebpack: config => {
    config.output.globalObject('this')
  }
}