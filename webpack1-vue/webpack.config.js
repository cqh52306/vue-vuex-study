"use strict";

var webpack = require("webpack"),
    path = require("path"),
    projectRoot = path.resolve(__dirname, '../'),
    dfltPort = 2334,
    ip = require('ip').address(),
    HtmlWebpackPlugin = require('html-webpack-plugin'), //入口首页生成插件
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    WebpackSftpClient = require('webpack-sftp-client'),
    ZipPlugin = require('zip-webpack-plugin'), //自动压缩打包后的文件
    mode = process.argv[2] ? process.argv[2].replace('--', '') : '',
    publicPath = mode === "dev" ? "/assets/" : "./assets/";


module.exports = {
    entry: mode === "dev" ? [
        `webpack-dev-server/client?http://${ip}:${dfltPort}`,
        'webpack/hot/only-dev-server',
        './src/app.js'
    ] : './src/app.js',
    output: {
        path: path.join(__dirname, '/dist/assets'),
        publicPath: publicPath,
        filename: '[name].js'
    },
    devServer: {
        port: dfltPort,
        host: ip,
        contentBase: "./src",
        historyApiFallback: true,
        disableHostCheck: true,//解决invalid host header

        /*开发模式代理相应Ajax请求到指定服务器*/
        proxy: {
            '/api/*': {
                target: `http://${ip}:3000`
            },
        },
        publicPath: publicPath,
        noInfo: false
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../dist/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            // include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.scss$/,
            loader: "style-loader!css-loader!sass-loader"
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }]
    },
    devtool: 'cheap-module-source-map',
    vue: {
        loaders: {
            scss: ['vue-style-loader', 'css', 'sass'].join('!')
        },
        postcss: [
            require('postcss-flexbugs-fixes')(),
            require('autoprefixer')({
                browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9"
                ]
            })
        ]
    },
    plugins: mode === "dev" ? [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ] : [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new HtmlWebpackPlugin({
                favicon: 'src/static/imgs/favicon.ico',
                template: 'src/prod.html',
                filename: '../index.html',
                inject: 'body'
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                mangle: true
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.NoErrorsPlugin(),
            new ZipPlugin({
                path: path.join(__dirname, './dist'),
                filename: 'dist.zip',
                pathPrefix: 'assets'
            })
        ]
}