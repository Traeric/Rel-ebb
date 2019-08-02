# 引言
Rel-ebb这个名字是经过三个单词拆分组合而成的，**Rel**的**re**表示**repel**，击退的意思，而**l**表示**low**，联合后面的**ebb**，译为低谷——人生的低谷，合起来就是击退人生的低谷，名字与项目本身并无一点关系，只是写这个项目时我正处于人生的低谷时期，还无力与现实斗争的我只能将情感寄托于我所热爱的编程，我记得宋濂在送东阳马生序中有这样一句话，叫做“以中有足乐者，不知口体之奉不若人也。盖余之勤且艰若此。”，人生如此，无法事事顺遂，但求精神追求能够丰富，以慰吾心。

# 介绍

我在做前端开发的时候，经常会使用到各种各样的前端ui库，一方面是美观，一方面是方便，节约时间。正是由于这些方面的原因，前端的ui库就如同天上繁星一般，数不胜数。因此，我认真的考虑过是否有必要再去造这个轮子，期间有过放弃，觉得没必要去花精力造，造出来可能还不如人家，不过最后经过一番挣扎还是决定去造这个轮子，原因有三，如下：

* 众多的ui库样式不一，人嘛，萝卜白菜各有所爱，于我来说，很难有一个前端ui库的所有样式都满足我的审美，所以我需要一款能够让所有样式都符合我的审美的产品，那这款产品最好就是我自己亲手定制
* 众多的ui库功能不一，在开发中可能需要使用到很多不同的功能，假设A功能只有ui库A拥有，B功能只有ui库B拥有，有一天我开发一个项目需要同时用到A跟B功能，就必须同时引入ui库A跟B，为了一个功能而引入几十上百余兆的一个ui库，我觉得并不划算，所以需要由我做一个整合
* 很多ui库只关注样式，很少关注功能，比方说我最近做的一个项目需要用到视频播放功能，就无法用ui库去实现，因此这个项目的定位不再是一个ui库，而是一个前端的工具集，希望能将平时前端开发中比较常用的一些功能进行整合

# 轮播图

## swiper

轮播图，可以放入swiper-item标签

|        属性        |  类型  |        默认值         | 是否必须 |          说明          |
| :----------------: | :----: | :-------------------: | :------: | :--------------------: |
|    point-panel     |  null  |          无           |    否    | 是否显示底部小圆点面板 |
| point-panel-color  | string | rgba(255,255,255,0.3) |    否    |  底部小圆点面板的颜色  |
|    point-color     | string |         #fff          |    否    |     底部小圆点颜色     |
| point-active-color | string |         #f00          |    否    |  底部小圆点激活的颜色  |
|      autoplay      |  null  |          无           |    否    |      是否自动轮播      |

## swiper-item

放置在swiper标签中，为每一项轮播页占位

| 属性  |  类型  | 默认值 | 是否必须 |       说明       |
| :---: | :----: | :----: | :------: | :--------------: |
| image | string |   ""   |    是    | 轮播图展示的图片 |
| link  | string |   ""   |    是    |   要跳转的链接   |

## 示例代码

```html
<swiper point-panel autoplay point-panel-color="#abc" point-color="#f90" point-active-color="#000">
        <swiper-item image="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2640752012,1534669165&fm=26&gp=0.jpg" link=""></swiper-item>
        <swiper-item image="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=415008709,1894925421&fm=26&gp=0.jpg" link=""></swiper-item>
        <swiper-item image="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2567630305,1627706587&fm=26&gp=0.jpg" link=""></swiper-item>
        <swiper-item image="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1444965086,1221602315&fm=11&gp=0.jpg" link=""></swiper-item>
    </swiper>
```

