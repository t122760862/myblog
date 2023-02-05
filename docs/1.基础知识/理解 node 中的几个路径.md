## path.join  

官网介绍如下:  

> `path.join()` 方法使用平台特定的分隔符把全部给定的 `path` 片段连接到一起，并规范化生成的路径。
>
> 长度为零的 `path` 片段会被忽略。 如果连接后的路径字符串是一个长度为零的字符串，则返回 `'.'`，表示当前工作目录。

示例:  

```js	
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'
// 分析: /foo -> /foo/bar -> /foo/bar/baz/asdf -> /foo/bar/baz/asdf/quuex -> /foo/bar/baz/asdf

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

## path.resolve  

官网介绍如下:    

>`path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径。
>
>给定的路径的序列是从右往左被处理的，后面每个 `path` 被依次解析，直到构造完成一个绝对路径。 例如，给定的路径片段的序列为：`/foo`、`/bar`、`baz`，则调用 `path.resolve('/foo', '/bar', 'baz')` 会返回 `/bar/baz`。
>
>如果处理完全部给定的 `path` 片段后还未生成一个绝对路径，则当前工作目录会被用上。
>
>生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。
>
>长度为零的 `path` 片段会被忽略。
>
>如果没有传入 `path` 片段，则 `path.resolve()` 会返回当前工作目录的绝对路径。   

简单理解的话可以当成 ```cd```操作

示例:  

```js
// 假设当前路径为 /test
path.resolve('a', 'b', 'c')  // '/test/a/b/c'
// 分析:  test/a -> test/a/b -> test/a/b/c  

path.resolve('a', '/b', 'c')  //  '/b/c'  
//  分析:  test/a -> /b -> /b/c
```

## 区别  

* join是把各个path片段连接在一起， resolve把‘／’当成根目录  
* resolve在传入非/路径时，会自动加上当前目录形成一个绝对路径，而join仅仅用于路径拼接  

## __dirname  

nodejs 中 ```__dirname```总是指向被执行 js 文件所在文件夹的绝对路径, 类似的还有 ```__filename```表示被执行文件的绝对路径  

`./` 会返回你执行 node 命令的路径，例如你的工作路径  

示例:  

```js
// 假设当前路径为 /dir1/dir2/test.js
// 在 test.js 中使用__dirname  
cd ..
// 此时当前路径为 /dir1
node /test.js  
// 此时 __dirname 为 /dir1/dir2, ./ 为当前工作路径 /dir1, __filename 还是/dir1/dir2/test.js
```

## require

```require``` 中的路径总是相对于包含它的文件，跟你的工作目录没有关系。