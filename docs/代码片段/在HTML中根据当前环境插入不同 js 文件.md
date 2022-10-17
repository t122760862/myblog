## 场景  
某些场景需要根据不同的环境插入不同的 ```js``` 文件, 如 ```dev``` 环境下插入 ```a.js```, ```product``` 环境下插入 ```b.js```  
## 答案  
网上没找到这种写法的名称, 有的说的 ```ejs```, 有的说是 ```django```  
```js
 <% if (process.NODE_ENV === 'dev') {%>
    <!-- a.js -->
    <script src="./a.js"></script>
<% } else if (process.NODE_ENV === 'production')  { %>
    <!-- b.js -->
    <script src="./a.js"></script>
<% } %>
```

