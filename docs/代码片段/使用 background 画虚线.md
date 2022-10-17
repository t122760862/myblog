# 使用 background 画虚线  

最近了解到可以使用 ```background ```画虚线, 奇奇怪怪的知识又增加了~  

```html
<div class="dashed"/>
```

css 部分  

```scss
.dashed {
                height: 2px;
                background-image: linear-gradient(
                    to right,
                    rgba(0, 85, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 0%
                ); /* 35%设置虚线点x轴上的长度 */
                background-position: bottom; /* top配置上边框位置的虚线 */
                background-size: 9px 2px; /* 第一个参数设置虚线点的间距；第二个参数设置虚线点y轴上的长度 */
                background-repeat: repeat-x;
}
```

同时也可以通过修改参数绘制垂直方向的虚线  

```scss
.dashed {
    height: 100%;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 85, 255, 0.3) 50%, // 这里设置虚线的颜色
        rgba(255, 255, 255, 0) 0%
    ); /* 35%设置虚线点x轴上的长度 */
    background-position: bottom; /* top配置上边框位置的虚线 */
    background-size: 12px 2px; /* 第一个参数设置虚线点长度；第二个参数设置虚线点x轴上的宽度 */
    background-repeat: repeat-y;
}
```