![](https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/202210171511053.png)

### Object.prototype === object.\_\_proto\_\_

1. 每个函数都有一个 `prototype` 属性，指向它实例的原型

2. 每个对象都有一个 `_proto_` 属性，指向它的原型

### Function.prototype === Function.\_\_proto\_\_

* `Function` 本身是个函数，而所有函数都是 `Function` 的实例，因此`Function._proto_ === Function.prototype`

### Object\_\__proto_\_\_ === Function.prototype

* `Object` 是一个函数，而所有函数都是 `Function` 的实例，因此 `Object._proto_ === Function.prototype`

###  Object.\_\_proto\_\_ === Function.\_\_proto\_\_

```js

Object.getPrototypeOf(Function) === Function.prototype

Object.getPrototypeOf(Object) === Object.getPrototypeOf(Function)

```