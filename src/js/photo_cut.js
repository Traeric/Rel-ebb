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
                                        <div class="cutting-line-up resize-line-up"></div>
                                        <div class="cutting-line-down resize-line-down"></div>
                                        <div class="cutting-line-left resize-line-left"></div>
                                        <div class="cutting-line-right resize-line-right"></div>
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
                    <div class="prev-and-btn">
                        <canvas class="prev-cut-img" width="100" height="100"></canvas>
                        <div class="btn-group">
                            <button class="confirm">确定</button>
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
            // 重新调整截图区域的大小
            resizeCuttingArea(photoCutDom);
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
        // 图片裁剪预览
        let startX = (imgWidth - 50) > 20 ? 25 : 0;
        let startY = (imgHeight - 50) > 20 ? 25 : 0;
        let areaWidth = $(photoCutDom).find(".cutting-area").width();
        let areaHeight = $(photoCutDom).find(".cutting-area").height();
        drawPrevImg(photoCutDom, this, startX, startY, areaWidth, areaHeight);
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
            // 将选框中的内容进行移动
            $(photoCutDom).find(".img-display").css({
                backgroundPosition: `-${left}px -${top}px`,
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


/**
 * 重新调整截图区域的大小
 * @param photoCutDom
 */
function resizeCuttingArea(photoCutDom) {
    let imgFrame = $(photoCutDom).find(".img-frame");
    let cuttingArea = $(photoCutDom).find(".cutting-area");
    // 上面调整大小
    $(photoCutDom).find(".resize-line-up").mousedown(function (e) {
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
        let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top - 5;
        $(this).mousemove((event) => {
            upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
        });
    });
    // 下面调整大小
    $(photoCutDom).find(".resize-line-down").mousedown(function (e) {
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
        let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
        $(this).mousemove((event) => {
            downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
        });
    });
    // 左边调整大小
    $(photoCutDom).find(".resize-line-left").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        $(this).mousemove((event) => {
            leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
        });
    });
    // 右边调整大小
    $(photoCutDom).find(".resize-line-right").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startRight = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().right;
        let startLeft = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().left;
        $(this).mousemove((event) => {
            rightMove(event, photoCutDom, startMouseX, startRight, startLeft, startWidth, imgFrame, cuttingArea);
        });
    });
    // 左上调整大小
    $(photoCutDom).find(".cutting-point-left-up").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
        let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top - 5;
        $(this).mousemove((event) => {
            upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
            leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
        });
    });
    // 左下调整大小
    $(photoCutDom).find(".cutting-point-left-down").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
        let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
        $(this).mousemove((event) => {
            leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
            downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
        });
    });
    // 右上调整大小
    $(photoCutDom).find(".cutting-point-right-up").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
        let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top - 5;
        $(this).mousemove((event) => {
            rightMove(event, photoCutDom, startMouseX, startRight, startLeft, startWidth, imgFrame, cuttingArea);
            upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
        });
    });
    // 右下调整大小
    $(photoCutDom).find(".cutting-point-right-down").mousedown(function (e) {
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
        let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
        $(this).mousemove((event) => {
            rightMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
            downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
        });
    });
    // 清除事件
    $(document).mouseup(() => {
        $(photoCutDom).find(".resize-line-up").unbind('mousemove');
        $(photoCutDom).find(".resize-line-down").unbind('mousemove');
        $(photoCutDom).find(".resize-line-left").unbind('mousemove');
        $(photoCutDom).find(".resize-line-right").unbind('mousemove');
        $(photoCutDom).find(".cutting-point-left-up").unbind('mousemove');
        $(photoCutDom).find(".cutting-point-left-down").unbind('mousemove');
        $(photoCutDom).find(".cutting-point-right-up").unbind('mousemove');
        $(photoCutDom).find(".cutting-point-right-down").unbind('mousemove');
    });
}


/**
 * 向上移动
 * @param event
 * @param photoCutDom
 * @param startMouseY
 * @param startTop
 * @param startBottom
 * @param startHeight
 * @param imgFrame
 * @param cuttingArea
 */
function upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea) {
    // 取消移动事件
    $(photoCutDom).find(".cutting-area").unbind('mousemove');
    let moveY = event.pageY - startMouseY;
    // 调整位置
    let top = startTop + moveY;
    // 限制大小
    top = Math.max(0, top);
    top = Math.min(startBottom, top);
    // 到顶了就不会再增加高度了
    if (top > 0) {
        // 重新调整截图区域的大小
        let height = startHeight - moveY;
        // 限制大小
        height = Math.max(0, height);
        height = Math.min(imgFrame.height(), height);
        $(cuttingArea).css({
            height: height + 'px',
        });
    }
    // 调整截图区域的大小
    $(cuttingArea).css({
        top: `${top}px`,
    });
    // 调整截图区域的图片位置
    $(photoCutDom).find(".img-display").css({
        backgroundPositionY: `-${top}px`,
    });
}


/**
 * 向下移动
 * @param event
 * @param photoCutDom
 * @param startMouseY
 * @param startBottom
 * @param startTop
 * @param startHeight
 * @param imgFrame
 * @param cuttingArea
 */
function downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea) {
    // 取消移动事件
    $(photoCutDom).find(".cutting-area").unbind('mousemove');
    let moveY = event.pageY - startMouseY;
    // 调整位置
    let bottom = startBottom - moveY;
    // 限制大小
    bottom = Math.max(0, bottom);
    bottom = Math.min(startTop, bottom);
    // 到底了就不会再增加高度了
    if (bottom > 0) {
        // 重新调整截图区域的大小
        let height = startHeight + moveY;
        // 限制大小
        height = Math.max(0, height);
        height = Math.min(imgFrame.height(), height);
        $(cuttingArea).css({
            height: height + 'px',
        });
    }
    // 调整截图区域的大小
    $(cuttingArea).css({
        bottom: `${bottom}px`,
    });
}


/**
 * 向左移动
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startLeft
 * @param startRight
 * @param startWidth
 * @param imgFrame
 * @param cuttingArea
 */
function leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea) {
    // 取消移动事件
    $(photoCutDom).find(".cutting-area").unbind('mousemove');
    let moveX = event.pageX - startMouseX;
    // 调整位置
    let left = startLeft + moveX;
    // 限制大小
    left = Math.max(0, left);
    left = Math.min(startRight, left);
    // 到左边了就不会再增加宽度了
    if (left > 0) {
        // 重新调整截图区域的大小
        let width = startWidth - moveX;
        // 限制大小
        width = Math.max(0, width);
        width = Math.min(imgFrame.width(), width);
        $(cuttingArea).css({
            width: width + 'px',
        });
    }
    // 调整截图区域的大小
    $(cuttingArea).css({
        left: `${left}px`,
    });
    // 调整截图区域的图片位置
    $(photoCutDom).find(".img-display").css({
        backgroundPositionX: `-${left}px`,
    });
}


/**
 * 向右移动
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startRight
 * @param startLeft
 * @param startWidth
 * @param imgFrame
 * @param cuttingArea
 */
function rightMove(event, photoCutDom, startMouseX, startRight, startLeft, startWidth, imgFrame, cuttingArea) {
    // 取消移动事件
    $(photoCutDom).find(".cutting-area").unbind('mousemove');
    let moveX = event.pageX - startMouseX;
    // 调整位置
    let right = startRight - moveX;
    // 限制大小
    right = Math.max(0, right);
    right = Math.min(startLeft, right);
    // 到右边就不会再增加宽度了
    if (right > 0) {
        // 重新调整截图区域的大小
        let width = startWidth + moveX;
        // 限制大小
        width = Math.max(0, width);
        width = Math.min(imgFrame.width(), width);
        $(cuttingArea).css({
            width: width + 'px',
        });
    }
    // 调整截图区域的大小
    $(cuttingArea).css({
        right: `${right}px`,
    });
}


/**
 * 进行图片预览
 * @param photoCutDom
 * @param imgDom
 * @param startX
 * @param startY
 * @param imgWidth
 * @param imgHeight
 */
function drawPrevImg(photoCutDom, imgDom, startX, startY, imgWidth, imgHeight) {
    // 获取画布
    let canvas = $(photoCutDom).find("canvas").get(0);
    let ctx = canvas.getContext('2d');
    // 获取图片
    ctx.drawImage(imgDom, startX, startY, imgWidth, imgHeight, 0, 0, 100, 100);
}

