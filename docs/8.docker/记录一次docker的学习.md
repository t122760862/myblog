# 记录一次 docker 的学习

## docker 简介

**docker**本身是由 dotCloud 公司在公司内部发起的一个项目，使用 go 语言进行编写。由于项目的火爆，在 2013 年 dotCloud 公司更名为**docker**。  
特点：

- docker 不需要进行硬件虚拟以及运行操作系统等操作，因此 docker 对系统的资源占有率很低，同时启动速度也十分迅速，可以做到秒级甚至毫秒级的启动时间，极大的提高了效率。
- docker 具有除内核外完整的运行环境，确保了运行环境的一致性，因此保证各个运行环境以及不同平台之间的表现一致性。
- 持续化部署。使用 Docker 可以通过定制应用镜像来实现持续集成、持续交付、部署。

基本概念：

- 镜像（images）: 简单来说就是一个特殊的文件系统，提供容器运行时所需的程序，库以及配置参数等资源。镜像不包含任何动态数据，构建之后也不会被改变。
- 容器（container）: 容器是镜像运行的实体，基于镜像层运行。
- 仓库（Repository）: 集中存储和分发镜像的仓库或者服务中心。最常是用的是官方的[docker hub](https://hub.docker.com/search?q=&type=image&image_filter=official)。

---

## 安装 docker

下面介绍 docker 的脚本安装方式
旧版本的 Docker 称为 docker 或者 docker-engine，使用以下命令卸载旧版本：

```
sudo apt-get remove docker \
             docker-engine \
             docker.io
```

使用脚本自动安装，由于国内的访问官方资源太慢，使用国内镜像来加快下载速度

```
// 获取docker安装脚本
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

安装完毕如可以获取版本信息则安装成功:`docker --version`  
默认情况下，docker 需要 sudo 权限才能执行大多数命令，因此可以将使用 docker 的用户加入 docker 用户组

```
// 创建docker用户组
sudo groupadd docker

// 将当前用户加入docker用户组
sudo usermod -aG docker $USER
```

---

## docker 的常用指令

启动 docker：`sudo systemctl start docker`  
获取镜像： `docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`
运行镜像：`docker run --rm --name [name] 镜像名:版本`

- `--rm`: 这个参数是说容器运行结束后删除该容器。默认情况下退出的容器为了查看日志等信息不会立即删除，使用该参数可以退出立即删除从而节省时间。
- `--name`: 为运行的容器取一个自定义的 name。

列出镜像: `docker image ls` or `docker images`  
查看镜像占用空间: `docker system df`  
删除镜像: `docker image rm [选项] <镜像1> [<镜像2> ...]` or `docker rmi [镜像名]/[id]`  
删除容器: `docker container rm [容器]` or `docker container rm -f [容器] // 删除一个运行中的容器`

- `<镜像>`: 可以是 镜像短 ID、镜像长 ID、镜像名 或者 镜像摘要
- `<短 ID>`: 一搬来说删除的时候取长 Id 的前三个字符以上，足够区分别的镜像时的 Id
