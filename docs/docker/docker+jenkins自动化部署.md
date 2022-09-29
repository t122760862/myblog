## 目的  
本地搭建 `docker + jenkins` 部署系统, 通过 `github` 的 `webhook` 实现代码自动化部署.
## 准备工作
### 安装`docker`  
mac: https://docs.docker.com/docker-for-mac/install/  
windows: https://docs.docker.com/docker-for-windows/install/  
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
控制台输入 `docker search jenkins`  
![a0c208f3ba5adcb1d47e501ff33504f4.png](evernotecid://0E63FB67-60C5-41B0-A006-313E5AB2A718/appyinxiangcom/26083677/ENResource/p13)
这里我们选择安装`jenkinsci/blueocean`这个镜像,比较稳定.