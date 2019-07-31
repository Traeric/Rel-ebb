$(function () {
    // 获取body里面的数据
    const content = $("body").html();
    // 检查页面是否有<swiper></swiper>标签
    const swiperRegular = /<swiper.*>[\s\S]+<\/swiper>/img;
    let swiperArr = swiperRegular.exec(content);
    // 循环处理
    
});

