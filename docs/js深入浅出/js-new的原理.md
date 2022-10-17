## `new` 的过程

* 创建一个空对象

* 将该对象的 `this` 指向构造函数

* 执行构造函数给 `this` 赋值

* 返回结果

a. 如果构造函数返回一个对象，则返回该对象

b. 如果构造函数返回一个基础类型的值或者不返回，则返回创建的对象

```js

function myNew(){

// 获取构造函数以及参数

const con = [].shift.call(arguments)

// 将创建的对象原型指向构造函数的prototype （其实就是成为构造函数的实例）

const obj = Object.create(con.prototype)

// 以创建的对象作用域执行构造函数,给 this（obj）赋值

const result = con.apply(obj, arguments)

// 返回结果

return result instanceof Object ? result : obj

}

function Fn(color) {

this.color = color

return {

name: '无来'

}

}

function Fn1(color){

this.color = color

}

const fn = myNew(Fn, 'red')

console.log(fn.color) // undefined

console.log(fn.name) // 无来

const fn1 = myNew(Fn1, 'black')

console.log(fn1.color) // black

console.log(fn1.name) // undefined

```