# vscode自动格式化代码

设置使用 eslint 进行代码格式，在 settings.json 中配置：

```json
"editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": true
  },
 "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "vue"
  ],
// 按本地规则进行格式化
  "eslint.options": {
    "configFile": "./.eslintrc.js"
  },
  // 注意要取消下面的配置，不然还会按本地其他的格式化工具格式一次，进行覆盖。 
  // "editor.formatOnSave": true,
  // "eslint.codeActionsOnSave.rules": "eslint",
```
