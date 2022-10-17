````js
```js
import EditCompanyInfo from '@/views/acountManager/companyInfo/editCompanyInfo.vue';
const getNode = (target: any, el: any) => {
    if (!target || !el) return;
    return el.querySelector(target);
};
const hocEditCompanyInfo = function(component: any): any {
    return {
        data() {
            return {};
        },

        mounted() {
            this.deleteNode();
            this.watchDisabled();
        },

        methods: {
            deleteNode() {
                const $el = (this as any).$el;
                const headerNode = getNode('.base-header', $el);
                if (headerNode) {
                    const parent = headerNode.parentElement;
                    parent.removeChild(headerNode);
                }

                const footBtnNode = getNode('.btn-box', $el);
                if (footBtnNode) {
                    const parent = footBtnNode.parentElement;
                    parent.removeChild(footBtnNode);
                }
            },

            watchDisabled() {
                const that = this as any;
                const refHocComponent = that.$refs.refHocComponent;
                if (!refHocComponent) return;

                // 使用 ref 来获取组件实例并使用一些方法
                refHocComponent.$watch(
                    'isAllRight',
                    (value: boolean) => {
                        that.$emit('changeIsAllRight', value);
                    },
                    { immediate: true },
                );
            },
        },

        render(h: any) {
            return h(component, { ref: 'refHocComponent' });
        },
    };
};

export default hocEditCompanyInfo(EditCompanyInfo);

```
````