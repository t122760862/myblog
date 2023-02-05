1. 编辑 `bash_profile` 文件
```js
vim ~/.bash_profile  
```
2. 在最后一行加上一下代码
```js
PATH=$PATH:$HOME/bin:/usr/local/nginx/sbin(本机 nginx 地址)
```
3. 重新引入
```js
source ~/.bash_profile
```

### 也可以使用软链的方式  
```js
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin/
```

使用: 
```js
./nginx -t
```

