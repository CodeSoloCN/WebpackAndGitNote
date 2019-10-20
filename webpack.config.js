// webpack 是node写出来的 所以要使用node的写法
let path = require('path') // 此模块为内置核心模块，无需安装
let HtmlWebpackPlugin = require('html-webpack-plugin') // 一个plugin,用于生成HTML入口文件 https://www.jianshu.com/p/08a60756ffda
let MinICssExtractPlugin = require('mini-css-extract-plugin') // 单独抽离css成一个文件
let OptimizCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css文件
let UglyfyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    optimization:{ // 优化项 使用优化项后需手动配置，否则production模式下将不会自动压缩js
        minimizer:[
            new UglyfyJsPlugin({
                cache: true, // 是否使用缓存
                parallel: true, // 是否并发打包
                sourceMap: true //
            }),
            new OptimizCssAssetsPlugin(),
        ]
    },
    devServer: { // 开发服务器 的配置
        port: 3000, // 端口号
        progress: true, //过程显示滚动条
        contentBase: './dist', // 开启服务的目录位置
        compress: true, // 启动gzip压缩
        open: true, // 自动打开浏览器

    },
    mode: 'development', //两个默认模式 development:开发模式(不会进行optimize) production:生产模式
    entry: './src/index.js', // 入口
    output: {
        // filename: 'bundle.[hash:8].js', // 打包后的文件名,可以在文件名中添加哈希戳,每次打包生成新文件,可以改变哈希戳的位置
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), //此路径必须为绝对路径,因此需要path.resolve(),可以把相对目录解析为绝对目录,__dirname非必须
        // publicPath: 'http://www.baidu.com', // 路径前面(如img引入，js引入)，统一加上
    },
    plugins: [ // 数组,放着所有的plugin,无顺序
        new HtmlWebpackPlugin({
            template: './public/index.html', // 模板html
            filename: 'index.html', // 生成的文件名，默认为html
            minify: { // 压缩html
                // removeAttributeQuotes: true, // 删除属性双引号
                // collapseWhitespace: true, // 折叠空行

            },
            hash: true, // 添加哈希戳
        }),
        new MinICssExtractPlugin({
            filename: 'main.css'
        }),
    ],
    module: { // 模块
        rules: [ // 规则 从后往前执行
            {
                test: /\.css$/,
                use:[ // 所需loader 支持字符串、对象和数组,若为数组,则从后往前依次使用loader
                    // {
                    //     loader:'style-loader',// 使用<style>将css-loader内部样式注入到我们的HTML页面
                    //     options:{
                    //         insert: 'top' // <style>插入的位置
                    //     }
                    // }, 
                    MinICssExtractPlugin.loader,
                    'css-loader',  //解释 @import 和 url() ，会 import/require() 后再解析(resolve)它们
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [ 
                    MinICssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader', // 把es5转换成es6
                    options:{
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins:[
                            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                            ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                            "@babel/plugin-transform-runtime",
                        ]
                    }
                },
                include: path.resolve(__dirname,'src'), // 包括 
                exclude: /node_modeles/, // 排除
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:{
                    loader: 'url-loader',// 在js中import或者require的图片路径，在css中使用的相对路径 url-loader包含file-loader
                    options: {
                        limit: 50*1024, // 单位为Byte
                        outputPath:'/img/',
                        // publicPath: 'http://www.baidu.com'
                    }
                }  
            },
            {
                test: /\.html$/, // 转换html中img的src路径
                use: 'html-withimg-loader'
            },
        ]

    }
}