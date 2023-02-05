#### 把｛children｝ 替换成
![](https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/202210171739775.png)

##### 1. React.Children.map（node, （） = ele ）
    该方法接受两个参数，第一个为node的节点，第二个为遍历的children对象回调函数，返回一个element
#####     React.cloneElement(node,Props,child)
该方法接受三个参数，第一个为需要操作的node，第二个参数为操作node的props，第三个参数为操作**当前children**的props