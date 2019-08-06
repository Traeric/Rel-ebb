$(function () {
    // 获取ImgUpload标签
    let imgUpload = $("ImgUpload");

    if (imgUpload.length > 0) {
        imgUpload.each((index, image) => {
            // 获取参数
            let paramFunc = $(image).attr("param");

            let paramObj = eval(paramFunc)();
            paramObj = defaultImgParam(paramObj);
            // 处理默认参数

            let imageDom = $(`
                <div class="rel-ebb-img-upload">
                    <div class="upload-button">
                        <input class="upload-input" type="file" name="image" title="" ${paramObj.uploadMultiple ? 'multiple' : ''}>
                        <button class="upload">选择图片</button>
                    </div>
                    <div class="upload-display"></div>
                </div>
            `);
            // 替换标签
            $(image).replaceWith(imageDom);
            // 监听input标签，处理图片上传
            dealWithImgUpload(imageDom, paramObj);
        });
    }
});


/**
 * 处理图片上传的默认参数
 * @param paramObj
 */
function defaultImgParam(paramObj) {
    paramObj.url = paramObj.url !== undefined ? paramObj.url : "";
    paramObj.method = paramObj.method !== undefined ? paramObj.method : "post";
    paramObj.maxSize = paramObj.maxSize !== undefined ? parseInt(paramObj.maxSize) : 0;
    paramObj.fileName = paramObj.fileName !== undefined ? paramObj.fileName : "image";
    paramObj.uploadMultiple = paramObj.uploadMultiple !== undefined ? paramObj.uploadMultiple : false;
    paramObj.parallelNum = paramObj.parallelNum !== undefined ? paramObj.parallelNum : -1;
    paramObj.timeout = paramObj.timeout !== undefined ? paramObj.timeout : 30000;  // 默认30秒
    // paramObj.acceptFile = paramObj.acceptFile !== undefined ? eval(paramObj.acceptFile) : "[]";
    // paramObj.refuseFile = paramObj.refuseFile !== undefined ? eval(paramObj.refuseFile) : "[]";
    paramObj.acceptFile = ["jpg", "gif", "png", "jpeg", "bmp", "tiff", "tga", "eps"];
    return paramObj;
}


/**
 * 处理图片上传
 * @param imageDom
 * @param paramObj
 */
function dealWithImgUpload(imageDom, paramObj) {
    $(imageDom).find("input[type=file]").change(function () {
        // 获取用户上传的图片信息
        let fileObj = $(this).get(0).files[0];
        // 检测上传图片是否符合要求
        let surfixArr = fileObj.name.split('.');
        let surfix = surfixArr[surfixArr.length - 1];
        if (paramObj.acceptFile.indexOf(surfix) === -1) {
            // 不是图片类型
            paramObj.error !== undefined && paramObj.error(2, "请上传图片");
            return;
        }
        if (paramObj.maxSize < fileObj.size / 1024) {
            paramObj.error !== undefined && paramObj.error(1, "图片过大");
            return;
        }
        // 封装上传信息
        let formData = new FormData();
        formData.append(paramObj.fileName, fileObj);
        $.ajax({
            url: paramObj.url,
            type: paramObj.method,
            data: formData,
            timeout: paramObj.timeout,
            processData: false,   // 告诉jQuery不要处理数据
            contentType: false,   // 告诉jQuery不要设置类型
            success(data) {
                // 上传成功，进行回显
                // 获取url
                let src = URL.createObjectURL(fileObj);
                let imgDom = $(`
                    <div class="img">
                        <div class="inner">
                            <div class="cover"></div>
                            <div class="info success">上传成功</div>
                            <img src="${src}" alt="NO IMG">
                        </div>
                    </div>   
                `);
                $(imageDom).find(".upload-display").append(imgDom);
                // 执行成功方法
                paramObj.success !== undefined && paramObj.success(data);
            },
            error(message, ...optionalParams) {
                paramObj.error !== undefined && paramObj.error(0, message);
            }
        });
    });
}

