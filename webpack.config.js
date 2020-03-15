const path = require("path");
// const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const vendorLibs = [
    "react",
    "react-dom",
    "antd",
    "react-redux",
    "react-router-dom",
    "redux",
    "redux-devtools-extension"
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
            //use to import file .png .jpg ... to js file.
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
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
            chunks: "all"
        }
    },
    devServer
}

module.exports = config;