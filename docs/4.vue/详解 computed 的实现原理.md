## 灵魂三问

带着问题看源码：

1.  `computed` 是如何实现缓存的？
2.  `computed` 是如何收集依赖数据的？
3.  `computed`依赖数据更新之后是如何更新视图的？

## 简介  

相信```computed```都用过.那么,知其然知其所以然?

### 定义

`computed` 是 `vue` 中的计算属性, 根据依赖关系进行计算并缓存, 只有当依赖被改变的时候才会更新

`computed` 一般用于一些复杂的场景, 如受多个数据共同影响的场景

### 用法

`computed` 有两种用法

一种是常规的函数写法, 默认使用 `getter`

```js
computed: {

  getName() {

    return `${this.firstName}-${this.lastName}`

  }

}

```

其实还可以使用对象的写法, 设置 `computed` 的 `getter`, 当值被修改的时候同时修改依赖的属性

```js
computed: {

  getName: {

    get() {

    return `${this.firstName}-${this.lastName}`;

    },

    set(val) {

        const [first, last] = val.split("-");
    
        this.firstName = first;
    
        this.lastName = last;

    },

  },

},

```

下面跟着源码直接进入正题

## 初始化过程

`new Vue(computed)` => `initState` => `initComputed` => `defineComputed[key]` => `createComputedGetter` =>`mountComponent`

大致介绍一下整个流程:

1.  首先在 `initState` 中对传入的 `computed` 进行初始化
2.  初始化的过程中, 为每一个声明的 `computed`创建 `Watcher`, 将声明时传入的函数(或者对象声明的 `get`) 传递给创建的`Watcher`用于被访问时执行,利用 `defineProperty` 将声明的 `computed` 代理到 `vm` 实例上, 从而跟 `data` 一样可以通过 `this` 来访问, **同时用一个函数包装`computed`的`getter`(实现缓存的关键)** , 当`computed`被访问时将执行该函数, 判断是否使用缓存值
3.  初始化结束之后会执行 `vm.$mount`, 对视图进行渲染, 渲染过程中会执行 `vm._render` 生成 `vnode` 由于解析到 `{{computed}}` 会触发之前劫持的 `getter`, 从而执行声明`computed`时的函数
4.  执行声明时传入的函数时, 由于初始化`dirty=true`, 因此会去获取最新值, 此时会触发其所引用的`data`中数据的`getter`, 从而触发响应式系统的依赖收集.**由于此时的 `Dep.target`为该`computerWatcher`**, 因此会收集该`computerWatcher`为依赖项
5.  当`computed`依赖的数据被更新时, 会进行消息分发,执行`watcher.update()`, 若`watcher`为`computedWatcher`则将`dirty`标记为`true`, 当前订阅的`computed`被访问时, 触发之前被函数包装的`getter`, 函数内部识别到`dirty===true`则获取最新值, 获取完之后接着将`dirty`置位`false`. **由于被依赖的数据订阅者中还有用于视图更新的`renderWatcher`, 因此会接着对视图更新从而渲染最新数据, 这也说明 `computedWatcher` 要在 `renderWatcher`之前去更新**

主要代码如下:

### initComputed => 创建 computedWatcher

1.  在`Vue`实例上挂载`_computedWatchers`属性用来存放所有`computedWatcher`
2.  为每一个计算属性创建`computedWatcher`
3.  使用`defineComputed`处理定义的每个`computed`

```js
// src/core/instance/state.js  
function initComputed(vm: Component, computed: Object) {
  /** 在vm实例上挂载 _computedWatchers 属性存放 computerwatcher */
  const watchers = vm._computedWatchers = Object.create(null)
  /** 判断是否服务端 */
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    /**
     * 1. 判断 computed 属于默认函数写法,还是对象写法  
     * 2. 如果是对象写法则将定义的 get 赋值给 getter
     */
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    if (!isSSR) {
      /** 可以看出本质上 computed 就是一个 watchers 数组, 每一个定义的 computed 都是一个 watcher(computedWatcher) */
      watchers[key] = new Watcher(
        vm,
        /** 将之前申明的 getter 传入 watcher 的 expOrFn, 当 dep.notify 的时候将会执行 */
        getter || noop,
        noop,
        /** computed 实现缓存关键, 值为上面定义的 { lazy: true } */
        computedWatcherOptions
      )
    }

    /** 判断是否有重复的申明 */
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // ...
    }
  }
}
```

### defineComputed => 劫持 getter, 实现缓存

1.  使用`Object.defineProperty`将计算属性挂载到 `vue` 实例上, 使其可以通过 `this` 访问
2.  使用 `createComputedGetter` 包装计算属性的`getter`函数, 当计算属性被访问的时候执行.通过`dirty`变量标记是否去获取最新数据

```js
// src/core/instance/state.js
export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  /** 判断 computed 属于函数式写法还是对象写法, 目的是拿到其执行函数 */
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    // ...
    }
  /** 挂载到 vue 实例, 通过 this 可以访问 */
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      /** 如果"脏了", 表示依赖数据被更新, 则需要获取最新数据 */
      if (watcher.dirty) {
        /** 
         * 1. 本质是调用创建 computedWatcher 时, 传入的方法即定义 computed 时写的方法, 从而更新 Watcher 的 value 为最新值 
         * 2. 获取数据之后, 同时将 dirty 置位 false, 进行缓存
         * */
        watcher.evaluate();
      }

      /** 如果有依赖正在收集, 则将该 watcher 下所有发布者添加到正在收集依赖的 watcer 发布者列表里 */
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

这里注意一下有这样一步`watcher.depend()`, 目的是将该 `computedWatcher`的发布者添加到当前正在收集依赖的`Watcher`.

首先初次渲染页面时, 由`renderWatcher`进行依赖收集, 当解析模板发现`{{computed}}`时, 触发计算属性的 `getter`, 执行 `watcher.get`,此时会将当前`watcher`压入`targetStack`依赖收集栈, 同时执行`Dep.target = target`.即将此时进行依赖收集的`renderWatcher`修改为当前`computedWathcer`. 执行计算属性定义函数时,访问到依赖数据,触发响应式系统将`Dep.target`加入订阅者`subs`列表中.依赖收集完毕,执行`popTarget()`弹出收集栈,此时`Dep.target`修改为之前的`renderWatcher`

因此`watcher.depend()`的最终目的就是将`computedWatcher`的发布者添加到`renderWatcher`的发布者列表中, 如果不执行这一步, 计算属性所依赖的属性修改之后,不会触发视图更新, 因为有可能`template`中只引用了计算属性而没有引用计算属性内部依赖的数据, `renderWatcher`并没有对依赖数据进行订阅.

### 数据更新

当计算属性依赖数据被更新时, 会触发响应式数据的`setter`, 执行`dep.notify`对所有订阅者进行订阅发布

当订阅者为`computedWatcher`时, 将内部的`dirty`置为`true`

当订阅者为`renderWatcher`时, 执行`vm._update(vm._render)`更新视图.扫描数据的同时, 访问到计算属性, 则会执行之前`createComputedGetter`包装的`getter`函数, 由于当前`computedWatcher`内部的`dirty`已经在上一步被标记为`true`, 因此会刷新`watcher.value`, 刷新之后将`dirty`置为`false`. 若`dirty`为`false`, 则直接获取`watcher.value`  

```js
// src/core/observer/watcher.js
  update() {
    /* 如果this.lazy为true, 说明是 computedWatcher, 通过dirty标记为有更新, 当下一次 computed 被访问的时候, 识别到该字段则会进行数据更新 */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
```

## 总结

回顾一下之前的问题:

1.  `computed` 是如何实现缓存的？

答: 通过`createComputedGetter`包装计算属性的`getter`,使用`dirty`标记所依赖的数据有没有更新, 若更新则刷新数据,否则直接返回`watcher.value`

2.  `computed` 是如何收集依赖数据的？

答: `computed`本质上就是一个`watcher`, 在执行`watcher.get`时会访问到计算属性所依赖的数据,触发依赖收集系统. 此时的订阅者`Dep.target`为该`coomputedWatcher`, 订阅方为所有依赖数据.

3.  `computed`依赖数据更新之后是如何更新视图的？

答: 当`computed`内部依赖数据进行依赖收集的之后, 会将当前`renderWatcher`也加入到订阅队列中, 即依赖数据更新后先触发`computedWatcher.update`的, 然后触发`renderWatcher.update`更新视图