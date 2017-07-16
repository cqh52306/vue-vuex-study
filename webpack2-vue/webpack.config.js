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

console.log("当前运行环境：", mode === "dev" ? "dev" : 'pro')

module.exports = {
    entry: {
        app: [
            './src/app.js' //webpack2唯一入口文件
        ]
    },
    output: {
        path: path.join(__dirname, '/dist/assets'),
        publicPath: publicPath,
        filename: 'app.js'
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
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                //loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader                
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                //当我们需要读取json格式文件时，我们不再需要安装任何loader，webpack2中将会内置 json-loader，自动支持json格式的读取（喜大普奔啊）。
                test: /\.json$/, //获取json数据的loader
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/, //处理css文件中的背景图片
                loader: 'url-loader?limit=1&name=./static/assets/[name].[hash:4].[ext]'//当图片大小小于这个限制的时候，会自动启用base64编码图片。减少http请求,提高性能

            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=image/svg+xml']
            },
        ]
    },
    resolve: {
        //注意一下, extensions webpack2第一个不是空字符串! 对应不需要后缀的情况.
        extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx', '.vue'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../dist/assets'),
            'components': path.resolve(__dirname, '../src/components')
        },
        // 配置了这个属性之后 vue 和 vue-router这些第三方的包都不会被构建进 js 中，那么我们就需要通过 cdn 进行文件的引用了
        //externals对象的key是给require时用的，比如require('vue'),，对象的value表示的是如何在global（即window）中访问到该对象，这里是window.Vue
        /*  externals: {
          'vue': 'Vue',
          'vue-router': 'VueRouter'
      },*/
    },
    devtool: mode === "dev" ? 'cheap-module-source-map' : undefined,
    // vue: {
    //     loaders: {
    //         scss: ['vue-style-loader', 'css', 'sass'].join('!')
    //     },
    //     postcss: [
    //         require('postcss-flexbugs-fixes')(),
    //         require('autoprefixer')({
    //             browsers: [
    //                 ">1%",
    //                 "last 4 versions",
    //                 "Firefox ESR",
    //                 "not ie < 9"
    //             ]
    //         })
    //     ]
    // },
    plugins: mode === "dev" ? [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            // options: {
            //     postcss: [
            //         require('autoprefixer')
            //     ],
            //     scss: ['vue-style-loader', 'css', 'sass'].join('!')
            // },
            vue: {
                // use custom postcss plugins
                loaders: {
                    scss: ['vue-style-loader', 'css-loader', 'sass-loader']
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
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.LoaderOptionsPlugin({
                debug: false,
                // options: {
                //     postcss: [
                //         require('autoprefixer')
                //     ],
                //     scss: ['vue-style-loader', 'css', 'sass'].join('!')
                // },
                vue: {
                    // use custom postcss plugins
                    loaders: {
                        scss: ['vue-style-loader', 'css-loader', 'sass-loader']
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
                }
            }),
            new HtmlWebpackPlugin({
                favicon: 'src/static/imgs/favicon.ico',
                template: 'src/prod.html',
                filename: '../index.html',
                inject: 'body'
            }),
            //压缩混淆JS插件,UglifyJsPlugin 将不再支持让 Loaders 最小化文件的模式。debug 选项已经被移除。Loaders 不能从 webpack 的配置中读取到他们的配置项。
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true
                },
                comments: false,
                beautify: false,
                sourceMap: false
            }),
            new webpack.optimize.AggressiveMergingPlugin(),
            new ZipPlugin({
                path: path.join(__dirname, './dist'),
                filename: 'dist.zip',
                pathPrefix: 'assets'
            })
        ]
}