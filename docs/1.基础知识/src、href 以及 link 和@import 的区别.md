## src 和 href 的区别  

src: source 的缩写，src 指向的内容会嵌入到文档中当前标签所在的位置，表示**引入**资源，会**替换**当前元素，用在img，script，iframe上，是页面内容不可缺少的一部分，例如: 

```js
<script src="script.js"></script>
```

href: Hypertext Reference 的缩写，表示超文本**引用**。用来建立当前元素和文档之间的链接。常用的有：link、a。例如：

```css
<link href="reset.css" rel="stylesheet"/>
```

## link 和 @import 的区别

两者都是外部引用CSS的方式，但是存在一定的区别：

* 用途: link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于CSS范畴，只能加载CSS。
* 加载时间: **link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。**
* 兼容性: link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持。
* 功能性: ink支持使用Javascript控制DOM去改变样式；而@import不支持。