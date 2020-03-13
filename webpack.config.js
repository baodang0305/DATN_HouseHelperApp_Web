const path = require("path");
// const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const vendorLibs = [
    "react",
    "react-dom"
]

const devServer = {
    port: 3000,
    open: true
}

const config = {
    mode: "development",
    entry: {
        bundle: "./src/index.js",
        vendor: vendorLibs
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                use: "babel-loader",
                test: /\.js$/,
                exclude: "/node_modules"
            },
            {
                //use: ["style-loader", "css-loader"],
                use: [MiniCssExtractPlugin.loader, "css-loader"],
                test: /\.css$/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                test: /vendor/,
                priority: -10
                },
                default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
                }
            }
        }
    },
    devServer
}

module.exports = config;