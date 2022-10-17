### 历史

es6 又名 es2015,自 es6 之后改为每年 6 月份进行一个迭代更新.

es6 新增了比较多的特性,如箭头函数,const,let,拓展运算符,一些数组的新方法,class 类

### const,let

#### 不允许重复声明

```js

const a = '无来'

const a = 'apple' // SyntaxError(语法错误): Identifier 'a' has already been declared

```

##### 面试题

```js

// es5如何声明一个常量

var a = '无来'

Object.defineProperty(window, 'a', {

writable: false,

})

a = 'apple' // 不会修改成功, 也不会报错

console.log(a) // 无来

// const 能先声明后赋值吗

const a // 报错 SyntaxError: Missing initializer in const declaration

a = '无来'

```

#### 块级作用域

```js

if (false) {

var a = '无来'

}

console.log(a) // undefined

if (true) {

var b = '无来'

}

console.log(b) // 无来

if (true) {

const a = '无来'

let b = 'apple'

}

console.log(a) // a is not defined

console.log(b) // b is not defined

```

#### 无变量提升

```js

console.log(a) // undefined

var a = '无来'

console.log(b) // ReferenceError(引用错误): Can not access 'b' before initialization

const b = '无来'

```

#### dead zone

```js

// 块级作用域下 变量先使用后声明

if (true) {

console.log(a)

const a = '无来'

}

```

#### let

let 和 const 哪个优先使用

* bad -> let

* prefer -> const

#### 不会绑定到 window 上

```js

// 在全局作用域下

var name = '无来'

console.log(this.name) // 无来

const color = 'red'

console.log(this.color) // undefined

```

#### 面试附加题

[Object.freeze](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/JavaScript/Reference/Global_Objects/Object/freeze),冻结一个对象

```js

// 如何将引用类型的属性值常量化

const people = {

name: '无来',

age: 27

}

people.name = '来无'

console.log(people.name) // '来无'

// 使用 Object.freeze()

const people = {

name: '无来',

age: 27

}

Object.freeze(people)

people.name = '来无' // 会报错吗? 不会

console.log(people.name) // '无来'

// 使用 Object.defineProperty()

const people = {

name: '无来',

age: 27

}

Object.freeze(people)

Object.defineProperty(people, 'friute', { value: 'apple' }) // TypeError: Cannot define property friute, object is not extensible

console.log(people)

// 只能冻结当前属性的值,无法深层冻结

const people = {

name: '无来',

age: 18,

like: {

work: 'web',

tv: 'movie'

}

}

Object.freeze(people)

people.like.car = 'bmw'

console.log(people.like.car) // bmw

// 递归深层冻结

const people = {

name: '无来',

age: 18,

like: {

work: 'web',

ty: {

movie: '王牌保镖'

}

}

}

const deepFreeze = (obj) => {

Object.freeze(obj);

(Object.keys(obj) || []).forEach(key => {

if (typeof obj[key] === 'Object') {

deepFreeze(obj[key])

}

})

}

deepFreeze(people)

people.like.work = 'jave'

console.log(people)

```