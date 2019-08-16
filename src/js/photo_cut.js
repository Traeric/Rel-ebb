$(function () {
    // 获取PhotoCut标签
    let photoCutArr = $("PhotoCut");
    if (photoCutArr.length > 0) {
        photoCutArr.each((index, photoCut) => {
            // 获取参数
            window.preViewClass = $(photoCut).attr("pre-view");  // 预览图类名
            window.confirmClass = $(photoCut).attr("confirm");  // 确认按钮类名
            window.downloadClass = $(photoCut).attr('download');  // 下载按钮的类名
            window.inputId = $(photoCut).attr('input-id');  // 绑定的input标签的id
            window.imgName = $(photoCut).attr('img-name');  // 要下载的图片名称
            window.square = $(photoCut).attr("square") || 'false';  // 是否设置矩形截图
            // 获取图片的url
            let photoCutDom = $(`
                <div class="rel-ebb-photo-cut">
                    <div class="rel-ebb-bg">
                        <img alt="NO IMG">
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
                                        <div class="click-area"></div>
                                        <!-- 展示编辑后的图片 -->
                                        <div class="img-display"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <canvas></canvas>
                    <a id="downloadA"></a>
                    <div class="cover"></div>
                </div>
            `);
            // 替换PhotoCut标签
            $(photoCut).replaceWith(photoCutDom);
            // 为对应的input-file设置change事件
            changeEvenet(photoCutDom);
            comfirmEvent(photoCutDom);
            downloadEvent(photoCutDom);
        });
    }
});


/**
 * 为确认按钮设置点击事件
 * @param photoCutDom
 */
function comfirmEvent(photoCutDom) {
    $(`.${window.confirmClass}`).click(() => {
        // 获取base64字符串
        let base64Str = $(photoCutDom).find("canvas").get(0).toDataURL("image/png");
        // 将base64编码的字符串转换成图片文件
        let imgFile = dataURLtoFile(base64Str);
        // 将文件设置给input
        $(`#${window.inputId}`).get(0).files = new FormData().append('0', imgFile);
        alert("截图成功");
    });
}


/**
 * base64转换函数
 * @param dataurl
 * @param filename
 * @returns {File}
 */
function dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];   // 获取图片的后缀，png jpg等
    let bstr = atob(arr[1]);   // 对base64进行解码
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}


/**
 * 为确认按钮设置点击事件
 * @param photoCutDom
 */
function downloadEvent(photoCutDom) {
    $(`.${window.downloadClass}`).click(() => {
        let img = $(photoCutDom).find('canvas').get(0).toDataURL('image/png');
        let triggerDownload = $(photoCutDom).find("#downloadA")
            .attr("href", img).attr("download", (window.imgName || "rel-ebb") + '.png');
        triggerDownload[0].click();
    });
}


/**
 * 为PhotoCut标签对应的input标签设置绑定事件
 * @param photoCutDom
 */
function changeEvenet(photoCutDom) {
    $(`#${window.inputId}`).change(function (e) {
        // 获取图片地址
        let imgSrc = URL.createObjectURL(this.files[0]);
        // 对图片类型进行检测
        if (this.files[0].type.startsWith('image')) {
            // 将图片放到裁剪框中
            $(photoCutDom).find('img').attr('src', imgSrc);
            $(photoCutDom).find('.img-display').css('background-image', `url(${imgSrc})`);
            // 去掉遮罩层
            $(photoCutDom).find(".cover").css('display', 'none');
            // 样式初始化
            styleInitialize(photoCutDom);
            // 移动剪切区域
            moveCuttingArea(photoCutDom);
            // 重新调整截图区域的大小
            resizeCuttingArea(photoCutDom);
        }
    });
}


/**
 * 对样式进行初始化
 * @param photoCutDom
 */
function styleInitialize(photoCutDom) {
    let imgDom = $(photoCutDom).find("img");
    // 获取图片的宽高
    $(imgDom).on("load", function () {
        $(this).attr("crossOrigin", 'Anonymous');
        let imgWidth = $(this).width();
        let imgHeight = $(this).height();
        let left = 0;
        let top = 0;
        // 设置截图区域的大小
        if (window.square === 'false') {
            left = (imgWidth - 50) > 20 ? 25 : 0;
            top = (imgHeight - 50) > 20 ? 25 : 0;
            $(photoCutDom).find(".cutting-area").css({
                width: `${(imgWidth - 50) > 20 ? (imgWidth - 50) : imgWidth}px`,
                height: `${(imgHeight - 50) > 20 ? (imgHeight - 50) : imgHeight}px`,
                left: `${left}px`,
                top: `${top}px`,
            });
        } else if (window.square === 'true') {
            // 按照正方形来截图
            // 获取最短的边
            let minSide = Math.min(imgWidth, imgHeight);
            // 获取居中显示的位置
            left = ((minSide - 50) > 20) ? ((imgWidth - minSide + 50) / 2) : 0;
            top = ((minSide - 50) > 20) ? ((imgHeight - minSide + 50) / 2) : 0;
            $(photoCutDom).find(".cutting-area").css({
                width: `${(imgWidth - 50) > 20 ? (minSide - 50) : minSide}px`,
                height: `${(imgHeight - 50) > 20 ? (minSide - 50) : minSide}px`,
                left: `${left}px`,
                top: `${top}px`,
            });
        }
        // 设置图片范围
        $(photoCutDom).find(".img-frame").css({
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
        });
        // 设置截图区域的背景大小以及要显示的区域
        $(photoCutDom).find(".img-display").css({
            backgroundSize: `${imgWidth}px ${imgHeight}px`,
            backgroundPosition: `-${left}px -${top}px`,
        });
        // 图片裁剪预览
        let startX = (imgWidth - 50) > 20 ? 25 : 0;
        let startY = (imgHeight - 50) > 20 ? 25 : 0;
        let areaWidth = $(photoCutDom).find(".cutting-area").width();
        let areaHeight = $(photoCutDom).find(".cutting-area").height();
        drawPrevImg(photoCutDom, startX, startY, areaWidth, areaHeight);
    });
}


/**
 * 移动剪切区域
 * @param photoCutDom
 */
function moveCuttingArea(photoCutDom) {
    let imgFrame = $(photoCutDom).find(".img-frame");
    $(photoCutDom).find(".click-area").mousedown(function (e) {
        let cutArea = $(photoCutDom).find(".cutting-area");
        // 获取鼠标距离元素的位置
        let disx = e.pageX;
        let disy = e.pageY;
        // 获取初始的left跟top
        let startLeft = $(cutArea).position().left;
        let startTop = $(cutArea).position().top;
        $(document).mousemove((e) => {
            let left = e.pageX - disx + startLeft;
            let top = e.pageY - disy + startTop;
            // 限制移动框的大小
            left = Math.max(0, left);
            left = Math.min(imgFrame.width() - $(cutArea).width(), left);
            top = Math.max(0, top);
            top = Math.min(imgFrame.height() - $(cutArea).height(), top);
            // 移动选框
            $(cutArea).css({
                left: `${left}px`,
                top: `${top}px`,
            });
            // 将选框中的内容进行移动
            $(photoCutDom).find(".img-display").css({
                backgroundPosition: `-${left}px -${top}px`,
            });
            // 更换预览图
            drawPrevImg(photoCutDom, left, top, $(cutArea).width(), $(cutArea).height());
        });
    });
    $(document).mouseup(function (e) {
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
    if (window.square === 'false') {
        // 上面调整大小
        $(photoCutDom).find(".resize-line-up").mousedown(function (e) {
            // 取消移动事件
            $(photoCutDom).find(".cutting-area").unbind('mousemove');
            let startHeight = cuttingArea.height();
            let startMouseY = e.pageY;
            let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
            let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top - 5;
            $(document).mousemove((event) => {
                upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
            });
        });
        // 下面调整大小
        $(photoCutDom).find(".resize-line-down").mousedown(function (e) {
            // 取消移动事件
            $(photoCutDom).find(".cutting-area").unbind('mousemove');
            let startHeight = cuttingArea.height();
            let startMouseY = e.pageY;
            let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
            let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
            $(document).mousemove((event) => {
                downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
            });
        });
        // 左边调整大小
        $(photoCutDom).find(".resize-line-left").mousedown(function (e) {
            // 取消移动事件
            $(photoCutDom).find(".cutting-area").unbind('mousemove');
            let startWidth = cuttingArea.width();
            let startMouseX = e.pageX;
            let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
            let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
            $(document).mousemove((event) => {
                leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
            });
        });
        // 右边调整大小
        $(photoCutDom).find(".resize-line-right").mousedown(function (e) {
            // 取消移动事件
            $(photoCutDom).find(".cutting-area").unbind('mousemove');
            let startWidth = cuttingArea.width();
            let startMouseX = e.pageX;
            let startRight = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().right;
            let startLeft = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().left;
            $(document).mousemove((event) => {
                rightMove(event, photoCutDom, startMouseX, startRight, startLeft, startWidth, imgFrame, cuttingArea);
            });
        });
    }
    // 左上调整大小
    $(photoCutDom).find(".cutting-point-left-up").mousedown(function (e) {
        // 取消移动事件
        $(photoCutDom).find(".cutting-area").unbind('mousemove');
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
        let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top - 5;
        $(document).mousemove((event) => {
            if (window.square === 'false') {
                upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
                leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
            } else if (window.square === 'true') {
                moveBySquareLEFTUP(event, photoCutDom, startMouseX, startLeft, startTop,
                    startBottom, startRight, startHeight, startWidth, cuttingArea);
            }
        });
    });
    // 左下调整大小
    $(photoCutDom).find(".cutting-point-left-down").mousedown(function (e) {
        // 取消移动事件
        $(photoCutDom).find(".cutting-area").unbind('mousemove');
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left - 5;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
        let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
        $(document).mousemove((event) => {
            if (window.square === 'false') {
                leftMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
                downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
            } else if (window.square === 'true') {
                moveBySquareLEFTDOWN(event, photoCutDom, startMouseX, startLeft, startRight,
                    startBottom, startHeight, startWidth, cuttingArea);
            }
        });
    });
    // 右上调整大小
    $(photoCutDom).find(".cutting-point-right-up").mousedown(function (e) {
        // 取消移动事件
        $(photoCutDom).find(".cutting-area").unbind('mousemove');
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().right;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startTop = cuttingArea.get(0).getBoundingClientRect().top - imgFrame.get(0).getBoundingClientRect().top;
        let startBottom = cuttingArea.get(0).getBoundingClientRect().bottom - imgFrame.get(0).getBoundingClientRect().top;
        let squareStartRight = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().right;
        $(document).mousemove((event) => {
            if (window.square === 'false') {
                rightMove(event, photoCutDom, startMouseX, startRight, startLeft, startWidth, imgFrame, cuttingArea);
                upMove(event, photoCutDom, startMouseY, startTop, startBottom, startHeight, imgFrame, cuttingArea);
            } else if (window.square === 'true') {
                moveBySquareRIGHTUP(event, photoCutDom, startMouseX, startHeight, startWidth,
                    squareStartRight, startTop, startBottom, cuttingArea);
            }
        });
    });
    // 右下调整大小
    $(photoCutDom).find(".cutting-point-right-down").mousedown(function (e) {
        // 取消移动事件
        $(photoCutDom).find(".cutting-area").unbind('mousemove');
        let startWidth = cuttingArea.width();
        let startMouseX = e.pageX;
        let startLeft = cuttingArea.get(0).getBoundingClientRect().left - imgFrame.get(0).getBoundingClientRect().left;
        let startRight = cuttingArea.get(0).getBoundingClientRect().right - imgFrame.get(0).getBoundingClientRect().left;
        let startHeight = cuttingArea.height();
        let startMouseY = e.pageY;
        let startBottom = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().bottom;
        let startTop = imgFrame.get(0).getBoundingClientRect().bottom - cuttingArea.get(0).getBoundingClientRect().top;
        let squareStartRight = imgFrame.get(0).getBoundingClientRect().right - cuttingArea.get(0).getBoundingClientRect().right;
        $(document).mousemove((event) => {
            if (window.square === "false") {
                rightMove(event, photoCutDom, startMouseX, startLeft, startRight, startWidth, imgFrame, cuttingArea);
                downMove(event, photoCutDom, startMouseY, startBottom, startTop, startHeight, imgFrame, cuttingArea);
            } else if (window.square === "true") {
                moveBySquareRIGHTDOWN(event, photoCutDom, startMouseX, startBottom,
                    squareStartRight, startHeight, startWidth, cuttingArea);
            }
        });
    });
    // 清除事件
    $(document).mouseup(() => {
        $(document).unbind('mousemove');
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
function upMove(event, photoCutDom, startMouseY, startTop, startBottom,
                startHeight, imgFrame, cuttingArea) {
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
        // height = Math.max(0, height);
        // height = Math.min(imgFrame.height(), height);
        $(cuttingArea).css({
            height: height + 'px',
        });
        // 调整预览图
        drawPrevImg(photoCutDom, $(cuttingArea).position().left, top, $(cuttingArea).width(), height);
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
function downMove(event, photoCutDom, startMouseY, startBottom,
                  startTop, startHeight, imgFrame, cuttingArea) {
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
        // height = Math.max(0, height);
        // height = Math.min(imgFrame.height(), height);
        $(cuttingArea).css({
            height: height + 'px',
        });
        // 调整预览图
        drawPrevImg(photoCutDom, $(cuttingArea).position().left,
            $(cuttingArea).position().top, $(cuttingArea).width(), height);
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
function leftMove(event, photoCutDom, startMouseX, startLeft, startRight,
                  startWidth, imgFrame, cuttingArea) {
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
        // width = Math.max(0, width);
        // width = Math.min(imgFrame.width(), width);
        $(cuttingArea).css({
            width: width + 'px',
        });
        // 调整预览图
        drawPrevImg(photoCutDom, left, $(cuttingArea).position().top, width, $(cuttingArea).height());
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
function rightMove(event, photoCutDom, startMouseX, startRight, startLeft,
                   startWidth, imgFrame, cuttingArea) {
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
        // width = Math.max(0, width);
        // width = Math.min(imgFrame.width(), width);
        $(cuttingArea).css({
            width: width + 'px',
        });
        // 调整预览图的大小
        drawPrevImg(photoCutDom, $(cuttingArea).position().left, $(cuttingArea).position().top,
            width, $(cuttingArea).height());
    }
    // 调整截图区域的大小
    $(cuttingArea).css({
        right: `${right}px`,
    });
}


/**
 * 进行图片预览
 * @param photoCutDom
 * @param startX
 * @param startY
 * @param imgWidth
 * @param imgHeight
 */
function drawPrevImg(photoCutDom, startX, startY, imgWidth, imgHeight) {
    // 获取图片对象
    let imgDom = $(photoCutDom).find('img').get(0);
    // 获取画布
    let canvas = $(photoCutDom).find("canvas").get(0);
    let ctx = canvas.getContext('2d');
    // 获取图片的真实大小
    let realWidth = imgDom.naturalWidth;
    let realHeight = imgDom.naturalHeight;
    // 获取缩小比例
    let widthRate = realWidth / $(imgDom).width();
    let heightRate = realHeight / $(imgDom).height();
    // 设置截图区域的真实大小
    let cutWidth = widthRate * imgWidth;
    let cutHeight = heightRate * imgHeight;
    // 获取要展示的图片的宽高，没有就以100像素展示
    let targetImg = $(`.${window.preViewClass}`);
    targetImg.each((index, item) => {
        let targetImageWidth = $(item).width() || 100;
        let targetImageHeight = $(item).height() || 100;
        // 设置画布的大小
        $(photoCutDom).find('canvas').attr('width', targetImageWidth);
        $(photoCutDom).find('canvas').attr('height', targetImageHeight);
        // 将裁剪后的图片布置在画布上
        ctx.drawImage(imgDom, startX * widthRate, startY * heightRate, cutWidth, cutHeight, 0, 0, targetImageWidth, targetImageHeight);
        // 获取图片url
        let imgUrl = canvas.toDataURL("image/png");
        // 赋值给图片
        $(item).attr("src", imgUrl);
    });
}


/**
 * 移动正方形-左上
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startLeft
 * @param startTop
 * @param startBottom
 * @param startRight
 * @param startHeight
 * @param startWidth
 * @param cuttingArea
 */
function moveBySquareLEFTUP(event, photoCutDom, startMouseX, startLeft, startTop,
                            startBottom, startRight, startHeight, startWidth, cuttingArea) {
    let moveX = event.pageX - startMouseX;
    let left = startLeft + moveX;
    let top = startTop + moveX;
    // 限制大小
    top = Math.max(0, top);
    top = Math.min(startBottom, top);
    left = Math.max(0, left);
    left = Math.min(startRight, left);

    if (left > 0 && top > 0) {
        let height = startHeight - moveX;
        let width = startWidth - moveX;
        height = Math.max(1, height);
        width = Math.max(1, width);
        $(cuttingArea).css({
            height: height + 'px',
            width: width + 'px',
        });
        // 调整截图区域的大小
        $(cuttingArea).css({
            top: `${top}px`,
            left: `${left}px`,
        });
        // 调整截图区域的图片位置
        $(photoCutDom).find(".img-display").css({
            backgroundPositionY: `-${top}px`,
            backgroundPositionX: `-${left}px`,
        });
        // 调整预览图
        drawPrevImg(photoCutDom, left, top, width, height);
    }
}


/**
 * 移动正方形-左下
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startLeft
 * @param startRight
 * @param startBottom
 * @param startHeight
 * @param startWidth
 * @param cuttingArea
 */
function moveBySquareLEFTDOWN(event, photoCutDom, startMouseX, startLeft,
                              startRight, startBottom, startHeight, startWidth, cuttingArea) {
    let moveX = event.pageX - startMouseX;
    let left = startLeft + moveX;
    let bottom = startBottom + moveX;
    // 限制大小
    left = Math.max(0, left);
    left = Math.min(startRight, left);

    if (bottom > 0 && left > 0) {
        let height = startHeight - moveX;
        let width = startWidth - moveX;
        height = Math.max(1, height);
        width = Math.max(1, width);
        $(cuttingArea).css({
            height: height + 'px',
            width: width + 'px',
        });
        // 调整截图区域的大小
        $(cuttingArea).css({
            left: `${left}px`,
        });
        // 调整截图区域的图片位置
        $(photoCutDom).find(".img-display").css({
            backgroundPositionX: `-${left}px`,
        });
        drawPrevImg(photoCutDom, left, $(cuttingArea).position().top, width, height);
    }
}


/**
 * 移动正方形-右下
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startBottom
 * @param startRight
 * @param startHeight
 * @param startWidth
 * @param cuttingArea
 */
function moveBySquareRIGHTDOWN(event, photoCutDom, startMouseX, startBottom,
                               startRight, startHeight, startWidth, cuttingArea) {
    let moveX = event.pageX - startMouseX;
    let right = startRight - moveX;
    let bottom = startBottom - moveX;
    if (right > 0 && bottom > 0) {
        let height = startHeight + moveX;
        let width = startWidth + moveX;
        height = Math.max(1, height);
        width = Math.max(1, width);
        $(cuttingArea).css({
            height: height + 'px',
            width: width + 'px',
        });
        drawPrevImg(photoCutDom, $(cuttingArea).position().left, $(cuttingArea).position().top, width, height);
    }
}


/**
 * 移动正方形-右上
 * @param event
 * @param photoCutDom
 * @param startMouseX
 * @param startHeight
 * @param startWidth
 * @param startRight
 * @param startTop
 * @param startBottom
 * @param cuttingArea
 */
function moveBySquareRIGHTUP(event, photoCutDom, startMouseX, startHeight, startWidth,
                             startRight, startTop, startBottom, cuttingArea) {
    let moveX = event.pageX - startMouseX;
    let top = startTop - moveX;
    let right = startRight - moveX;
    // 限制大小
    top = Math.max(0, top);
    top = Math.min(startBottom, top);

    if (right > 0 && top > 0) {
        let height = startHeight + moveX;
        let width = startWidth + moveX;
        height = Math.max(1, height);
        width = Math.max(1, width);
        // 调整截图区域的大小
        $(cuttingArea).css({
            height: height + 'px',
            width: width + 'px',
        });
        $(cuttingArea).css({
            top: `${top}px`,
        });
        // 调整截图区域的图片位置
        $(photoCutDom).find(".img-display").css({
            backgroundPositionY: `-${top}px`,
        });
        drawPrevImg(photoCutDom, $(cuttingArea).position().left, top, width, height);
    }
}


