"use strict";

var webpack = require("webpack");
var path = require("path");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

var packageJson = require("./package.json");
var copyright = [
    "surveyjs-widgets - Widgets for SurveyJS library v" + packageJson.version,
    "Copyright (c) 2015-2017 Devsoft Baltic OÜ  - http://surveyjs.io/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");
var outputFolder = "packages";

module.exports = function(options) {
  var config = {
    entry: {
        select2: path.join(__dirname, "./src/select2.js"),
        imagepicker: path.join(__dirname, "./src/imagepicker.js")
    },
    output: {
      path: path.join(__dirname, `./${outputFolder}/${options.platform}`),
      filename: `[name].${options.buildType === "prod" ? "min." : ""}js`,
      library: "[name]",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.BannerPlugin(copyright),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.DefinePlugin({
        'PLATFORM': JSON.stringify(options.platform)
      })
    ],
    devtool: options.buildType === "prod" ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, outputFolder),
      open: true,
      port: 1234
    }
  };

  if (options.buildType === "prod") {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin()
    ]);
  }

  return config;
};