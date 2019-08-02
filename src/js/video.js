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


            // 获取视频的时长
            

            // 替换的字符串
            let videoDom = `
                <div class="rel-ebb-video-box">
                    <video class="rel-ebb-video" src="${videoSrc}"></video>
                    <!-- 视频底部控件 -->
                    <div class="rel-ebb-controls">
                        <div class="left">
                            <div class="play">
                                <div class="img" title="播放"></div>
                            </div>
                            <div class="time-broadcast" title="时长">
                                <span class="current">00:00</span>
                                /
                                <span class="total">56:37</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="voice">
                                <div class="img" title="声音"></div>
                                <div class="voice-panel">
                                    <div class="color">
                                        <div class="number">70</div>
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
                                <div class="img" title="循环"></div>
                            </div>
                            <div class="definition">
                                <div class="definition-item" title="清晰度">1080P</div>
                                <ul class="definition-list">
                                    <div class="color">
                                        <li>超清 1080P
                                            <div class="logo"></div>
                                        </li>
                                        <li>高清 720P</li>
                                        <li>清晰 480P</li>
                                        <li>流畅 360P</li>
                                        <li>自动</li>
                                    </div>
                                    <li class="connect"></li>
                                </ul>
                            </div>
                            <div class="speed">
                                <div class="speed-item" title="播放速度">1.5x</div>
                                <ul class="speed-list">
                                    <div class="color">
                                        <li>2.0倍速
                                            <div class="logo"></div>
                                        </li>
                                        <li>1.5倍速</li>
                                        <li>1.0倍速</li>
                                        <li>0.5倍速</li>
                                    </div>
                                    <li class="connect"></li>
                                </ul>
                            </div>
                            <div class="full-screen">
                                <div class="img" title="全屏"></div>
                            </div>
                            <div class="web-full-screen">
                                <div class="img" title="网页全屏"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 视频面板 -->
                    <div class="video-panel">
                        <div class="top-column">
            
                        </div>
                    </div>
                </div>
            `;

            // 替换掉页面的Video标签
            $(video).replaceWith(videoDom);
        });
    }
});