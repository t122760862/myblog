## 方法签名  

```require.context```是 webpack 中的一个方法  

官网文档如下  

> 可以给这个函数传入三个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达式。Webpack 会在构建中解析代码中的 `require.context()`  

语法:  

```js
require.context(
  directory, // 目录
  (useSubdirectories = true), // 是否递归子目录
  (regExp = /^\.\/.*$/), // 正则判断文件名
  (mode = 'sync')
);
```

示例:  

```js
require.context('./test', false, /\.test\.js$/);
//（创建出）一个 context，其中文件来自 test 目录，request 以 `.test.js` 结尾。  

require.context('../', true, /\.stories\.js$/);
// （创建出）一个 context，其中所有文件都来自父文件夹及其所有子级文件夹，request 以 `.stories.js` 结尾。  
```

**传递给 `require.context` 的参数必须是字面量(literal)！**  

## 自动注册当前目录下组件  

背景: 基于 elementUI 二次封装基础业务组件, 由于使用频繁不想导入再使用, 期望自动注册当前目录下的组件文件  

实现方式:  

```js
import Vue from 'vue'
// 查找同级目录下以vue结尾的组件
const requireComponent = require.context('./', false, /\.vue$/);

const install = (Vue: any) => {
    requireComponent.keys().forEach(fileName => {
        const config = requireComponent(fileName);

        // 拿到文件名, 组件名跟文件名保持一致
        const componentName = fileName.replace(/\.\/(.*)\.vue$/, '$1');

        Vue.component(componentName, config.default || config);
    });
};
export default {
    install,
};

// 最后以插件的方式引用
Vue.use({ install })

```

最后就可以愉快的使用了~