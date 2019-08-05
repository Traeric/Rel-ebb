$(function () {
    // 获取Camera标签
    let cameraDoms = $("Camera");
    if (cameraDoms.length > 0) {
        cameraDoms.each((index, camera) => {
            // 获取参数
            let photoName = $(camera).attr("photoName") || "rel-ebb";

            let cameraDom = $(`
                <div class="rel-ebb-camera-box">
                    <div class="show-photo">
                        <video autoplay id="rel-ebb-camera"></video>
                        <canvas></canvas>
                        <a></a>
                    </div>
                    <div class="btns">
                        <button class="take-photo-btn open">开启摄像头</button>
                        <button class="take-photo-btn close">关闭摄像头</button>
                        <button class="take-photo-btn take">拍 照</button>
                    </div>
                </div>
            `);
            // 替换
            $(camera).replaceWith(cameraDom);

            // 绑定三个点击事件
            openCamera(cameraDom);
            closeCamera(cameraDom);
            takePhoto(cameraDom, photoName);
        });
    }
});


/**
 * 打开摄像头
 * @param cameraDom
 */
function openCamera(cameraDom) {
    $(cameraDom).find('.btns .open').click(() => {
        //获得video摄像头区域
        let video = $(cameraDom).find('video').css('background-color', 'transparent').get(0);
        let constraints = {
            video: {width: $(video).width(), height: $(video).height()},
            audio: true
        };
        navigator.mediaDevices.getUserMedia(constraints).then(function (MediaStream) {
            window.mediaStreamTrack = typeof MediaStream.stop === 'function' ? MediaStream : MediaStream.getTracks()[1];
            video.srcObject = MediaStream;
            video.muted = true;
            video.onloadedmetadata = function () {
                video.play();
            };
        }).catch((err) => {
            if (err.name === "NotAllowedError") {
                alert("已禁止");
            } else if (err.name === "NotFoundError") {
                alert("没有找到摄像头");
            } else {
                alert("未知错误");
            }
        });
    });
}


/**
 * 关闭摄像头
 * @param cameraDom
 */
function closeCamera(cameraDom) {
    $(cameraDom).find('.btns .close').click(() => {
        if (window.mediaStreamTrack) {
            window.mediaStreamTrack.stop();
        }
    });
}


/**
 * 拍照
 * @param cameraDom
 * @param photoName
 */
function takePhoto(cameraDom, photoName) {
    $(cameraDom).find('.btns .take').click(() => {
        if (window.mediaStreamTrack && window.mediaStreamTrack.readyState === "live") {
            let video = $(cameraDom).find('video').get(0);
            let canvas = $(cameraDom).find('canvas').get(0);
            canvas.width = $(video).width();
            canvas.height = $(video).height();
            let ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0);
            // 下载
            let img = canvas.toDataURL("image/png");
            let triggerDownload = $(cameraDom).find('.show-photo a').attr("href", img).attr("download", photoName + ".png");
            triggerDownload[0].click();
        } else {
            alert("请开启摄像头");
        }
    });
}


