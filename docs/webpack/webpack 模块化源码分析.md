# webpack 模块化 

## AMD  

amd全称: Asynchronous Module Definition, 译为异步模块定义, 用在浏览器环境, 现在几乎不用了, 有以下特性:  

*  **推崇依赖前置、提前执行**
* 所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行
* RequireJS 在推广过程中对模块定义提出的概念

## cmd  

cmd全称: **Common Module Definition**, 译为通用模块定义,用在浏览器环境, 现在几乎不用了,  有以下特性:  

* 运行时需加载，根据顺序执行, **推崇依赖就近、延迟执行**  
*  SeaJS 在推广过程中对模块定义的规范化产出

## Commonjs  

CommonJS是服务器端模块的规范，平时我们也会简称为CJS，由Node推广使用。  

规范如下:  

- 一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性。
- 输出模块变量的最好方法是使用module.exports对象。
- 加载模块使用require方法，该方法读取一个文件并执行，返回文件内部的module.exports对象  

有以下特性:  

* **同步加载**
* 模块是运行时加载
* 使用 ```module.exports```, ```exports.xxx = xxx  ```导出, 使用```require```导入  

基本使用方式:  

```js
// a.js
module.exports = {
  name: 'a',
  age: '18'
}
// 也可以这样导出
// exports.name = 'a'
// exports.age = '18'  

// b.js  
const bar = require('./a.js')
```

```module.exports```和```exports```有什么关系呢?  

* 默认```modules.exports```和```exports```指向同一个引用地址, 也就是说```module.exports === exports```   
* 模块中真正导出的是```module.exports```而不是```exports```  
* **`module` 代表当前模块，是一个对象，保存了当前模块的信息。`exports` 是 `module` 上的一个属性，保存了当前模块要导出的接口或者变量，使用 `require` 加载的某个模块获取到的值就是那个模块使用 `exports` 导出的值**

>**有一点要尤其注意，`exports` 是模块内的私有局部变量，它只是指向了 `module.exports`，所以直接对 `exports` 赋值是无效的，这样只是让 `exports` 不再指向 `module.exports`了而已**  

## ESmodule  

**从 ES6 开始，在语言标准的层面上，实现了模块化功能，而且实现得相当简单，完全可以取代 CommonJS 和 CMD、AMD 规范，成为浏览器和服务器通用的模块解决方案**  

有以下特性:  

* 模块是编译时输出接口, 静态检查实现的基础  
* ```import``` 会提升到代码顶层  
* 模块提前加载并执行模块文件，在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是: 子 -> 父  
* 导出绑定, ```import```导入的属性是不能直接修改的  
* 可以使用 ```import()``` 动态加载  

基本使用:  

```js
export const a = 'a'  // 直接导出  
const b = 'b' 
export { b }  
export { b as c }  
export * from './xx'
export default b
```

## webpack 构建源码

精简后的源码分析:  

```js
;(function (modules) {
  // 用来保存已注册的 module
	var installedModules = {}

	// webpack 实现的 require 方法, moduleId 就是传入的 path
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports
		}

		// 创建一个 module,同时在installedModules中注册, module 本质上就是一个对象
		var module = (installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		})

		// 给新建的module赋值
		modules[moduleId].call(
			module.exports,
			module,
			module.exports,
			__webpack_require__
		)

		// 标记为已加载
		module.l = true

		// 本质上就是返回的 module 对象中的 exports 属性
		return module.exports
	}

	// m 即 module
	__webpack_require__.m = modules

	// c 即 cache
	__webpack_require__.c = installedModules

	// 使用 defineProperty 重写对应属性的 getter
	__webpack_require__.d = function (exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, {
				enumerable: true,
				get: getter
			})
		}
	}

	// mdn: Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把它包含在自己的返回值里.
	// 给 exports 添加 _esModule 标识
	__webpack_require__.r = function (exports) {
		if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, {
				value: "Module"
			})
		}
		Object.defineProperty(exports, "__esModule", { value: true })
	}

	__webpack_require__.t = function (value, mode) {
		// ...
	}

	__webpack_require__.n = function (module) {
		// ...
	}

	// 判断原型上是否有对应属性
	__webpack_require__.o = function (object, property) {
		return Object.prototype.hasOwnProperty.call(object, property)
	}

	__webpack_require__.p = ""

	// Load entry module and return exports
	return __webpack_require__((__webpack_require__.s = "./src/index.js"))
})({
  // commjs 模块
	"./src/cjs.js":
	function(module, exports) {
      "use strict"
			eval(
				'// src/commonjs/add.js\nconsole.log("我是 commonjs")\nlet num = 1\nlet obj = { num: 1 	  }\nmodule.exports.num = num\nexports.obj = obj\nmodule.exports.add = () => {\n\tnum++\n\tobj.num++\n}\n\n\n//# sourceURL=webpack:///./src/cjs.js?'
			)
	},

  // esmodule 模块
	"./src/esmodule.js":
		function (module, __webpack_exports__, __webpack_require__) {
			"use strict"
			eval(
				'__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "num", function() { return num; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "obj", function() { return obj; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });\n// src/commonjs/add.js\nconsole.log("我是 esmodule")\nlet num = 1\nlet obj = { num: 1 }\nconst add = () => {\n\tnum++\n\tobj.num++\n}\n\n\n\n\n//# sourceURL=webpack:///./src/esmodule.js?'
			)
		},

  // 入口模块
  ./src/index.js:
		function (module, __webpack_exports__, __webpack_require__) {
			"use strict"
			eval(
				'__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _esmodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esmodule */ "./src/esmodule.js");\nlet cjs = __webpack_require__(/*! ./cjs.js */ "./src/cjs.js")\nconsole.log(cjs.num, cjs.obj, "cjs")\ncjs.add()\nconsole.log(cjs.num, cjs.obj, "cjs")\n\n\n\nconsole.log(_esmodule__WEBPACK_IMPORTED_MODULE_0__["num"], _esmodule__WEBPACK_IMPORTED_MODULE_0__["obj"], "ejs")\nObject(_esmodule__WEBPACK_IMPORTED_MODULE_0__["add"])()\nconsole.log(_esmodule__WEBPACK_IMPORTED_MODULE_0__["num"], _esmodule__WEBPACK_IMPORTED_MODULE_0__["obj"], "ejs")\n\n\n//# sourceURL=webpack:///./src/index.js?'
			)

			/***/
		}
})

```

流程如下:  

1. 定义一个立即执行函数, 参数为引入的模块  
2. 使用 ```installedModules``` 用来保存注册的 ```module```, 若二次调用直接从缓存里取, 本质上都是返回 ```module.exports```  
3. 若模块第一次被加载, 则执行 ```modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)```, 执行模块内部代码, 模块内部的```module``` 以及 ```exports```由外界传递过来, 目的是给 ```module```对象赋值  

## Commonjs

当加载```Commonjs```模块时, 运行如下代码

```js
// src/commonjs/add.js
function(module, exports){
  console.log("我是 commonjs")
  let num = 1
  let obj = { num: 1 }
  module.exports.num = num
  exports.obj = obj
  module.exports.add = () => {
    num++
    obj.num++
  }
}

//# sourceURL=webpack:///./src/cjs.js?
```

* 形参```module```和```exports```都是在模块第一次加载的时候传递过来  
* 运行函数内部代码, 其实也就是给```module```和```exports```赋值

从这里可以看出为什么说 ```Commonjs```导出的是值的拷贝, 其实就是**加载模块时内部把```module```和```exports```作为上下文进行赋值操作**

## ES6 module  

当加载```ES6 module```时   

```js
function (module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "num", function() { return num; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "obj", function() { return obj; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
  // src/commonjs/add.js
  console.log("我是 esmodule")
  let num = 1
  let obj = { num: 1 }
  const add = () => {
    num++
    obj.num++
  }
}
```

可以看出形参中参数有变化, 多了一个```__webpack_require__```参数  

往上找能看到```__webpack_require__```是 webpack 自己实现的一个方法,  用来加载模块同时做一些缓存或兼容处理  

```__webpack_require__.r```: 用来给```ES6 module```模块打标记  

```js
// 给 exports 添加 _esModule 标识
__webpack_require__.r = function (exports) {
  // mdn: Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把它包含在自己的返回值里.
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    })
  }
  Object.defineProperty(exports, "__esModule", { value: true })
}
```

```__webpack_require__.d```: **这里是```ES6 module```返回值的引用的关键, 使用```defineproperty```重写了属性的```get```**, 因此当模块内部数据发生变化时, 引用方也会获取到改变后的值

```js
// 使用 defineProperty 重写对应属性的 getter
__webpack_require__.d = function (exports, name, getter) {
  if (!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, {
      enumerable: true,
      get: getter
    })
  }
}
```

## 总结  

* ```Commonjs```模块本身是一个对象, 在执行时加载,```exports```其实是对 ```module.exports``` 的引用, ```NodeJs```是践行者, 同步加载, 也可以动态加载, 输出值的拷贝
* ```ES6 Module```是属于浏览器的规范, 编译时加载, 不能动态加载, 因此可以进行静态代码分析, 输出值得引用