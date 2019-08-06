let http = require("http");
let https = require("https");
let url = require("url");

http.createServer(function (request, response) {
    // 获取参数
    let params = url.parse(request.url, true).query;
    if (request.url === "/img") {
        response.writeHead(200, {
            // 'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Origin': '*',         // 允许跨域
        });
        response.end("fdsa");
    }
}).listen(8888);

console.log("server running.... http://localhost:8888");
