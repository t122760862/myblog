## 目的  
本地搭建 `docker + jenkins` 部署系统, 通过 `github` 的 `webhook` 实现代码自动化部署.
## 准备工作
### 安装`docker`  
mac: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)   
windows: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)  
liunx:  
```
// 推荐脚本安装方式
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```    
控制台输入 `docker -v`, 显示版本则安装成功
```
Docker version 20.10.5, build xxxxx
```  

### 安装 `jenkins`  
控制台输入`docker search jenkins`,选择安装`jenkinsci/blueocean`镜像,比较稳定.
  
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5d19c39ddc4890b015f647384f8dbc~tplv-k3u1fbpfcp-watermark.image)
控制台输入`docker pull jenkinsci/blueocean`,下载完成之后输入`docker images`看到如下信息即安装成功  
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dc12980e3504e6ead7483bd9d2bc0c9~tplv-k3u1fbpfcp-watermark.image)
## 启动 `jenkins`  
控制台输入`docker run -d --name docker-jenkins -p 8008:8080 -p 50000:50000 jenkinsci/blueocean `启动容器,启动成功会返回该容器 id  

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/195eba692c74448f8ee8c87dd9bffa0c~tplv-k3u1fbpfcp-watermark.image)
浏览器打开本地 8008 端口,正常情况下会出现解锁`jenkins`页面  

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ba192c81e004e3d8bba67882b94d4e1~tplv-k3u1fbpfcp-watermark.image)
### 获取初始化密码  
下一步需要进入容器内拿到密码,以我刚刚启动的容器为例,控制台输入`docker exec -it docker-jenkins bash`进入容易内,然后输入`cat /var/jenkins_home/secrets/initialAdminPassword`  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a4ba8a168824d21a412eb05f3a87499~tplv-k3u1fbpfcp-watermark.image)

输入控制台返回的密码进入配置页面,这里选择安装推荐的插件,可能会有安装失败的插件,重试即可  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55e0529fe5c747eba3d0f7fedb20a358~tplv-k3u1fbpfcp-watermark.image)
### 创建用户  
插件安装完成后,输入信息创建用户  

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eec1cdc0051f4fdfb6c3124ce7c8250b~tplv-k3u1fbpfcp-watermark.image)
实例配置不变继续点击下一步,此时需要重启动,重启完成登录刚刚创建的用户即可,接下来进行配置环节  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/525fa46f06d64aa1b3b2695462a6950c~tplv-k3u1fbpfcp-watermark.image) 
## 配置  
下面对 github 以及 jenkins 进行配置  
### 在容器内生成 ssh 公钥   
进入`docker-jenkins`容器内,输入`ssh-keygen -t rsa -C test@test.com`,连续回车生成公钥  

![2021-05-27 16.01.11.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00769a8c3ce4d79aa00cfd369e93490~tplv-k3u1fbpfcp-watermark.image)
### 添加公钥 ☞ github 
右上角头像 -> settings -> 左侧`SSH and GPG keys` -> New SSH key  
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/971eb16bf17d489680ebb5a29413d89b~tplv-k3u1fbpfcp-watermark.image)
title 随意, key 栏输入复制的公钥  
### 添加私钥 ☞ jenkins  
这一步需要注意,需要用刚刚生成的**私钥**创建一个 `jenkins` 凭证  
> 注意: 私钥上下的开始以及的标记内容也要一起拷贝  

首页 -> 左侧系统管理 -> Manage Credentials -> 添加凭据  

![2021-05-27 16.25.02.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/932de0a3eb1c4b7e960a0d0e2cec23e3~tplv-k3u1fbpfcp-watermark.image)  
> 注意: 类型选择 `SSH Username with private key`, 描述以及 Username 随意  
### 创建任务  
首页 -> 新建任务 -> 输入任务名称 -> 构建一个自由风格的软件项目 -> 确定  
正常情况可以看到这个页面  

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7870403280e24c7eaa2992ff7c78caf8~tplv-k3u1fbpfcp-watermark.image)
源码管理选择 Git -> 输入远程仓库地址 -> 选择之前添加的凭证 -> 分支指定 master -> 保存

![2021-05-27 16.37.30.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6e397a6cd064b54bc946e2bcf4db4b6~tplv-k3u1fbpfcp-watermark.image)  
> 注意: 这一步输入远程仓库之后会测试连接,未选择凭证会报错误信息,选择凭证后,如果配置正确,短暂的时间之后错误信息会消失,代表远程仓库连接成功.若错误信息不消失,可能会构建项目失败,需检查配置是否正确.分支信息我这里指定的 master  
### 尝试项目构建  
首页 -> 构建项目 -> 查看日志  
如果配置正确,可以看到构建完成最终的状态为: Finished: SUCCESS  

![2021-05-27 16.49.37.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdeedd479e8243089698148483c21b80~tplv-k3u1fbpfcp-watermark.image)  
进行到这一步实现了手动构建,接下来实现自动构建  
### 自动化配置    
完成自动化部署,主要是通过 `github-webhook`.简单来说就是`github-webhook`通知 `jenkins` 要进行构建了.   
引用维基百科介绍
>在web开发过程中的webhook，是一种通过通常的callback，去增加或者改变web page或者web app行为的方法。这些callback可以由第三方用户和开发者维持当前，修改，管理，而这些使用者与网站或者应用的原始开发没有关联。webhook这个词是由Jeff Lindsay在2007年在计算机科学hook项目第一次提出的。  

我的理解是类似于"发布订阅模式",`github-webhook` 发布更新, `jenkins` 监听,收到通知进行更新.无论发布或者监听,需要通过某种方式来确定彼此的身份,进行关联,因此需要对两端进行配置.   
右上角头像 -> settings -> 左侧 Developer settings -> Personal access tokens -> Generate new token  
note 随意填,勾选以下两项,点击 generate token  

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e72b08fdf454f3ca70a5924a89e3f1d~tplv-k3u1fbpfcp-watermark.image)  
注意拷贝生成的 token,离开就消失了

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/925b7a8c8fd245e4b5d41f048c799d11~tplv-k3u1fbpfcp-watermark.image)
#### 配置 github  
配置仓库的 web-hook:  
仓库首页 -> settings -> 左侧 webhooks -> add webhook  

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea055740e9554475b5561da29aeabd2c~tplv-k3u1fbpfcp-watermark.image)  
> 注意: 这里的 Payload URL只能使用公网域名,由于本次搭建的是本地 jenkins 环境,因此需要使用内网穿透工具,我用的是蜻蜓映射. 

`Payload URL`: 输入当前`jenkins`容器运行端口映射出去的公网域名 + **/github-webhook/**  
`Content type`: 选择 `application/json`  
`Secret`: 填入刚刚生成的 token
其余默认  
#### 配置`jenkins`  
首先创建一个凭证:
首页 -> 系统管理 -> Manage Credentials -> 添加凭据 -> 选择 `Secret text` 

![2021-05-27 20.33.55.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2e467d94541402785f10920537a3092~tplv-k3u1fbpfcp-watermark.image)  
然后对改凭证进行配置:  
首页 -> 系统配置 -> GitHub -> 高级 -> 覆盖 Hook URL -> 输入 web-hook 地址 -> 选中创建的凭证  

![2021-05-27 20.39.12.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d3706cd683444ba82fce2399c413782~tplv-k3u1fbpfcp-watermark.image)  
完成配置后,代码仓库更新之后 `jenkins` 会自动进行构建  
#### 打包项目
项目代码需要打包之后才能被正确使用,接下来在 `jenkins` 端进行代码构建操作  
首页 -> 系统管理 -> 插件管理 -> 可选插件 -> 选中 `NodeJS` 以及 `Publish Over SSH` -> 安装 -> 等待安装完成
- `NodeJS`: 代码运行环境  
- `Publish Over SSH`: 打包完成后发送到服务器
![2021-05-27 19.11.06.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c40d27ad61e745779f934d701527e128~tplv-k3u1fbpfcp-watermark.image)  
##### 拉取代码进行打包  
首先配置全局 `NodeJS` 插件:  
首页 -> 系统管理 -> 全局工具配置 -> NodeJS -> 新增  
![2021-05-27 19.18.15.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9027c9a07e3c41f9acaf9b0721b02c89~tplv-k3u1fbpfcp-watermark.image)  
构建项目中新增 `NodeJS` 构建环境:  
项目配置 -> 构建环境 -> 选择刚刚配置的 node 环境 -> 构建 -> 执行 shell -> 安装依赖 -> 打包 -> 压缩
```
echo "hello world"
npm install
npm run build
cd dist
tar zcvf dist.tar.gz ./*
```
![2021-05-28 10.29.59.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40316ff0ffa54f2f88d6c1d917a7ea6d~tplv-k3u1fbpfcp-watermark.image) 

配置完之后手动点击构建,查看日志查看构建状态,操作成功可以进到 ` docker-jenkins`容器内部检查 `dist.tar.gz` 文件是否存在  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1761318c06314468a50bc72b1c0a31d4~tplv-k3u1fbpfcp-watermark.image)
#### 发送到服务器  
##### 全局配置 `publish over ssh` 插件  
首页 -> 系统管理 -> 系统配置 -> Publish over SSH -> SSH Servers  
![2021-05-28 15.19.21.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/058b22db52ff4d169e355b4e34473e53~tplv-k3u1fbpfcp-watermark.image) 
这里我是用的是用户密码登录,也可使用 ssh 的方式连接服务器.输入完毕可以进行连接测试  
##### 项目中配置
项目配置 -> 构建后操作 -> SSH Server -> Transfers  
```
Source files: 发送的文件(相对路径为当前项目路径)
Remove prefix: 要去掉的前缀
Remote directory: 远端服务器目录(不存在会报错)
Exec command: 发送成功之后要在服务器进行的脚本操作,如:解压,删掉多余的文件
```
![2021-05-28 15.33.04.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc237c072469495188c4465395044c07~tplv-k3u1fbpfcp-watermark.image)
贴上脚本代码  
```
cd 文件发送的目录
tar zxvf dist.tar.gz
rm -rf dist.tar.gz
```  
最后尝试推送代码,验证自动化构建部署~  

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d508523c7f65467faf3e769a068ec3aa~tplv-k3u1fbpfcp-watermark.image)
正常情况下服务器上会收到发送的文件,到这一步本地全自动构建成功啦