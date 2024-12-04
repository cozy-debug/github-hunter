# Github 热门项目预测器

## 概览
我通过大数据分析，找到了一个潜在的种子项目 [magic-quill/MagicQuill: Official Implementations for Paper - MagicQuill: An Intelligent Interactive Image Editing System](https://github.com/magic-quill/MagicQuill)

下面这个仓库是我在 北京时间 2024.11.16 凌晨 4.22 发现的，距离它首次公开仅 17小时。发现它的时候只有 200 多个 star，而今天它已经有 2k star

![image](https://github.com/user-attachments/assets/33187bbc-f6af-460d-9433-75ea07d89595)

这个工具就是用来帮你寻找当天那些冷门但又非常有潜力爆火的项目。甚至能在优质项目公布当天 24 小时内就把它挖掘出来。

通常我们要分析找到当天最火热的 Github 项目，都是通过看 Github Trending 或者看科技新闻。但是 Github Trending 只展示十几条记录，而且上了 Trending 的仓库，一般都已经积累了很多赞，对我们来说构不成信息差。科技新闻更糟糕，当你看到的时候，已经是二手消息，而且零星杂散​不成体系，根本无从得知是不是有些宝藏项目被遗漏了。

若要系统性地统计所有 Github 项目，最佳办法直连 Github 数据库，遍历一遍，火热程度从高到低排序，可以不重不漏、任意个数地找到最近几天的火热项目。这就是本项目的基本原理。

## 使用方法
具体代码运行，请看 `index.ipynb`

## 适用人群
程序员、自媒体、高校学生、创投圈，这些人群是经常会看最新的科技进展的。 等到项目人尽皆知烂大街，就太晚了。这些人群可以从本工具中受益，主打一个信息差。

## 路线
希望未来能做成一款产品，集成 Github + ProductHunt + HackerNews ，通过数据分析找出有潜力的项目。在 AI 产品迅速发展的今天，做一个聚合站把最新的 IT 资讯带给大家，应该还是值得一做的。

同时，为了校验这个工具的威力，我会在每次用它找到好项目的时候，就立刻用区块链记录下来，作为一个预言。日后项目爆火，就代表预言成真，所有人都可以校验时间。

## 答疑社群
同时欢迎各位 AI 相关的媒体人、程序员、大学生、创业人士进群讨论，多多提意见

![image](https://github.com/user-attachments/assets/f256f544-1229-489c-a7e0-0b48709c74c6)

--------------------------------

注：怎么确保我不是吹牛的，我是不是真的那么早就发掘出了前面提到的那个项目？

为了让各位看官相信我并非胡说八道，当天我已经把证据写到区块链上了。
我写了一份文档，存储在 Walrus 上，校验链接：https://walruscan.com/testnet/blob/lLv2o4NNyroFcFjrLUiH0LW0tHj4_ulaSYyZ4H_K_sE 从这个链接可以看到创建时间。
文件内容在 https://app.ardrive.io/#/file/554684f0-47e8-431c-b949-fc30e8f85758/view
请下载文件内容后，使用 `walrus --blob-id <the-file-name>` 校验一下，你会发现 blob-id 跟lLv2o4NNyroFcFjrLUiH0LW0tHj4_ulaSYyZ4H_K_sE一致。
文档内容里面还附带了我的 ETH 地址，作为唯一身份证明。

