$(function () {
    // 获取ImgUpload标签
    let imgUpload = $("ImgUpload");
    if (imgUpload.length > 0) {
        imgUpload.each((index, image) => {
            let imageDom = $(`
                <div class="rel-ebb-img-upload">
                    <div class="upload-button">
                        <input class="upload-input" type="file" name="image" title="">
                        <button class="upload">选择图片</button>
                    </div>
                    <div class="upload-display">
                        <div class="img">
                            <div class="inner">
                                <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3359634383,540379162&fm=26&gp=0.jpg"
                                     alt="NO IMG">
                            </div>
                        </div>
                        <div class="img">
                            <div class="inner">
                                <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3359634383,540379162&fm=26&gp=0.jpg"
                                     alt="NO IMG">
                            </div>
                        </div>
                    </div>
                </div>
            `);
            // 替换标签
            $(image).replaceWith(imageDom);
        });
    }
});