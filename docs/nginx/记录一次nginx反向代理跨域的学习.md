# 什么是跨域？

跨域是因为浏览器的同源策略导致的。

> 同源策略是一个重要的安全策略，它用于限制一个 origin 的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。 -MDN

`注意：跨域问题只会在浏览器端产生。`

何为同源策略呢：简单来说就是协议，域名，端口都一致才会被认定为同源。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bfedd53898f473db3c00ac3d7340aec~tplv-k3u1fbpfcp-zoom-1.image)

## 示例

本地启动一个后台服务并编写一个简单接口，端口为 3009

```js
const koa = require("koa")
const Router = require("koa-router")
const cors = require("koa2-cors")

const router = new Router()

const app = new koa()

router.get("/cors", (ctx, next) => {
 ctx.status = 200
 ctx.body = "hello cors"
 next()
})

app.use(router.routes())
// app.use(cors())

app.listen(3009)

```

前端页面请求该接口，由于同源策略会造成跨域。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdee4e24954c494fa81aec18294f41f4~tplv-k3u1fbpfcp-watermark.image)

## 如何解决

下面说说项目中用过的方式

### 1. cors

> CORS （Cross-Origin Resource Sharing，跨域资源共享）是一个系统，它由一系列传输的 HTTP 头组成，这些 HTTP 头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应。

> 同源安全策略 默认阻止“跨域”获取资源。但是 CORS 给了 web 服务器这样的权限，即服务器可以选择，允许跨域请求访问到它们的资源。

具体来说就是设置一些 aca 响应头，通过这些参数制定浏览器与服务器之间进行交流的规则。

> Access-Control-Allow-Origin：该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个\*，表示接受任意域名的请求。  
> Access-Control-Allow-Credentials：该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。  
> Access-Control-Expose-Headers：该字段可选。指定想拿到的字段。

当前后端项目直接使用 koa-cors 中间件。

```js
const cors = require("koa2-cors")
app.use(cors())
```

控制台可以查看如下信息，成功获取接口信息。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0106d40ba8824e048d8535cc097c5d16~tplv-k3u1fbpfcp-watermark.image)

### 2. webpack 配置 proxy

大多数本地项目会才用该方式来处理开发阶段产生的跨域问题

```json
 proxy: {
     '/api/': {
        target: 'https://www.test.com', // 需要代理的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
        pathRewrite: {
            '^/api': '',
              },
        },
```

### 3. nginx 反向代理

利用 nginx 服务将请求转发到相同域名下从而解决跨域问题  
nginx 配置：

```nginx
// 在location添加一项配置
location /nginx/ {
            proxy_pass  http://127.0.0.1:3009/;  # 代理的域名
        }
```

项目中使用`/nginx/`来代理 `http://127.0.0.1:3009/`, 我这里 nginx 监听的是 8080 端口，因此请求为

```js
axios.get('http://127.0.0.1:8080/nginx/cors')
```

在这里发现了一个问题，此时控制台查看当前请求处于跨域状态

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e84566a934684814a8410e769b79c564~tplv-k3u1fbpfcp-watermark.image)
发现是因为当前接口并没有设置跨域请求头，因此需要在 nginx 配置中设置为允许跨域

```nginx
location /nginx/ {
            proxy_pass  http://127.0.0.1:3009/;  # 代理的域名
            add_header Access-Control-Allow-Origin *;
        }
```

重启 nginx 服务可成功获取接口信息

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85a04e81c13b4136a77793986ec44055~tplv-k3u1fbpfcp-watermark.image)
