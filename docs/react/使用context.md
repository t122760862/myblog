### 1. 定义一个context对象,并暴露出去
```
export const DataContext = React.createContext(initData)

```
### 2. 在需要传递的地方注入
```
<DataContext.Provider value={data}>
        {children}
      </DataContext.Provider>
```
### 3. 在需要使用的地方消费
```
// 首先引入之前暴露的context对象

import { DataContext } from './setEquipment'


// 然后在需要使用的组件用consumer包裹

<DataContext.Consumer>                
    {(value: DevType) => Node(value)}</DataContext.Consumer>

```
注意：当前组件如果需要使用context传递的内容，需要用函数来返回组件内容，函数接受一个参数为context传递的内容
```

 const Node = (data: DevType) =>(
    <>
      <Button onClick={() => setReviseModal(true)} className="marginBottom10" type="primary">
        修改
      </Button>
      <Descriptions className="cus-descriptions">
        <Descriptions.Item label="分类编码">{data.devtypeCode}</Descriptions.Item>
        <Descriptions.Item label="分类名称">{data.devtypeName}</Descriptions.Item>
        <Descriptions.Item label="基础设施系统">{data.sysName}</Descriptions.Item>
        <Descriptions.Item label="产品分类">{data.maintypeName}</Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {data.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={3}>
          {data.remark}
        </Descriptions.Item>
      </Descriptions>
      <ReviseInfoModalForm
        data={data}
        isShowReviseModal={isShowReviseModal}
        changeStatus={setReviseModal}
      />
    </>
  )


```