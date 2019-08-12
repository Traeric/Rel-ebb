$(function () {
    // 获取PhotoCut标签
    let photoCutArr = $("PhotoCut");
    if (photoCutArr.length > 0) {
        photoCutArr.each((index, photoCut) => {
            let photoCutDom = $(`
                <div class="rel-ebb-photo-cut">
                    <div class="rel-ebb-bg">
                        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2754950309,2133495749&fm=26&gp=0.jpg"
                             alt="NO IMG">
                        <div class="rel-ebb-shadow">
                        <div class="img-frame">
                                <div class="cutting-area">
                                    <div class="position">
                                        <div class="cutting-line-up"></div>
                                        <div class="cutting-line-down"></div>
                                        <div class="cutting-line-left"></div>
                                        <div class="cutting-line-right"></div>
                                        <div class="cutting-point-up cutting-point"></div>
                                        <div class="cutting-point-down cutting-point"></div>
                                        <div class="cutting-point-left cutting-point"></div>
                                        <div class="cutting-point-right cutting-point"></div>
                                        <div class="cutting-point-left-up cutting-point"></div>
                                        <div class="cutting-point-left-down cutting-point"></div>
                                        <div class="cutting-point-right-up cutting-point"></div>
                                        <div class="cutting-point-right-down cutting-point"></div>
                                        <div class="cutting-area-h"></div>
                                        <div class="cutting-area-v"></div>
                                        <!-- 展示编辑后的图片 -->
                                        <div class="img-display"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            // 替换PhotoCut标签
            $(photoCut).replaceWith(photoCutDom);
            // 样式初始化
            styleInitialize(photoCutDom);
            // 移动剪切区域
            moveCuttingArea(photoCutDom);
        });
    }
});


/**
 * 对样式进行初始化
 * @param photoCutDom
 */
function styleInitialize(photoCutDom) {
    let imgDom = $(photoCutDom).find("img");
    // 获取图片的宽高
    $(imgDom).on("load", function () {
        let imgWidth = $(this).width();
        let imgHeight = $(this).height();
        // 设置截图区域的大小
        $(photoCutDom).find(".cutting-area").css({
            width: `${(imgWidth - 50) > 20 ? (imgWidth - 50) : imgWidth}px`,
            height: `${(imgHeight - 50) > 20 ? (imgHeight - 50) : imgHeight}px`,
            left: `${(imgWidth - 50) > 20 ? 25 : 0}px`,
            top: `${(imgHeight - 50) > 20 ? 25 : 0}px`,
        });
        // 设置图片范围
        $(photoCutDom).find(".img-frame").css({
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
        });
        // 设置截图区域的背景大小以及要显示的区域
        $(photoCutDom).find(".img-display").css({
            backgroundSize: `${imgWidth}px ${imgHeight}px`,
            backgroundPosition: `${(imgWidth - 50) > 20 ? -25 : 0}px 
                                 ${(imgHeight - 50) > 20 ? -25 : 0}px`,
        });
    });
}


/**
 * 移动剪切区域
 * @param photoCutDom
 */
function moveCuttingArea(photoCutDom) {
    let imgFrame = $(photoCutDom).find(".img-frame");
    $(photoCutDom).find(".cutting-area").mousedown(function (e) {
        // 获取鼠标距离元素的位置
        let disx = e.pageX;
        let disy = e.pageY;
        // 获取初始的left跟top
        let startLeft = parseInt($(this).css('left').split('px')[0]);
        let startTop = parseInt($(this).css('top').split('px')[0]);
        $(this).mousemove((e) => {
            let left = e.pageX - disx + startLeft;
            let top = e.pageY - disy + startTop;
            // 限制移动框的大小
            left = Math.max(0, left);
            left = Math.min(imgFrame.width() - $(this).width(), left);
            top = Math.max(0, top);
            top = Math.min(imgFrame.height() - $(this).height(), top);
            // 移动选框
            $(this).css({
                left: `${left}px`,
                top: `${top}px`,
            });
        });
    });
    $(photoCutDom).find(".cutting-area").mouseup(function (e) {
        // 移除移动事件
        $(this).unbind('mousemove');
    });
    $(photoCutDom).find(".cutting-area").mouseleave(function (e) {
        // 移除移动事件
        $(this).unbind('mousemove');
    });
}


