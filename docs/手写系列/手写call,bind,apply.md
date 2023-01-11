 ## apply以及call的实现
### 作用  
显示改变函数 `this` 的指向
### 共同点  
* `apply` 跟 `call` 使用的时候都会执行一次函数  
### 不同点
* `appy` 接受一个数组作为参数
* `call` 接受单个的参数  
#### call的实现  
分析：`call` 的作用在于改变函数的 `this` 并执行一次该函数
* 1. 改变函数的 `this`
* 2. 执行该函数  


尝试：将函数添加到被绑定的对象里，然后在绑定的对象里运行函数，最后删掉该函数  
```js
const obj = {
    name: '无来'
}

function fn() {
    console.log(this.name)
}
Function.prototype.call2 = function(context) {
    context.fn = this  // obj.fn = fn
    context.fn()    // obj.fn()
    delete context.fn
}

fn.call2(obj)   // 无来
```  
不足：无法接受参数  
尝试：接受参数并传递给函数执行  
```js
const obj = {
    name: '无来'
}

function fn(age, color) {
    console.log(this.name)
    console.log({ age, color })
}
Function.prototype.call2 = function() {
    const args = Array.from(arguments)
    const context = args.shift()
    context.fn = this  // obj.fn = fn
    
    context.fn(...args)    // obj.fn()
    delete context.fn
}

fn.call2(obj, 28, 'black')   // 无来 \n { age: 28, color: black }
```  

`call` 对于不同的 `this` 类型有不一样的细节  
* 1. `this` 参数可以传 `null` 和 `undefined`，此时指向 `window`
* 2. `this` 参数可以传基本类型，原生的 `call` 会用 `object()` 转换  
* 3. 函数可以有返回值  
```js
const obj = {
    name: '无来'
}

var name = 'global'  //  不用var无法把变量挂载到window

function fn(age, color) {
    console.log(this.name)
    console.log({ age, color })
}
Function.prototype.call2 = function() {
    const args = Array.from(arguments)
    let context = args.shift()
    context = context ? (typeof context === 'Object' ? context : Object(context)) : window
    
    context.fn = this  // obj.fn = fn
    
    const result = context.fn(...args)    // obj.fn()
    delete context.fn
    return result
}

fn.call2(obj, 28, 'black')   // 无来 \n { age: 28, color: black }
fn.call2(undefined, 28, 'balck')    // global \n { age: 28, color: black }
```  
牛逼！！！  
#### apply 的实现  
`apply` 跟 `call` 唯一的区别在于接收参数的不同，`apply` 接收一个数组  
```js
Function.prototype.apply2 = function () {
  const args = Array.from(arguments)
  let context = args.shift()

  context = context ? Object(context) : window
  context.fn = this

  let result
  if (Array.isArray(args[0])) {
    result = context.fn(...args[0])
    delete context.fn
    return result
  }
}

fn.apply2(obj, [28, 'black'])
```  
#### bind 的实现  
特性：  
* 1. 调用者不是函数会返回错误
* 2. 可以指定 `this`
* 3. 可以接收参数  
* 4. 返回一个函数
* 5. curry
* 6. 返回的函数被当成构造函数时，this 指向调用者  
```js
const obj = {
    name: '无来'
}

function fn(age, color){
    console.log(this.name)
    console.log(age, color)
    this.movie = 'movie'
}

Function.prototype.bind2 = function() {
    if (typeof this !== 'function') throw('xxx')
    
    const args = Array.from(arguments)
    const context = args.shift()
    const that = this
    
    const BindFn = function() {
        return that.apply(
            this instanceof BindFn ? that : context, // 如果返回的函数被当成构造函数，this指向调用函数
            args.concat(...arguments)
            )
    }
    
    BindFn.prototype = Object.create(this.prototype) // 返回函数被当成构造函数时，将实例的原型指向调用函数
    
    return BindFn
}
const fn1 = fn.bind2(obj, 28)
fn1('black')    // 无来 28 black
fn1.movie   // undefined

const fn2 = new fn1('red') // undefined 28 red  
console.log(fn2.movie)   // movie

```
