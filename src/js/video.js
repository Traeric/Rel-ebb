$(function () {
    // 检测是否有Video标签
    let videoArr = $("RelEbbVideo");
    if (videoArr.length > 0) {
        // 有RelEbbVideo标签
        videoArr.each((index, video) => {
            // 获取RelEbbVideo内部的代码，这段代码会被添加到项目的顶部
            let topCode = $(video).html();
            // 获取RelEbbVideo的参数
            let videoSrc = $(video).attr("src");
            let autoPlay = $(video).attr('auto-play');

            // 替换的字符串
            let videoBoxDom = $(`
                <div class="rel-ebb-video-box">
                    <video class="rel-ebb-video" src="${videoSrc}" ${autoPlay === undefined ? '' : 'autoplay'}></video>
                    <!-- 进度条 -->
                    <div class="rel-ebb-progress-bar">
                        <div class="bar">
                            <div class="setted"></div>
                            <div class="btn"></div>
                            <div class="rest"></div>
                        </div>
                    </div>
                    <!-- 视频底部控件 -->
                    <div class="rel-ebb-controls">
                        <div class="left">
                            <div class="play">
                                <div class="img play" title="播放"></div>
                            </div>
                            <div class="time-broadcast" title="时长">
                                <span class="current">00:00</span>
                                /
                                <span class="duration">00:00</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="voice">
                                <div class="img" title="声音"></div>
                                <div class="voice-panel">
                                    <div class="color">
                                        <div class="number">0</div>
                                        <div class="show">
                                            <div class="total">
                                                <div class="rest"></div>
                                                <div class="btn"></div>
                                                <div class="seted"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="connect"></div>
                                </div>
                            </div>
                            <div class="cycle">
                                <div class="img cycle-none" title="循环"></div>
                            </div>
                            <div class="definition">
                                <div class="definition-item" title="清晰度">360P</div>
                                <ul class="definition-list">
                                    <div class="color">
                                        <li data-definition="0">超清 1080P
                                            <div class="logo"></div>
                                        </li>
                                        <li data-definition="1">高清 720P</li>
                                        <li data-definition="2">清晰 480P</li>
                                        <li data-definition="3">流畅 360P</li>
                                        <li data-definition="4">自动</li>
                                    </div>
                                    <li class="connect"></li>
                                </ul>
                            </div>
                            <div class="speed">
                                <div class="speed-item" title="播放速度">1.0x</div>
                                <ul class="speed-list">
                                    <div class="color">
                                        <li data-speed="2.0">2.0倍速
                                            <div class="logo"></div>
                                        </li>
                                        <li data-speed="1.5">1.5倍速</li>
                                        <li data-speed="1.0">1.0倍速</li>
                                        <li data-speed="0.5">0.5倍速</li>
                                    </div>
                                    <li class="connect"></li>
                                </ul>
                            </div>
                            <div class="full-screen">
                                <div class="img" title="全屏"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 视频面板 -->
                    <div class="video-panel">
                        <div class="top-column">
                            ${topCode}
                        </div>
                    </div>
                </div>
            `);
            // 替换掉页面的Video标签
            $(video).replaceWith(videoBoxDom);
            /**
             * 对视频进行预处理
             * @type {*|jQuery|Array}
             */
            let videoDom = $(videoBoxDom).find('video');
            // 获取视频的时长以及声音等初始信息
            videoDom.get(0).oncanplay = () => {
                let duration = videoDom.get(0).duration;
                // 格式化时间
                let formatDuration = formatTimetoStandard(duration);
                // 设置给页面
                $(".rel-ebb-video-box .duration").html(formatDuration);
            };
            // 获取声音
            let voice = videoDom.get(0).volume;
            voiceBar(videoBoxDom, voice * 100);
            // 播放过程中实时更新时间以及进度条
            videoDom.get(0).addEventListener("timeupdate", () => {
                // 获取当前播放时间
                let currentTime = videoDom.get(0).currentTime;
                // 格式化时间
                let formatCurrentTime = formatTimetoStandard(currentTime);
                $(".rel-ebb-video-box .current").html(formatCurrentTime);

                // 换算当前视频播放到的百分比
                let percent = currentTime / videoDom.get(0).duration * 100;
                // 更新进度条
                progressBar(videoBoxDom, percent);
            });
            // 对视频的播放暂停进行监听
            videoDom.get(0).addEventListener('play', () => {
                // 更换成暂停按钮
                $(videoBoxDom).find('.play .img').removeClass('play').addClass('pause');
                $(videoBoxDom).find('.play .img').attr('title', '暂停');
                window.videoStart = true;
            });
            videoDom.get(0).addEventListener('pause', () => {
                // 更换成播放按钮
                $(videoBoxDom).find('.play .img').removeClass('pause').addClass('play');
                $(videoBoxDom).find('.play .img').attr('title', '播放');
                window.videoStart = false;
            });

            // 播放暂停视频
            playEvent(videoBoxDom, videoDom);
            // 循环视频
            cycle(videoBoxDom);
            // 修改视频速度
            changeSpeed(videoBoxDom);
            // 全屏
            fullScreen(videoBoxDom);
            // 声音控制
            voiceControlEvent(videoBoxDom);
        });
    }
});


/**
 * 格式化时间为标准时间
 * @param time
 */
function formatTimetoStandard(time = 0) {
    let hour = parseInt(time / 3600 + '');
    let min = parseInt(time % 3600 / 60 + '');
    let sec = parseInt(time % 3600 % 60 + '');
    return `${hour > 0 ? (hour > 10 ? hour : '0' + hour) + ':' : ''}
            ${min > 0 ? (min > 10 ? min : '0' + min) : '00'}:
            ${sec > 10 ? sec : '0' + sec}`;
}

/**
 * 播放暂停控制按钮
 * @param videoBoxDom
 * @param videoDom
 */
function playEvent(videoBoxDom, videoDom) {
    let jsVideDom = videoDom.get(0);
    $(videoBoxDom).find('.play .img').click(() => {
        window.videoStart ? jsVideDom.pause() : jsVideDom.play();
    });
}

/**
 * 更新进度条
 * @param videoBoxDom
 * @param percent
 */
function progressBar(videoBoxDom, percent) {
    $(videoBoxDom).find('.rel-ebb-progress-bar .setted').css('width', percent + '%');
    $(videoBoxDom).find('.rel-ebb-progress-bar .rest').css('width', (100 - percent) + '%');
    $(videoBoxDom).find('.rel-ebb-progress-bar .btn').css('left', `${percent < 50 ? percent + '%' : `calc(${percent}% - 12px)`}`);
}

/**
 * 设置声音的百分比
 * @param videoBoxDom
 * @param percent
 */
function voiceBar(videoBoxDom, percent) {
    $(videoBoxDom).find('.voice-panel .seted').css('height', percent + '%');
    $(videoBoxDom).find('.voice-panel .rest').css('height', (100 - percent) + '%');
    $(videoBoxDom).find('.voice-panel .btn').css('bottom', `${percent}%`);
    $(videoBoxDom).find('.voice-panel .number').html(percent);
}


/**
 * 循环播放
 * @param videoBoxDom
 */
function cycle(videoBoxDom) {
    let videoCycle = true;
    $(videoBoxDom).find('.cycle .img').click(function () {
        if (videoCycle) {
            // 循环
            $(videoBoxDom).find('video').attr('loop', 'loop');
            $(this).removeClass('cycle-none').addClass('cycle').attr('title', '关闭循环');
        } else {
            // 不循环
            $(videoBoxDom).find('video').removeAttr('loop');
            $(this).removeClass('cycle').addClass('cycle-none').attr('title', '循环');
        }
        videoCycle = !videoCycle;
    });
}


/**
 * 修改视频速度
 * @param videoBoxDom
 */
function changeSpeed(videoBoxDom) {
    $(videoBoxDom).find('.speed-list').click(e => {
        let currentDom = e.target;
        if (currentDom.localName === 'li') {
            // 获取当前点击的速度
            let speed = $(currentDom).data('speed');
            $(videoBoxDom).find('video').get(0).playbackRate = speed;
            // 修改底部显示的文字
            $(videoBoxDom).find('.speed-item').html(speed + 'x');
        }
    });
}


/**
 * 全屏
 * @param videoBoxDom
 */
function fullScreen(videoBoxDom) {
    $(videoBoxDom).find('.full-screen .img').click(() => {
        let element = $(videoBoxDom).find('video').get(0);
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    });
}


/**
 * 调整声音
 * @param videoBoxDom
 */
function voiceControlEvent(videoBoxDom) {
    $(videoBoxDom).find(".voice-panel .total .btn").mousedown(function () {
        $(this).bind("mousemove", voiceControl);
    });
    $(videoBoxDom).find(".voice-panel .total .btn").mouseup(function () {
        $(this).unbind('mousemove', voiceControl);
    });

    $(videoBoxDom).find(".voice-panel .total .btn").mouseout(function () {
        $(this).unbind('mousemove', voiceControl);
    });
}

function voiceControl(e) {
    // 获取鼠标的y轴的位置
    let mouseY = e.clientY + 6;
    // 获取包裹音量条的顶部距离浏览器顶部的长度
    let top = $(e.currentTarget).parents('.total').get(0).getBoundingClientRect().top;
    // 设置音量条的位置
    let totalHeight = $(e.currentTarget).parents('.total').height();
    let percent = parseInt(((totalHeight - (mouseY - top)) / totalHeight) * 100 + '');
    // 限制大小
    percent = Math.max(0, percent);
    percent = Math.min(100, percent);
    voiceBar($(e.currentTarget).parents('.rel-ebb-video-box').get(0), percent);

    // 设置音量
    let voice = (totalHeight - (mouseY - top)) / totalHeight;
    voice = Math.max(0, voice);
    voice = Math.min(1, voice);
    $(e.currentTarget).parents('.rel-ebb-video-box').find('video').get(0).volume = voice;
}


function progressBarEvent(videoBoxDom) {
    
}

