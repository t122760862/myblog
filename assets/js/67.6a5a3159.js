(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{333:function(a,e,s){"use strict";s.r(e);var t=s(13),n=Object(t.a)({},(function(){var a=this,e=a._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("p",[a._v("本文记录一下如何搭建百度语音方向的开源模型库以及途中遇到的问题~")]),a._v(" "),e("p",[e("strong",[a._v("PaddleSpeech")]),a._v(" 是基于飞桨 "),e("a",{attrs:{href:"https://github.com/PaddlePaddle/Paddle",target:"_blank",rel:"noopener noreferrer"}},[a._v("PaddlePaddle"),e("OutboundLink")],1),a._v(" 的语音方向的开源模型库，用于语音和音频中的各种关键任务的开发，包含大量基于深度学习前沿和有影响力的模型")]),a._v(" "),e("ul",[e("li",[e("p",[a._v("github 地址(中文): https://github.com/PaddlePaddle/PaddleSpeech/blob/develop/README_cn.md")])]),a._v(" "),e("li",[e("p",[a._v("在线体验地址: https://aistudio.baidu.com/aistudio/projectdetail/4354592?sUid=2470186&shared=1&ts=1660878208266")])])]),a._v(" "),e("p",[a._v("###　安装")]),a._v(" "),e("p",[a._v("官网建议如下")]),a._v(" "),e("p",[a._v("＞　我们强烈建议用户在 "),e("strong",[a._v("Linux")]),a._v(" 环境下，"),e("em",[a._v("3.7")]),a._v(" 以上版本的 "),e("em",[a._v("python")]),a._v(" 上安装 PaddleSpeech。")]),a._v(" "),e("p",[a._v("本次安装环境: macos10.15.7")]),a._v(" "),e("h3",{attrs:{id:"相关依赖以及环境准备"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#相关依赖以及环境准备"}},[a._v("#")]),a._v(" 相关依赖以及环境准备")]),a._v(" "),e("ul",[e("li",[a._v("gcc >= 4.8.5")]),a._v(" "),e("li",[a._v("paddlepaddle >= 2.4.1")]),a._v(" "),e("li",[a._v("python >= 3.7")]),a._v(" "),e("li",[a._v("linux(推荐), mac, windows")])]),a._v(" "),e("p",[a._v("####　gcc >= 4.8.5")]),a._v(" "),e("p",[a._v("输入 "),e("code",[a._v("gcc -v")]),a._v(" 查看版本, mac 内置 4.2 版本, 不符合要求")]),a._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/gcc.png",alt:""}})]),a._v(" "),e("p",[a._v("使用 brew 安装新版本")]),a._v(" "),e("div",{staticClass:"language-js line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[a._v("brew update\nbrew install gcc\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br"),e("span",{staticClass:"line-number"},[a._v("2")]),e("br")])]),e("p",[a._v("安装完之后发现输入 "),e("code",[a._v("gcc -v")]),a._v("跟之前还是一样的,, 进入brew 安装目录可以发现已经安装:")]),a._v(" "),e("p",[e("code",[a._v("cd /usr/local/Cellar/gcc && ls")])]),a._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/gcc%E7%9B%AE%E5%BD%95.png",alt:"image-20230407114008372"}})]),a._v(" "),e("p",[a._v("这里输入"),e("code",[a._v("gcc-12 -v")]),a._v("即可, 也可以用 "),e("code",[a._v("gcc12")]),a._v(" 来代替默认的 "),e("code",[a._v("gcc")]),a._v(" 指令:")]),a._v(" "),e("div",{staticClass:"language-echo line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v('echo alias gcc="/usr/local/bin/gcc-12" > ~/.bash_profile\n')])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br")])]),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/gcc-12-v.png",alt:"image-20230407114419485"}})]),a._v(" "),e("h4",{attrs:{id:"paddlepaddle-2-4-1"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#paddlepaddle-2-4-1"}},[a._v("#")]),a._v(" paddlepaddle >= 2.4.1")]),a._v(" "),e("p",[a._v("PaddleSpeech 依赖于 paddlepaddle, 前往官网选择自己的电脑配置, 进行安装")]),a._v(" "),e("p",[a._v("这里选用: 稳定版 + macos + conda + cpu")]),a._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[a._v("conda "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[a._v("paddlepaddle")]),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("==")]),e("span",{pre:!0,attrs:{class:"token number"}},[a._v("2.4")]),a._v(".2 "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--channel")]),a._v(" https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/Paddle/\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br")])]),e("h3",{attrs:{id:"python-3-7"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#python-3-7"}},[a._v("#")]),a._v(" python >= 3.7")]),a._v(" "),e("p",[a._v("使用"),e("code",[a._v("conda")]),a._v("进行包管理, 首先安装 "),e("code",[a._v("conda")])]),a._v(" "),e("p",[a._v("进行官网下载地址: https://www.anaconda.com/products/distribution")]),a._v(" "),e("p",[a._v("选择合适的系统下载安装, 没什么好说的, 安装之后输入 "),e("code",[a._v("conda create -n paddlespeech python=3.9")]),a._v("创建一个名为"),e("code",[a._v("paddlespeech")]),a._v("的环境, 指令"),e("code",[a._v("python")]),a._v("版本为 3.9")]),a._v(" "),e("h3",{attrs:{id:"源码获取"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#源码获取"}},[a._v("#")]),a._v(" 源码获取")]),a._v(" "),e("p",[a._v("这里需要在上一步创建的环境里进行, 使用官网提供的方式:")]),a._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/PaddlePaddle/PaddleSpeech.git\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" PaddleSpeech\npip "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" pytest-runner\npip "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br"),e("span",{staticClass:"line-number"},[a._v("2")]),e("br"),e("span",{staticClass:"line-number"},[a._v("3")]),e("br"),e("span",{staticClass:"line-number"},[a._v("4")]),e("br")])]),e("p",[a._v("依赖安装完成之后可以体验一下官方提供的 "),e("code",[a._v("demo")])]),a._v(" "),e("p",[a._v("运行代码的时候可能会出现找不到"),e("code",[a._v("module")]),a._v("类似的错误, 使用"),e("code",[a._v("pip")]),a._v("进行安装即可")]),a._v(" "),e("p",[a._v("测试音频示例下载:")]),a._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("wget")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-c")]),a._v(" https://paddlespeech.bj.bcebos.com/PaddleAudio/zh.wav\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br")])]),e("p",[a._v("语音识别体验:")]),a._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[a._v("paddlespeech asr "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--lang")]),a._v(" zh "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--input")]),a._v(" zh.wav\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br")])]),e("p",[a._v("可以看到如下输出:")]),a._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/t122760862/blogimg@main/paddlespeech%20%E8%AF%AD%E9%9F%B3%E8%AF%86%E5%88%AB%E8%BE%93%E5%87%BA.png",alt:"image-20230407115929168"}})])])}),[],!1,null,null,null);e.default=n.exports}}]);