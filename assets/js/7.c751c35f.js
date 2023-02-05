(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{273:function(s,e,t){"use strict";t.r(e);var r=t(13),n=Object(r.a)({},(function(){var s=this,e=s._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("p",[e("strong",[s._v("1. css加载不会影响dom树的解析")])]),s._v(" "),e("p",[e("strong",[s._v("2. css加载会阻塞dom树的渲染")]),s._v("\n可能也是浏览器的一种优化机制。因为你加载css的时候，可能会修改下面DOM节点的样式，如果css加载不阻塞DOM树渲染的话，那么当css加载完之后，DOM树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。所以我干脆就先把DOM树的结构先解析完，把可以做的工作做完，然后等你css加载完之后，在根据最终的样式来渲染DOM树，这种做法性能方面确实会比较好一点。")]),s._v(" "),e("p",[e("strong",[s._v("3. css加载会阻塞js的执行")])]),s._v(" "),e("p",[e("strong",[s._v("原因")])]),s._v(" "),e("p",[s._v("浏览器渲染的流程如下：")]),s._v(" "),e("ol",[e("li",[e("p",[s._v("HTML解析文件，生成DOM Tree，解析CSS文件生成CSSOM Tree")])]),s._v(" "),e("li",[e("p",[s._v("将Dom Tree和CSSOM Tree结合，生成Render Tree(渲染树)")])]),s._v(" "),e("li",[e("p",[s._v("根据Render Tree渲染绘制，将像素渲染到屏幕上。")])])]),s._v(" "),e("p",[s._v("根据流程可以得出：")]),s._v(" "),e("ol",[e("li",[e("p",[s._v("DOM解析和CSS解析是两个并行的进程，所以这也解释了为什么CSS加载不会阻塞DOM的解 析。")])]),s._v(" "),e("li",[e("p",[s._v("然而，由于Render Tree是依赖于DOM Tree和CSSOM Tree的，所以他必须等待到CSSOM Tree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始渲染。因此，CSS加载是会阻塞Dom的渲染的。")])]),s._v(" "),e("li",[e("p",[s._v("由于js可能会操作之前的Dom节点和css样式，因此浏览器会维持html中css和js的顺序。因此，样式表会在后面的js执行前先加载执行完毕。所以css会阻塞后面js的执行。")])])]),s._v(" "),e("p",[e("strong",[s._v("tips：")])]),s._v(" "),e("ul",[e("li",[s._v("如果页面中同时存在css和js，并且存在js在css后面，则DOMContentLoaded事件会在css加载完后才执行。")]),s._v(" "),e("li",[s._v("其他情况下，DOMContentLoaded都不会等待css加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。")])]),s._v(" "),e("p",[e("a",{attrs:{href:"https://segmentfault.com/a/1190000018130499",target:"_blank",rel:"noopener noreferrer"}},[s._v("css加载会造成阻塞吗？"),e("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=n.exports}}]);