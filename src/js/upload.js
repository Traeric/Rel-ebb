$(function () {
    // 获取ImgUpload标签
    let imgUpload = $("ImgUpload");
    if (imgUpload.length > 0) {
        imgUpload.each((index, image) => {
            // 获取参数
            let paramFunc = $(image).attr("param");
            let type = $(image).attr("type") || 'click';

            // 处理默认参数
            let paramObj = eval(paramFunc)();
            paramObj = defaultImgParam(paramObj);

            // 处理拖拽上传的样式
            let uploadDom = '';
            if (type === "click") {
                uploadDom = `
                    <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''}>
                    <button class="upload">选择图片</button>
                `;
            } else if (type === 'drag') {
                uploadDom = `
                    <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''} style="width: 0; height: 0;">
                    <div class="drag-area">
                        <div class="icon">
                            <div class="img"></div>
                        </div>
                        <div class="text">请点击上传，或者拖拽文件到此处</div>
                    </div>
                `;
            }
            let imageDom = $(`
                <div class="rel-ebb-img-upload">
                    <div class="upload-button">
                        ${uploadDom}
                    </div>
                    <div class="upload-display"></div>
                </div>
            `);
            // 替换标签
            $(image).replaceWith(imageDom);
            // 监听input标签，处理图片上传
            if (paramObj.uploadMultiple) {
                // 多图片上传
                dealWithImgUploadMultiply(imageDom, paramObj);
            } else {
                // 单图片上传
                dealWithImgUpload(imageDom, paramObj);
            }
            // 拖拽上传
            dragUpload(imageDom, paramObj, type);
        });
    }

    // 获取FileUpload标签
    let fileUpload = $("FileUpload");
    if (fileUpload.length > 0) {
        fileUpload.each((index, file) => {
            // 获取参数
            let paramFunc = $(file).attr('param');
            let type = $(file).attr("type") || 'click';

            // 初始化对象
            let paramObj = eval(paramFunc)();
            paramObj = defaultFileParam(paramObj);

            // 处理拖拽上传的样式
            let uploadDom = '';
            if (type === "click") {
                uploadDom = `
                    <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''}>
                    <button class="file-button upload">选择文件</button>
                    ${paramObj.autoUpload ? '' : '<button class="start-upload">开始上传</button>'}
                `;
            } else if (type === 'drag') {
                uploadDom = `
                    <input class="upload-input" type="file" title="" ${paramObj.uploadMultiple ? 'multiple' : ''} style="width: 0; height: 0;">
                    <div class="drag-area">
                        <div class="icon">
                            <div class="img"></div>
                        </div>
                        <div class="text">请点击上传，或者拖拽文件到此处</div>
                    </div>
                `;
            }
            let fileDom = $(`
                <div class="rel-ebb-img-upload">
                    <div class="upload-button">
                        ${uploadDom}
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
            if (paramObj.uploadMultiple) {
                // 多文件上传
                dealWithMultiplyFileUpload(fileDom, paramObj);
            } else {
                // 单文件上传
                dealWithSingleFileUpload(fileDom, paramObj);
            }
            // 拖拽上传
            dragUpload(fileDom, paramObj, type);
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
    paramObj.maxSize = paramObj.maxSize !== undefined ? parseInt(paramObj.maxSize) : -1;
    paramObj.fileName = paramObj.fileName !== undefined ? paramObj.fileName : "image";
    paramObj.uploadMultiple = paramObj.uploadMultiple !== undefined ? paramObj.uploadMultiple : false;
    paramObj.parallelNum = paramObj.parallelNum !== undefined ? paramObj.parallelNum : -1;
    paramObj.timeout = paramObj.timeout !== undefined ? paramObj.timeout : 30000;  // 默认30秒
    paramObj.acceptFile = ["jpg", "gif", "png", "jpeg", "bmp", "tiff", "tga", "eps"];
    return paramObj;
}


/**
 * 处理单个图片上传
 * @param imageDom
 * @param paramObj
 */
function dealWithImgUpload(imageDom, paramObj) {
    $(imageDom).find("input[type=file]").change(function () {
        // 获取用户上传的图片信息
        let fileObj = $(this).get(0).files[0];
        // 如果用户没有做选择
        if (!fileObj) {
            return;
        }
        let formData = new FormData();
        // 进行图片检测，是否符合上传规范
        let result = imageUploadCheckCommon(paramObj, fileObj, formData);
        if (result) {
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
        }
    });
}


/**
 * 处理多个图片上传
 * @param imageDom
 * @param paramObj
 */
function dealWithImgUploadMultiply(imageDom, paramObj) {
    $(imageDom).find("input[type=file]").change(function () {
        // 获取用户上传的图片信息
        let filesObj = $(this).get(0).files;
        let fileObjArr = Object.values(filesObj);
        // 如果用户没有选择文件，不做处理
        if (fileObjArr.length <= 0) {
            return;
        }
        // 检测是否超过了同时上传文件的限制
        if (paramObj.parallelNum !== -1 && paramObj.parallelNum < fileObjArr.length) {
            // 执行失败方法
            paramObj.error !== undefined && paramObj.error(3, "文件数量超过了限制");
            return;
        }
        let formData = new FormData();
        // 检测上传的图片是否符合规范
        fileObjArr.forEach((fileObj) => {
            // 进行图片检测，是否符合上传规范
            if (!imageUploadCheckCommon(paramObj, fileObj, formData)) {
                // 上传的图片不符合规范
                return null;
            }
        });
        // 所有的图片都符合规范，进行回显
        let successEcho = '';
        let errorEcho = '';
        fileObjArr.forEach((fileObj) => {
            let src = URL.createObjectURL(fileObj);
            successEcho += `
                <div class="img">
                    <div class="inner">
                        <div class="cover success"></div>
                        <div class="info success">上传成功</div>
                        <img src="${src}" alt="NO IMG">
                    </div>
                </div>  
            `;
            errorEcho += `
                <div class="img">
                    <div class="inner">
                        <div class="cover error"></div>
                        <div class="info error">上传失败</div>
                        <img src="${src}" alt="NO IMG">
                    </div>
                </div>  
            `;
        });
        // 发送ajax请求
        $.ajax({
            url: paramObj.url,
            type: paramObj.method,
            data: formData,
            timeout: paramObj.timeout,
            processData: false,   // 告诉jQuery不要处理数据
            contentType: false,   // 告诉jQuery不要设置类型
            success(data) {
                // 上传成功，进行回显
                $(imageDom).find(".upload-display").empty().append(successEcho);
                // 执行成功方法
                paramObj.success !== undefined && paramObj.success(data);
            },
            error(message, ...optionalParams) {
                // 上传失败，进行回显
                $(imageDom).find(".upload-display").empty().append(errorEcho);
                // 执行失败方法
                paramObj.error !== undefined && paramObj.error(0, message);
            }
        });
    });
}


/**
 * 进行图片上传检测
 * @param paramObj
 * @param fileObj
 * @param formData
 * @returns {boolean|*}
 */
function imageUploadCheckCommon(paramObj, fileObj, formData) {
    // 检测上传图片是否符合要求
    let surfixArr = fileObj.name.split('.');
    let surfix = surfixArr[surfixArr.length - 1];
    if (paramObj.acceptFile.indexOf(surfix.toLowerCase()) === -1) {
        // 不是图片类型
        paramObj.error !== undefined && paramObj.error(2, "请上传图片");
        return false;
    }
    if (paramObj.maxSize !== -1 && paramObj.maxSize < fileObj.size / 1024) {
        paramObj.error !== undefined && paramObj.error(1, "图片过大");
        return false;
    }
    // 封装上传信息
    formData.append(paramObj.fileName, fileObj);
    return true;
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
 * 单文件上传
 * @param fileDom
 * @param paramObj
 */
function dealWithSingleFileUpload(fileDom, paramObj) {
    if (paramObj.autoUpload) {    // 自动上传
        singleFileUploadAuto(fileDom, paramObj);
    } else {       // 非自动上传
        singleFileUploadWithoutAuto(fileDom, paramObj);
    }
}

// 单文件上传 - 自动上传
function singleFileUploadAuto(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let fileObj = $(this).get(0).files[0];
        // 如果用户没有做选择
        if (!fileObj) {
            return;
        }
        // 初始化进度条
        $(fileDom).find(".progress-bar .color").css("width", '0');
        fileUploadCommon(paramObj, fileObj, fileDom, (data) => {
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
            $(fileDom).find(".file-upload-display .file-name").remove();
            $(fileDom).find(".file-upload-display").append(successDom);
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
            $(fileDom).find(".file-upload-display .file-name").remove();
            $(fileDom).find(".file-upload-display").append(errorDom);
        });
    });
}


// 单文件上传 - 非自动上传
function singleFileUploadWithoutAuto(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let fileObj = $(this).get(0).files[0];
        // 如果用户没有做选择
        if (!fileObj) {
            return;
        }
        // 将文件名显示在页面上
        let fileInfo = $(`
            <div class="file-name">
                <div class="word">
                    ${fileObj.name}
                </div>
            </div>
        `);
        // 刷新显示区域
        $(fileDom).find(".progress-bar .color").css("width", '0');
        $(fileDom).find(".file-upload-display .file-name").remove();
        $(fileDom).find(".file-upload-display").append(fileInfo);
        // 为上传按钮设置点击事件
        $(fileDom).find("button.start-upload").click(() => {
            fileUploadCommon(paramObj, fileObj, fileDom, (data) => {
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
 * 多文件上传
 * @param fileDom
 * @param paramObj
 */
function dealWithMultiplyFileUpload(fileDom, paramObj) {
    if (paramObj.autoUpload) {
        multiplyFileUploadAuto(fileDom, paramObj);
    } else {
        multiplyFileUploadWithoutAuto(fileDom, paramObj);
    }
}


// 多文件上传 - 自动上传
function multiplyFileUploadAuto(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let filesObj = $(this).get(0).files;
        // 将文件对象转换成数组
        let fileObjArr = Object.values(filesObj);
        // 用户没有选择文件
        if (fileObjArr.length <= 0) {
            return;
        }
        // 检测是否超过了同时上传文件的限制
        if (paramObj.parallelNum !== -1 && paramObj.parallelNum < fileObjArr.length) {
            // 执行失败方法
            paramObj.error !== undefined && paramObj.error(3, "文件数量超过了限制");
            return;
        }
        // 一个一个上传
        // 清空显示区域
        $(fileDom).find(".file-upload-display .file-name").remove();
        fileObjArr.forEach((fileObj) => {
            // 初始化进度条
            $(fileDom).find(".progress-bar .color").css("width", '0');
            fileUploadCommon(paramObj, fileObj, fileDom, (data) => {
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
                $(fileDom).find(".file-upload-display").append(successDom);
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
                $(fileDom).find(".file-upload-display").append(errorDom);
            });
        });
        // 清空input的内容
        $(this).val('');
    });
}


// 多文件上传 - 非自动上传
function multiplyFileUploadWithoutAuto(fileDom, paramObj) {
    $(fileDom).find("input[type=file]").change(function () {
        // 获取用户上传的文件信息
        let filesObj = $(this).get(0).files;
        // 将文件对象转换成数组
        let fileObjArr = Object.values(filesObj);
        // 用户没有选择文件
        if (fileObjArr.length <= 0) {
            return;
        }
        // 检测是否超过了同时上传文件的限制
        if (paramObj.parallelNum !== -1 && paramObj.parallelNum < fileObjArr.length) {
            // 执行失败方法
            paramObj.error !== undefined && paramObj.error(3, "文件数量超过了限制");
            return;
        }
        // 将文件名显示在页面上
        $(fileDom).find(".file-upload-display .file-name").remove();
        $(fileDom).find(".progress-bar .color").css("width", '0');
        fileObjArr.forEach((fileObj) => {
            let fileInfo = $(`
                <div class="file-name">
                    <div class="word">
                        ${fileObj.name}
                    </div>
                </div>
            `);
            // 刷新显示区域
            $(fileDom).find(".file-upload-display").append(fileInfo);
        });
        // 为上传按钮设置点击事件
        $(fileDom).find("button.start-upload").unbind("click");
        $(fileDom).find("button.start-upload").click(() => {
            fileObjArr.forEach((fileObj, index) => {
                fileUploadCommon(paramObj, fileObj, fileDom, (data) => {
                    // 上传成功，进行回显
                    // 找到指定的dom
                    $(fileDom).find(`.file-upload-display .file-name:eq(${index})`).append(`
                        <div class="status-item-success">上传成功</div>
                        <div class="icon success"></div>
                    `);
                }, (data) => {
                    // 上传失败，进行回显
                    // 找到指定的dom
                    $(fileDom).find(`.file-upload-display .file-name:eq(${index})`).append(`
                        <div class="status-item-error">上传失败</div>
                        <div class="icon error"></div>
                    `);
                });
            });
            // 清空input的内容
            $(fileDom).find("input[type=file]").val('');
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
 * @param fileDom
 * @param successCallback
 * @param errorCallback
 */
function fileUploadCommon(paramObj, fileObj, fileDom, successCallback, errorCallback) {
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
            let percent = e.loaded / e.total;   // 文件上传百分比
            // 渲染进度条
            $(fileDom).find(".progress-bar .color").css("width", `${percent * 100}%`);
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


/**
 * 处理拖拽上传
 * @param dom
 * @param paramObj
 * @param type
 */
function dragUpload(dom, paramObj, type) {
    if (type === "drag") {
        let dragDom = $(dom).find(".drag-area").get(0);
        dragDom.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        dragDom.addEventListener("drop", (e) => {
            e.preventDefault();
            // 获取文件对象
            $(dom).find("input").get(0).files = e.dataTransfer.files;
            // 初始化change事件
            let event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, true);
            // 触发input=change事件
            $(dom).find("input").get(0).dispatchEvent(event);
        });
        $(dragDom).click(() => {
            $(dom).find("input").get(0).click();
        });
    }
}
