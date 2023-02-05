## 使用动态插槽封装一个超级灵活的表格通用组件！  
使用vue封装组件的时候，常常怀念react灵活的render函数（也常常让我怀疑vue的灵活性），毕竟想怎么传就怎么传！  
最近突发奇想，vue是否也能实现类似的功能？  

答案是肯定的！
使用动态插槽提供类似render函数的效果另辟蹊径。

### 目标  
本文使用`vue2 + elementUI`， 实现一个可复用且支持拓展的通用表格组件
* 根据配置文件快速生成表格
* 使用动态插槽定制化表头 or 列内容

#### 如何根据配置文件快速生成表格？ 
掏出事先准备好的演示数据  
```json
  tableData: [
        {
          date: "2012年5月4日",
          name: "复仇者联盟1",
          productor: "乔斯·韦登",
          role: "小罗伯特·唐尼"
        },
        {
          date: "2013年5月4日",
          name: "复仇者联盟2",
          productor: "乔斯·韦登",
          role: "中罗伯特·唐尼"
        },
        {
          date: "2014年5月4日",
          name: "复仇者联盟3",
          productor: "乔斯·韦登",
          role: "大罗伯特·唐尼"
        }
      ]
```
观察 `el-table` 组件，不难发现该组件主要由表头名`label`，对应的列内容字段名`prop`以及一些额外的参数构成，因此可以把这些数据抽象到一个数组对象中  
```js
export const TABLE_COLUMNS_MAP = [
  { label: "名称", prop: "name" },
  { label: "导演", prop: "productor" },
  { label: "主演", prop: "role" },
  { label: "上映日期", prop: "date", width: "200", sortable: true }
]
```
组件内部使用循环遍历该数据结构，渲染表格所包含的内容  
> 可以使用 ```v-bind="{...item}"``` 利用扩展运算符进行批量赋值
```html
  <el-table :data="tableData">
    <el-table-column
      v-for="item in TABLE_COLUMNS_MAP"
      v-bind="{ ...item }"
      :key="item.prop"
    />
  </el-table>
```
到这一步已经实现最简单的表格组件  
![07121e73bf314feeff0d04e09a64d752.png](evernotecid://0E63FB67-60C5-41B0-A006-313E5AB2A718/appyinxiangcom/26083677/ENResource/p121)  

### 结合动态插槽实现高度灵活  
你永远想不到产品会给你提什么需求，就好像不会知道会给表格加什么东西进去。

>1. 产品说要在上映日期表头名称旁边加一个 ```tooltip```, 悬浮的时候显示 ‘大陆上映日期’
>2. 产品说要在主演那里显示中文名和英文名  

很明显，简单的表格组件已经不能满足产品的需求，那么我们应该怎么做才能既保证组件的通用性，又能兼顾灵活呢？

答案：使用动态插槽，拥抱一切变化~    
**我们可以根据传入的配置文件，预先定义每个表头以及表列的插槽，支持定制化内容，同时设置后备默认内容应对常规场景。**

#### 定义表头插槽  
1. 根据配置文件，定义对应表头插槽，这里取插槽名为`th-参数`  

```html
<template>
  <el-table :data="tableData">
    <el-table-column
      v-for="item in TABLE_COLUMNS_MAP"
      v-bind="{ ...item }"
      :key="item.prop"
    >
      <slot :name="`th-${item.prop}`" />
    </el-table-column>
  </el-table>
</template>
```
2. 这里我们定义的插槽所处的位置为`el-table-column`默认插槽的表列环境，因此需要移入表头位置，使用组件提供的`header`插槽  
```html
<template>
  <el-table :data="tableData">
    <el-table-column
      v-for="item in TABLE_COLUMNS_MAP"
      v-bind="{ ...item }"
      :key="item.prop"
    >
      <template v-slot:header>
        <slot :name="`th-${item.prop}`" />
      </template>
    </el-table-column>
  </el-table>
</template>
```
3. 提供后备内容来应对常规场景   

> 使用作用域插槽，根据参数提供默认的数据  
> 需要注意的是，列的信息在`scope.column`中 
```html
<template>
  <el-table :data="tableData">
    <el-table-column
      v-for="item in TABLE_COLUMNS_MAP"
      v-bind="{ ...item }"
      :key="item.prop"
    >
      <template v-slot:header="scope">
        <slot :name="`th-${item.prop}`"> {{ scope.column.label }}</slot>
      </template>
    </el-table-column>
  </el-table>
</template>
```
到这一步完成了表头的实现，试试满足产品的要求~  
业务组件使用表头的自定义插槽，添加`tooltip`提示  
```html
<Table>
      <template v-slot:th-date>
           上映日期<el-tooltip content="大陆上映日期" placement="top"><i class="el-icon-warning" /></el-tooltip>
      </template>
 </Table>
```
结果如下，自定义了日期表头，符合预期~  
![](https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/202210171736146.png)

#### 定义表列插槽   
表列插槽跟表头插槽道理是一样的，这里就不展开说了，代码如下：  
```html
<template>
  <el-table :data="tableData">
    <el-table-column
      v-for="item in TABLE_COLUMNS_MAP"
      v-bind="{ ...item }"
      :key="item.prop"
    >
      <template v-slot:header="scope">
        <slot :name="`th-${item.prop}`"> {{ scope.column.label }}</slot>
      </template>
      <template v-slot:default="scope">
        <slot :name="`td-${item.prop}`" :scope="scope">
          {{ scope.row[item.prop] }}
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>
```
***需要注意的是表列的作用域为`scope.row`***  

### 总结&感想  
* 技术还是原来的技术，动态插槽以及作用域插槽只是换了一种运用的方式  
* 有时候限制我们的不是技术，可能是自己的思维，思维打开，同样的东西或许有不一样的玩法

保持好奇，保持思考，你所走的每一步都会让你离你的目标更近。