// $(function () {
//     // 正则表达式
//     const swiperRegular = /<swiper.*>[\s\S]+?<\/swiper>/img;
//     const swiperItemRegular = /<swiper-item.*><\/swiper-item>/img;
//     // 获取body里面的数据
//     const content = $("body").html();
//     // 匹配页面的<swiper></swiper>标签
//     let swiperArr;
//     while (swiperArr = swiperRegular.exec(content)) {
//         // 获取swiper的参数
//         let swiperDom = $(`
//             <div class="rel-ebb-swiper">
//                 <div class="prev move">
//                     <i class="iconfont icon-prev"></i>
//                 </div>
//                 <div class="next move">
//                     <i class="iconfont icon-prev"></i>
//                 </div>
//                 <div class="point-list"></div>
//             </div>
//         `);
//
//         // 获取<swiper-item></swiper-item>标签
//         let swiperItemArr;
//         let index = 0;
//         let pointStr = "";
//         let swiperItemStr = "";
//         while (swiperItemArr = swiperItemRegular.exec(swiperArr[0])) {
//             // 获取image
//             let imageRgular = /image="(.*?)"/gm;   // 此处使用正则表达式的懒惰模式
//             let imageArr = imageRgular.exec(swiperItemArr[0]);
//             let image = "";
//             if (imageArr !== null && imageArr[1] !== "") {
//                 // 匹配到了
//                 image = imageArr[1];
//             }
//             // 获取link
//             let linkRgular = /link="(.*?)"/gm;   // 此处使用正则表达式的懒惰模式
//             let linkArr = linkRgular.exec(swiperItemArr[0]);
//             let link = "";
//             if (linkArr !== null && linkArr[1] !== "") {
//                 // 匹配到了
//                 link = linkArr[1];
//             }
//             // 填充字符串
//             pointStr += `<span class="point ${index === 0 ? 'active' : ''}"></span>`;
//             swiperItemStr += `
//                 <div class="rel-ebb-swiper-item ${index === 0 ? 'active' : ''}">
//                     <a href="${link === '' ? 'javascript:void(0);' : link}" class="rel-ebb-swiper-a">
//                         <img src="${image}" alt="NO IMG" class="rel-ebb swiper-image">
//                     </a>
//                 </div>
//             `;
//             index++;
//         }
//         // 添加到swiperDom中
//         swiperDom.append(swiperItemStr);
//         swiperDom.children(".point-list").append(pointStr);
//         // 添加到页面
//         $("swiper:eq()")
//     }
// });


$(function () {
    // 匹配页面的<swiper></swiper>标签
    let swiperArr = $("swiper");
    swiperArr.each((index, swiper) => {
        // 获取swiper的参数
        let swiperDom = $(`
            <div class="rel-ebb-swiper">
                <div class="prev move">
                    <i class="iconfont icon-prev"></i>
                </div>
                <div class="next move">
                    <i class="iconfont icon-prev"></i>
                </div>
                <div class="point-list"></div>
            </div>
        `);

        // 获取<swiper-item></swiper-item>标签
        let swiperItemArr = $(swiper).children();
        let pointStr = "";
        let swiperItemStr = "";
        $(swiperItemArr).each((ind, swiperItem) => {
            // 获取image
            let image = $(swiperItem).attr("image");
            // 获取link
            let link = $(swiperItem).attr("link");
            // 填充字符串
            pointStr += `<span class="point ${ind === 0 ? 'active' : ''}"></span>`;
            swiperItemStr += `
                <div class="rel-ebb-swiper-item ${ind === 0 ? 'active' : ''}">
                    <a href="${link === '' ? 'javascript:void(0);' : link}" class="rel-ebb-swiper-a">
                        <img src="${image}" alt="NO IMG" class="rel-ebb swiper-image">
                    </a>
                </div>
            `;
            index++;
        });
        // 添加到swiperDom中
        swiperDom.append(swiperItemStr);
        swiperDom.children(".point-list").append(pointStr);
        // 添加到页面
        $(swiper).replaceWith(swiperDom);
    });
});

