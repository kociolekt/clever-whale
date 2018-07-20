const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const config = require('./config.json');

const entry = [
    'babel-polyfill',
    path.join(__dirname, 'src/js/index.js'),
    path.join(__dirname, 'src/scss/main.scss'),
    path.join(__dirname, 'src/html/index.html')
];
const output = path.join(__dirname, '/dist');
const imagesSrc = path.join(__dirname, 'src/img');

module.exports = {
    entry: entry,
    output: {
        path: output,
        filename: '[name].[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {useBuiltIns: true}],
                            'react'
                        ],
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(Object.assign({}, {
            template: path.join(__dirname, 'src/html/index.html')
        }, config)),
        new MiniCssExtractPlugin({filename: '[name]-[contenthash:8].css'}),
        new CopyWebpackPlugin([
            {from: imagesSrc, to: 'img'} 
        ])
    ]
};
