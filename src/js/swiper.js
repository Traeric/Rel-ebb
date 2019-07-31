$(function () {
    // 正则表达式
    const swiperRegular = /<swiper.*>[\s\S]+?<\/swiper>/img;
    const swiperItemRegular = /<swiper.*>[\s\S]*<\/swiper-item>/img;
    // 获取body里面的数据
    const content = $("body").html();
    // 匹配页面的<swiper></swiper>标签
    let swiperArr;
    while (swiperArr = swiperRegular.exec(content)) {
        // 获取swiper的参数


        // 获取<swiper-item></swiper-item>标签
        let swiperItemArr;
        while (swiperItemArr = swiperItemRegular.exec(swiperArr[0])) {
            // 获取image
            let imageRgular = /image="(.*?)"/gm;   // 此处使用正则表达式的懒惰模式
            let imageArr = imageRgular.exec(swiperItemArr[0]);
            if (imageArr !== null && imageArr[1] !== "") {
                // 匹配到了
                let image = imageArr[1];

            } else {

            }
            // 获取link
            let linkRgular = /link="(.*?)"/gm;   // 此处使用正则表达式的懒惰模式
            let linkArr = linkRgular.exec(swiperItemArr[0]);
            if (linkArr !== null && linkArr[1] !== "") {
                // 匹配到了
                let link = linkArr[1];
                
            } else {

            }
        }
    }
});

