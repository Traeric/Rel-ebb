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
                        <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''}>
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

    // 获取FileUpload标签
    let fileUpload = $("FileUpload");
    if (fileUpload.length > 0) {
        fileUpload.each((index, file) => {
            // 获取参数
            let paramFunc = $(file).attr('param');
            let paramObj = eval(paramFunc)();
            // 初始化对象
            paramObj = defaultFileParam(paramObj);

            let fileDom = $(`
                <div class="rel-ebb-img-upload">
                    <div class="upload-button">
                        <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''}>
                        <button class="file-button upload">选择文件</button>
                        ${paramObj.autoUpload ? '' : '<button class="start-upload">开始上传</button>'}
                    </div>
                    <div class="file-upload-display">
                        <div class="progress-bar">
                            <div class="color"></div>
                        </div>
                    </div>
                </div>
            `);

            // 替换掉FileUpload标签
            $(file).replaceWith(fileDom);
            // 处理上传事件
            if (paramObj.autoUpload) {
                // 自动上传
                dealWithFileUpload(fileDom, paramObj);
            } else {
                dealWithFileUploadWithoutAuto(fileDom, paramObj);
            }
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
        if (paramObj.acceptFile.indexOf(surfix.toLowerCase()) === -1) {
            // 不是图片类型
            paramObj.error !== undefined && paramObj.error(2, "请上传图片");
            return;
        }
        if (paramObj.maxSize !== -1 && paramObj.maxSize < fileObj.size / 1024) {
            paramObj.error !== undefined && paramObj.error(1, "图片过大");
            return;
        }
        // 封装上传信息
        let formData = new FormData();
        formData.append(paramObj.fileName, fileObj);
        // 获取url
        let src = URL.createObjectURL(fileObj);
        $.ajax({
            url: paramObj.url,
            type: paramObj.method,
            data: formData,
            timeout: paramObj.timeout,
            processData: false,   // 告诉jQuery不要处理数据
            contentType: false,   // 告诉jQuery不要设置类型
            success(data) {
                // 上传成功，进行回显
                let imgDom = $(`
                    <div class="img">
                        <div class="inner">
                            <div class="cover success"></div>
                            <div class="info success">上传成功</div>
                            <img src="${src}" alt="NO IMG">
                        </div>
                    </div>   
                `);
                $(imageDom).find(".upload-display").empty().append(imgDom);
                // 执行成功方法
                paramObj.success !== undefined && paramObj.success(data);
            },
            error(message, ...optionalParams) {
                // 上传失败，进行回显
                let imgDom = $(`
                    <div class="img">
                        <div class="inner">
                            <div class="cover error"></div>
                            <div class="info error">上传失败</div>
                            <img src="${src}" alt="NO IMG">
                        </div>
                    </div>   
                `);
                $(imageDom).find(".upload-display").empty().append(imgDom);
                // 执行失败方法
                paramObj.error !== undefined && paramObj.error(0, message);
            }
        });
    });
}


/**
 * 初始化文件的默认参数
 * @param paramObj
 * @returns {*}
 */
function defaultFileParam(paramObj) {
    paramObj.url = paramObj.url !== undefined ? paramObj.url : "";
    paramObj.method = paramObj.method !== undefined ? paramObj.method : "post";
    paramObj.maxSize = paramObj.maxSize !== undefined ? parseInt(paramObj.maxSize) : -1;
    paramObj.fileName = paramObj.fileName !== undefined ? paramObj.fileName : "file";
    paramObj.autoUpload = paramObj.autoUpload !== undefined ? paramObj.autoUpload : true;
    paramObj.uploadMultiple = paramObj.uploadMultiple !== undefined ? paramObj.uploadMultiple : false;
    paramObj.parallelNum = paramObj.parallelNum !== undefined ? paramObj.parallelNum : -1;
    paramObj.timeout = paramObj.timeout !== undefined ? paramObj.timeout : 30000;  // 默认30秒
    return paramObj;
}


/**
 * 处理文件上传(自动上传)
 * @param fileDom
 * @param paramObj
 */
function dealWithFileUpload(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let fileObj = $(this).get(0).files[0];
        fileUploadCommon(paramObj, fileObj, (data) => {
            // 上传成功，进行回显
            let successDom = $(`
                    <div class="file-name">
                        <div class="word">
                            ${fileObj.name}
                        </div>
                        <div class="status-item-success">上传成功</div>
                        <div class="icon success"></div>
                    </div>
                `);
            $(fileDom).find(".file-upload-display").empty().append(successDom);
        }, (data) => {
            // 上传失败，进行回显
            let errorDom = $(`
                    <div class="file-name">
                        <div class="word">
                            ${fileObj.name}
                        </div>
                        <div class="status-item-error">上传失败</div>
                        <div class="icon error"></div>
                    </div>
                `);
            $(fileDom).find(".file-upload-display").empty().append(errorDom);
        });
    });
}


/**
 * 处理文件上传(非自动上传)
 * @param fileDom
 * @param paramObj
 */
function dealWithFileUploadWithoutAuto(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let fileObj = $(this).get(0).files[0];
        // 将文件名显示在页面上
        let fileInfo = $(`
            <div class="file-name">
                <div class="word">
                    ${fileObj.name}
                </div>
            </div>
        `);
        $(fileDom).find(".file-upload-display").empty().append(fileInfo);
        // 为上传按钮设置点击事件
        $(fileDom).find("button.start-upload").click(() => {
            fileUploadCommon(paramObj, fileObj, (data) => {
                // 上传成功，进行回显
                fileInfo.append(`
                    <div class="status-item-success">上传成功</div>
                    <div class="icon success"></div>
                `);
            }, (data) => {
                // 上传失败，进行回显
                fileInfo.append(`
                    <div class="status-item-error">上传失败</div>
                    <div class="icon error"></div>
                `);
            });
        });
    });
}


/**
 * js监听文件上传进度
 * @param fun
 * @returns {Function}
 */
let xhrOnProgress = function (fun) {
    xhrOnProgress.onprogress = fun; // 绑定监听
    // 使用闭包实现监听绑
    return function () {
        // 通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        let xhr = $.ajaxSettings.xhr();
        // 判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function') {
            return xhr;
        }
        // 如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
};


/**
 * 文件上传共同代码
 * @param paramObj
 * @param fileObj
 * @param successCallback
 * @param errorCallback
 */
function fileUploadCommon(paramObj, fileObj, successCallback, errorCallback) {
    // 检测上传文件是否符合要求
    let surfixArr = fileObj.name.split('.');
    let surfix = surfixArr[surfixArr.length - 1];
    if (paramObj.acceptFile !== undefined && paramObj.acceptFile.indexOf(surfix.toLowerCase()) === -1) {
        // 上传的文件类型不在指定类型范围内
        paramObj.error !== undefined && paramObj.error(2, "类型不允许");
        return;
    }
    if (paramObj.refuseFile !== undefined && paramObj.refuseFile.indexOf(surfix.toLowerCase()) !== -1) {
        // 上传的文件类型在拒绝的类型中
        paramObj.error !== undefined && paramObj.error(2, "类型不允许");
        return;
    }
    if (paramObj.maxSize !== -1 && paramObj.maxSize < fileObj.size / 1024) {
        paramObj.error !== undefined && paramObj.error(1, "文件过大");
        return;
    }
    // 封装上传信息
    let formData = new FormData();
    formData.append(paramObj.fileName, fileObj);
    // 发送请求
    $.ajax({
        url: paramObj.url,
        type: paramObj.method,
        data: formData,
        timeout: paramObj.timeout,
        processData: false,   // 告诉jQuery不要处理数据
        contentType: false,   // 告诉jQuery不要设置类型
        xhr: xhrOnProgress(function (e) {
            let percent = e.loaded / e.total;//文件上传百分比
            console.log(percent);
        }),
        success(data) {
            // 执行成功回调
            successCallback(data);
            // 执行成功方法
            paramObj.success !== undefined && paramObj.success(data);
        },
        error(message, ...optionalParams) {
            // 执行失败回调
            errorCallback(message);
            // 执行失败方法
            paramObj.error !== undefined && paramObj.error(0, message);
        }
    });
}


