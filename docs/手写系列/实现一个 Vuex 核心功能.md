```vuex```作为常用的状态管理器, 虽然用的多,但是对其中的实现一直很好奇, 下面带着自己的问题, 通过对源码的理解, 来实现一个精简版的 ```vuex```  
### 准备工作  
众所周知, ```vuex```主要包括三部分: ```state```,```mutation```, ```action```, 因此先构造这个类  
```js  
// my-vuex.js
export class Store {
	constructor(options) {
		this.state = options.state
		this.mutation = options.mutation
		this.action = options.action
	}
}
```
### 为什么每个组件都能通过 this 访问到 store 实例?  
我们在引用```vuex```的时候有一步至关重要 ```Vue.use(Vuex)```,这就是每个组件能够访问到```$store```的关键  
通过```Vue.use```插件机制, 使用```Vue.mixin```全局混入,在每个组件```beforeCreate```之前将```$store```挂载到当前实例上  
实现代码:  
```js
// my-vuex.js 
// 用来保存 Vue 实例
let Vue
export class Store {
	...
}
// 该方法会在每个 vue 实例的 beforeCreate 钩子中执行, 因此内部 this 就是 vue 实例对象
function vuexInit() {
	/** 若 options 中有 store 对象(root 实例), 则挂载到当前实例 */
	if(this.options?.store) {
		this.$store = this.options.store
	}
	
	/** 将父组件的 store 挂载到子组件中 */
	if (this.$parent?.$store) {
		this.$store = this.$parent?.$store
	}
}

export default {
	install(_Vue) {
    /** 防止被重复 Vue.use */
		if (Vue === _Vue) return
    Vue = _Vue
		
    /** 全局混入 */
		Vue.mixin({ beforeCreate: vuexInit })
	},
	Store
}
```

不出意外,引用后可以在所有组件中访问到```$store```  

### store 中的数据是怎么实现响应式:  数据更新 => 视图更新 ?  

我们都知道 ```data```中的数据是响应式的, 被更新会同步更新视图.   

通过阅读源码发现, ```store```的响应式原理就是基于```Vue```的响应式,因此这也是``` Vuex```只能在 ```Vue```的原因.  

简单来说就是将```sotre```复制到另一个```Vue```实例上的```data```中, 当```new Vue```初始化的时候, 会对 ```data``` 中的数据做劫持处理变成响应式数据, 因此```store```中的数据也具备依赖收集分发功能, 当发生变化的时候通知依赖项更新.   

代码实现如下: 在```vuexInit```方法中, 将```store```中的数据复制到另一个```Vue```实例中, 并对实例进行初始化, 对```vuexInit```方法进行补充

```js
// my-vuex.js  
...
function vuexInit() {
  /** 若 options 中有 store 对象(root 实例), 则挂载到当前实例 */
	if(this.options?.store) {
		this.$store = this.options.store
    
    /** 用 $store_vm 保存新的 Vue 实例, 该属性可以在使用 vuex 的 vue 实例上看到 */
    this.$store_vm = new Vue({
      data: {
        $$state: this.$store
      }
    })
	}
	
	/** 将父组件的 store 挂载到子组件中 */
	if (this.$parent?.$store) {
		this.$store = this.$parent?.$store
	}
}
...
```

当时对这一步我很好奇, 不同的两个```Vue```实例可以互相收集依赖吗



