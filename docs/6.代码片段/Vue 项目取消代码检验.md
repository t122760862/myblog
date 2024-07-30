# vue项目取消代码 lint

在 vue-cli 项目中，配置如下

```js
// lintOnSave: Type: boolean | 'warning' | 'default' | 'error'
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.mjs', '.js']
    }
  },
  lintOnSave: false
})
```
