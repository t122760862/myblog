# vue 深入浅出 - watch 的实现原理  

## 灵魂三问  

你是否有以下疑问： 

1. ```data```里的变量改变之后会执行```watch```内同名变量内的方法, 他们是怎么绑定的?  
2. ```watch```内的配置项: ```immediate```及```deep```是怎么实现的?  
3. ```watch```函数回调 ```value```及```oldValue```是怎么获取的?

## 简介  

官网介绍如下:  

> 通过 watch 选项提供了一个更通用的方法，来响应数据的变化。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。  

一般来说某个业务需要在某个数据变化时去执行, 这种场景可以使用```watch```  

```watch```具有两个配置项: ```immediate```和```deep```   
```immediate```表示声明时立即执行一次.  
```deep```表示追踪深层次的更新:  由于对象的值是引用值, 若内部某个属性变化,引用值不会发生改变, ```deep```的设计就是为了解决这个问题

### 声明方法: 选项声明以及命令式的 api   

从源码中发现, ```watch```的声明可以是一个字符串映射到```method```内的方法, 也可以是数组来绑定多个方法, 当数据变化的时候按顺序执行.
使用 ```Vue``` 内的 ```watch```选项:  

```js
watch: {
  // 如果声明的是一个数组, 将数据更新时按顺序执行里面的方法
  firstName: [
    function (val) {
      console.log(val, "默认写法");
    },
    // 可以传入 methods 内定义的同名方法
    "firstNameChange",
    // 对象式的写法, 可以添加配置项
    {
      handler: function (val) {
        console.log(val, "对象写法");
      },
      deep: true,
      immediate: true,
    },
  ],
},
```

使用命令式 api:  

```js
this.$watch('firstName', console.log, {deep: true, immediate: true})
```

两者比较:  
选项式的写法可以传入一个数组, 数据更新执行多个方法  
命令式的写法则比较灵活, 可以动态的去创建  

## 实现原理  

由于选项式的声明方式本质上就是使用命令式api声明, 因此以选项式声明为例.
简单的介绍一下选项式```watch```的实现原理:  
```initState``` => ```initWatch``` =>  ```createWatcher``` => ```Vue.$watch``` => ```new Watcher()``` => ```this.get()```进行依赖收集 => 数据更新(```watcher.update```) => ```invokeWithErrorHandling```执行声明时的方法  
详细步骤如下:  

 ### initWatch 初始化 watch 选项  

  ```initState```时若发现```watch```的选项式写法会执行```initWatch(options.watch)```方法对其进行初始化  
```watch```声明时可以是一个数组, 若传入的是一个数组, 则遍历数组的每一项进行处理. 否则只需要处理一次  

```js  
// src\core\instance\state.js
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    /** watch 可以使用数组的写法, 触发多个函数, 因此需要为每一项都进行处理 */
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```

### createWatcher 统一输出

```createWatcher```方法主要有三个作用:  

1. 处理对象声明的写法, 统一```handler``` 执行函数的值  
2. 处理字符串声明的写法, 将 ```methods```中同名方法赋给 ```handler```  
3. 统一数据之后传给 ```vm.$watch```

```js  
// src\core\instance\state.js
/** 该方法主要目的是为watch的回调创建一个userWatcher */
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  /** 处理对象的写法, 如 watch: {handler: function() {}, deep: true, immediate: true} */
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  /** 可以传入methods中定义的方法 */
  if (typeof handler === "string") {
    handler = vm[handler];
  }

  /** 
   * 本质上是调用 Vue 实例上的 $watch. 跟 this.$watch 一样 
   * 这里的 expOrFn 是 initWatch 中传入的 key, 其实就是声明时取的名称
   * handler 是声明时定义的方法, 即改变后要执行的函数
   * options 为一些配置项, 如 deep, immediate
   * */
  return vm.$watch(expOrFn, handler, options);
}
```

可以看出最后调用```vm.$watch```, 本质上**选项式的写法内部实现也是使用命令式的api方式**  

### vm.$watch 创建 **userWatcher**  

这一步至关重要, 主要干了这几件事:  

1. 使用传入的参数创建```userWatcher```
2. 执行依赖收集系统, 将创建的```userWatcher```向依赖的数据进行订阅  
3. 实现了```immediate```立即执行功能, ```invokeWithErrorHandling```包装函数执行声明时的方法   
4. 实现了```deep```功能

```js
// src\core\instance\state.js 
/** 给 Vue 实例挂载 $watch 方法, 可以通过 this.$watch 访问 */
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this;

    /** 若在this.$watch 中使用对象的写法, 将重新解析再执行 */
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
     /** 标识符 userWatcher, 表示用户定义的 */
    options.user = true;

    /** 本质上也是创建一个 Watcher, 此时expOrFn是声明时传入的依赖名, cb是声明时的方法, options是声明时的参数 */
    const watcher = new Watcher(vm, expOrFn, cb, options);

    /** 如果配置了 immediate 属性则立即执行一次声明时的方法 */
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`;
      pushTarget();
      /** 1.invokeWithErrorHandling 是一个通用异常包装函数, 执行cd函数, 若有异常则捕获并向上通知到全局
       *  2.可处理生命周期, 事件等回调函数的异常捕获
      */
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
      popTarget();
    }

    /** 卸载当前watch */
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
```

如果配置了```immediate = true```, 会立即执行, ```invokeWithErrorHandling```是 ```vue```一个通用异常包装函数, 在这里可以简单理解为执行一次声明```watch```时传入的方法. **这一步是实现```immediate```的原理**

上面说到这一步进行了依赖收集(依赖收集有不懂的可以看[[这篇文章](https://github.com/t122760862/blog/issues/1)](https://github.com/t122760862/blog/issues/1)), 核心在于 ```new Watcher```内部:   

```Watcher```内部有这样一段代码:  

```js 
// src\core\observer\watcher.js
/** 判断传入的 expOrFn 是不是函数, 若是函数直接赋值给 this.getter */
if (typeof expOrFn === "function") {
  this.getter = expOrFn;
} else {

  /** 
   * 如果不是函数, 则为userWatcher传入的字符串, 则 this.getter 为 parsePath 返回的方法
   * parsePath 主要用来解析, 声明是有可能传入 'data.obj.name' 类似的值, 则最终的结果应该是 name 的值  
   * 在执行这一步的过程中, 因为访问到了data内部的响应式数据, 因此会进行依赖收集, 此时的Dep.target为该userWatch,收集者为当前响应式数据
   */
  this.getter = parsePath(expOrFn);
  // ...
}
 // 通过this.get来触发this.getter
this.value = this.lazy ? undefined : this.get();  

// get方法  
get() {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      /** 执行上面定义的this.getter, 其实就是parsePath(expOrFn)返回的方法 */
      value = this.getter.call(vm, vm);
    } catch (e) {
      // ...
    } finally {
      /** 对数组和对象进行深层次的追踪, 本质上就是对每一个属性进行订阅 */
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }
```

当 ```new Watcher```时传入的```expOrFn```不是方法时, 将触发 ```parsePath(expOrFn)```方法, 该方法其实就是获取```data[expOrFn]```的值. 当给```this.value```赋值时会执行此方法从而触发依赖收集(因为触发了响应式数据的```getter```)  

可以看到代码中有判断```this.deep```, 这里是实现```deep```的原理, 核心在于```traverse```方法:  

```js
// src\core\observer\traverse.js
export function traverse (val: any) {
   /** 其实是执行_traverse方法 */
  _traverse(val, seenObjects)
  seenObjects.clear()
} 

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  // ...
  
  /** 对数组进行深度追踪, 遍历后分别执行 */
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    /** 若果不是数组, 则递归访问val中的每一个对象, 触发依赖收集, 实现deep的深层次追踪. 本质上就是对当前watcher递归的向val中每个属性进行订阅 */
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

不难看出, **```deep```的实现就是将传入的```value```下的每个属性都访问一遍, 从而触发依赖收集系统, 将当前```watcher```收集到被访问数据的订阅者列表中. 当数据被更新时, 进行发布**.  

### 数据更新触发watch声明时的方法  

当依赖的数据更新时, 执行```dep.notify```, 所有的订阅者执行```watcher.update```方法, 本质上就是执行```watcher.run```方法, 本文只介绍```userWatcher.run```  

```js
// src\core\observer\watcher.js
  run() {
    /** 是否活跃, 卸载之后该值为false, 将不执行 */
    if (this.active) {
      /** this.get 其实就是执行this.getter也就是上面定义的parsePath(expOrFn), 作用为获取data[expOrFn]的值, 这里就是获取最新的值 */
      const value = this.get();
      if (
        value !== this.value ||
        isObject(value) ||
        this.deep
      ) {
        /** 先拿到上一次的值 */
        const oldValue = this.value;
        /** 更新最新的值 */
        this.value = value;
        /** 执行用户定义watch时声明的方法 */
        if (this.user) {
          const info = `callback for watcher "${this.expression}"`;
          invokeWithErrorHandling(
            /** 声明时传入的方法 */
            this.cb,
            this.vm,
            /** 声明时传入的值, 这里也是为什么新值在前, 旧值在后的原因 */
            [value, oldValue],
            this.vm,
            info
          );
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  }
```

当数据更新后, 使用```this.get```获取最新的值, 由于还没有给```this.value```赋最新值, 因此可以通过```this.value```获取更新前的值.然后再执行之前介绍的包装函数```invokeWithErrorHandling```触发声明时的方法  

### 总结  

1. 在```createWatcher```中对于不同的声明方式中进行统一处理, 执行```vm.$watch(expOrFn, handler, options)```  

2. 在```vm.$watch```中创建```userWatcher```,   

   * 通过```this.get```获取```data[expOrFn]```的值, 从而触发响应式系统, 进行依赖收集, 此时的```Dep.target```为当前```userWatcher```
   * 若声明时有```immediate```配置项为真, 则执行包装函数```invokeWithErrorHandling```触发声明时的方法    
   * 若声明时有```deep```配置项为真, 则执行```traverse(value)```方法, 对```value```内部的每个属性进行访问, 触发响应式系统进行依赖收集, 此时的```Dep.target```为当前```userWatcher```

3. 数据更新后, 触发订阅发布, 触发订阅者的更新方法, 对于```userWatcher```其实就是执行```invokeWithErrorHandling```包装函数  

   * 通过```this.value```获取更新前的值  
   * 通过```this.get```获取最新的值. 本质上就是调用```parsePath(expOrFn)```  
   * 更新```this.value```为最新的值  

至此所有问题已经得到答案~