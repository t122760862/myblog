## 背景  

1. 全局封装的 ```tooltip ```组件, 悬浮提示内容由业务组件提供    
2. 悬浮提示内容中有按钮,且支持点击跳转别的页面  

由于是全局封装组件, 因此希望组件支持悬浮内容内的内容可以点击跳转到别的页面而不是单独进行业务编码, 基于此背景下有了此方案    

## 实现  

1. 对悬浮内容内的 a 标签做约定处理, 其中一个固定 id 标识作为判断目标, 使用```data-route```存储需要跳转的路由页面  
2. 公共```tooltip```加载时, 获取到根据 ```ref```获取到当前节点下的目标标签, 若有则继续获取```data-route```的值, 并添加点击事件 
2. 使用```append-to-body```属性,将悬浮提示插入父级节点方便通过```ref```定位到目标target

## 代码  

```vue
<template>
    <div class="tooltip-box" ref="refTooltipBox">
        <el-tooltip
            ref="refTooltip"
            popper-class="common-tooltip-stand"
            v-bind="$attrs"
            :append-to-body="false"
        >
            <template slot="content">
                <div>
                    <slot name="content">
                        <div ref="refTooltipContent">{{ content }}</div>
                    </slot>
                </div>
            </template>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { usePush } from '@/views/smb/helper';

export default defineComponent({
    setup(_prop, context) {
        function initGoRoute() {
            const refTooltip = context.refs.refTooltip;
            const refTooltipBox = context.refs.refTooltipBox;
            if (!refTooltip || !refTooltipBox) return;

          	/** 将悬浮层插入父级节点 */
            refTooltipBox.appendChild(refTooltip.popperVM.$el);

            context.root.$nextTick(() => {
              	/** 定位到目标 target */
                const target = refTooltipBox.querySelector('#aToRoute');
                if (!target) return;

              	/** 添加点击事件 */
                target.addEventListener('click', () => {
                  	/** 拿到 route 信息并跳转 */
                    const route = target.dataset.route;
                    usePush(route);
                });
            });
        }

        onMounted(initGoRoute);
    },
});
</script>
```

## 总结  

* 比较常用的功能, 全局组件支持能节省不少重复的代码和时间  
* 约定式的配置带来方便也带来隐患,当标识重复的时候容易引起, 因此要注意唯一标识的生成  
* 保持好奇, 保持思考才能进步!  
