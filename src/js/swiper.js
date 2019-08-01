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
            pointStr += `<span class="point ${ind === 0 ? 'active' : ''}" data-index="${ind}"></span>`;
            swiperItemStr += `
                <div class="rel-ebb-swiper-item ${ind === 0 ? 'active' : ''}">
                    <a href="${link === '' ? 'javascript:void(0);' : link}" class="rel-ebb-swiper-a">
                        <img src="${image}" alt="NO IMG" class="rel-ebb swiper-image">
                    </a>
                </div>
            `;
        });
        // 添加到swiperDom中
        swiperDom.append(swiperItemStr);
        swiperDom.children(".point-list").append(pointStr);
        // 添加到页面
        $(swiper).replaceWith(swiperDom);
        // 启动banner
        move(swiperDom);
    });
});

/**
 * 点击切换banner图
 * @param swiperDom
 */
function move(swiperDom) {
    let index = 0;
    let timer = null;
    // 设置prev点击事件
    $(swiperDom).children(".prev").click(() => {
        index = index <= 0 ? $(swiperDom).children(".rel-ebb-swiper-item").length - 1 : --index;
        changeItem(swiperDom, index);
    });

    // 设置next点击事件
    $(swiperDom).children(".next").click(() => {
        index = index >= $(swiperDom).children(".rel-ebb-swiper-item").length - 1 ? 0 : ++index;
        changeItem(swiperDom, index);
    });

    // 设置point-list点击事件
    $(swiperDom).children(".point-list").click((e) => {
        let currentDom = e.target;
        if (currentDom.localName === 'span') {
            // 获取index
            index = parseInt($(currentDom).data('index'));
            changeItem(swiperDom, index);
        }
    });

    // 设置动画
    timer = setInterval(() => {
        index = index >= $(swiperDom).children(".rel-ebb-swiper-item").length - 1 ? 0 : ++index;
        changeItem(swiperDom, index);
    }, 2000);
    $(swiperDom).mouseover(() => {
        // 鼠标移入，动画消失
        clearInterval(timer);
    });
    $(swiperDom).mouseout(() => {
        // 鼠标移出，动画恢复
        timer = setInterval(() => {
            index = index >= $(swiperDom).children(".rel-ebb-swiper-item").length - 1 ? 0 : ++index;
            changeItem(swiperDom, index);
        }, 2000);
    });
}

/**
 * 切换样式
 * @param swiperDom
 * @param index
 */
function changeItem(swiperDom, index) {
    // 显示对应的banner
    $(swiperDom).children(".rel-ebb-swiper-item").removeClass('active');
    $($(swiperDom).children(".rel-ebb-swiper-item").get(index)).addClass('active');
    // 替换底部按钮
    $(swiperDom).find(".point").removeClass('active');
    $($(swiperDom).find(".point").get(index)).addClass('active');
}


