最近的开发中遇到遇到一个`samesite`的问题，记录一下解决的过程。  
事情是这样的：当前拥有一个系统，该系统用两个域名来区分海外和中文环境（这里用a.demo.com和a.demoEn.com来代替，后台接口地址为c.demo.com）。当用户请求登录之后，服务器会在c.demo.com地址设置cookie来保存用户的登录态。理应来说用户在任何一个环境登录成功，另外的环境应该具有相同的登录状态。问题来了，chrome浏览器表现正常，safari浏览器会出现a.demoEn.com环境无法登陆的情况。通过相关资料发现跟`sametite`有关系。  

因为`samesite`属于cookie的一个属性，简单回忆一下cookie。组成:  
```
name: 名称
value: 值
domin: 域，
path: 路径，一定要包含改路径才能携带cookie
Expires/Max-Age: 过期时间，默认不设置为session会话级别，页面关闭失效
httpOnly: bool类型，设为true不允许浏览器访问
secure: 该标记只能通过https协议发送给服务端
samesite: 限制第三方cookie
```

本文主要介绍`samesite`。chrome 51 开始，浏览器的cookie新增了一个`samesite属性`，用来做一些cookie的限制策略。这个属性可以有三个值:
```
Strict: 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致  
Lax: 允许部分第三方请求携带 Cookie
None: 无论是否跨站都会发送 Cookie
```  
chrome在2020年2月更新之前默认值为none，chrome80后默认为Lax。  

这里套用大佬的话解释下跨站和跨域的区别：
>首先要理解的一点就是跨站和跨域是不同的。同站(same-site)/跨站(cross-site)」和第一方(first-party)/第三方(third-party)是等价的。但是与浏览器同源策略（SOP）中的「同源(same-origin)/跨域(cross-origin)」是完全不同的概念。</br>
>同源策略的同源是指两个 URL 的协议/主机名/端口一致。例如，https://www.taobao.com/它的协议是 https，主机名是 www.taobao.com 端口是 443。</br>
>同源策略作为浏览器的安全基石，其「同源」判断是比较严格的，相对而言，Cookie中的「同站」判断就比较宽松：只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。</br>
>举几个例子，www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。

默认值从None变为Lax的区别：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8425081875a6447dbb232ea656a9adfb~tplv-k3u1fbpfcp-zoom-1.image)  
***
回到之前的问题，跨站请求时设置了samesite后chrome表现正常，safari却不能正常登录。通过资料发现原来是不同的浏览器对于samesite这个属性具有不一样的行为，以safri为例，在 MacOS 10.14 及 iOS 12 以上版本，safari会把`samesite=none`识别为`samesite=strict`，因此会出现a.demoEn.com域名无法登陆的问题，因为获取不到c.demo.com地址的cookie。详细信息[点击这里](https://www.chromium.org/updates/same-site/incompatible-clients)。
## 解决方案  
- 服务端做UA判断，检测[不兼容的浏览器](https://www.chromium.org/updates/same-site/incompatible-clients)不设置`samesite`属性。