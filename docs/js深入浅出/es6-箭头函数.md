## 箭头函数

使用方式:

```js

const fn = () => {

// todo

}

```

### this 指向

简单来说就是定义时父级 `this` 的指向

```js

var age = 18

const obj = {

name: '无来',

age: 27,

showName: function() {

console.log(this.name) // 无来

},

showAge: () => {

console.log(this.age) // 18

},

child: {

age: 3,

showAge: () => {

console.log(this.age) // 18

}

}

}

```

### 没有 `conutructor` 无法被 `new`

```js

const Fn = () => {

console.log('Fn')

}

cosnt fn = new Fn() // TypeError: Fn is not a constructor

```

### 没有 `arguments`, 箭头函数的 `arguments` 为外层函数的 `arguments`, 跟 `this` 类似

```js

const fn = () => {

console.log(arguments); // Uncaught ReferenceError: arguments is not defined

}

fn()

function fn1() {

let arrowfn = () => {

console.log(arguments, 'arrow arguments'); // Arguments[1, 2, 3, ...]

}

arrowfn()

}

fn1(1, 2, 3)

```

### 没有 `prototye`

### 不可以使用yield命令，因此箭头函数不能用作Generator函数。

### 不能被显式改变this指向

### 思考: 为什么箭头函数没有`this`等属性 ？

* 箭头函数有作用域，词法作用域？

* 规范？

[面试题](https://muyiy.cn/blog/3/3.2.html#%E9%A2%98%E7%9B%AE1)