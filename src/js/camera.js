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
        //这里介绍新的方法，返回一个 Promise对象
        // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
        // then()是Promise对象里的方法
        // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
        // 避免数据没有获取到
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise.then(function (MediaStream) {
            window.mediaStreamTrack = typeof MediaStream.stop === 'function' ? MediaStream : MediaStream.getTracks()[1];
            video.srcObject = MediaStream;
            video.muted = true;
            video.play();
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
            let canvas = $(cameraDom).find('canvas').css("transform", "rotateY(180deg)").get(0);
            canvas.width = $(video).width();
            canvas.height = $(video).height();
            let ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            // 卸载
            let img = canvas.toDataURL("image/png");
            let triggerDownload = $(cameraDom).find('.show-photo a').attr("href", img).attr("download", photoName + ".png");
            triggerDownload[0].click();
        } else {
            alert("请开启摄像头");
        }
    });
}
