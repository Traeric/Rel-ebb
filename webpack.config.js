const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/main.js",
    output: {
        // path: path.resolve(__dirname, "dist"),   // build
        path: path.resolve(__dirname, "public"),    // dev
        filename: "js/rel-ebb.js",
        library: "rel-ebb",
        libraryTarget: "this",
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true,
        port: 80
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        },
                    },
                    {
                        loader: "css-loader"
                    },
                ],
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "stylus-loader",
                        options: {
                            modules: true
                        }
                    },
                ],
            },
            //暴露$和jQuery到全局
            {
                test: require.resolve('jquery'), // require.resolve 用来获取模块的绝对路�?
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            // 引入图片
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                    },
                ],
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.HotModuleReplacementPlugin(),
        // 分离css和js代码
        new MiniCssExtractPlugin({
            filename: "css/rel-ebb.css"
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin(),    // 压缩js代码
        ]
    }
};
