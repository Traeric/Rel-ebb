const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/rel-ebb-[hash].js",
        library: "rel-ebb",
        libraryTarget: "this",
    },
    devtool: 'null',
    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true,
        hot: true,
        port: 80
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [
                "style-loader",
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        modules: true
                    }
                },
                {
                    loader: "postcss-loader"
                }
            ],
        }]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.HotModuleReplacementPlugin(),
        // 分离css和js代码
        new MiniCssExtractPlugin({
            filename: "css/rel-ebb.css"
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin(),    // 压缩js代码
        ]
    }
};
