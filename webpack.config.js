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

var commonDependencies = {
  'select2': '>=^4.0.4'
};

var platformOptions = {
  'react': {
      externals: {
          'survey-react': {
              root: 'Survey',
              commonjs2: 'survey-react',
              commonjs: 'survey-react',
              amd: 'survey-react'
          }
      },
      dependencies: { 'survey-react': '>=^0.12.32' }
  },
  'knockout': {
      externals: {
          'survey-knockout': {
              root: 'Survey',
              commonjs2: 'survey-knockout',
              commonjs: 'survey-knockout',
              amd: 'survey-knockout'
          }
      },
      dependencies: { 'survey-knockout': '>=^0.12.32' }
  },
  'jquery': {
      externals: {
          'survey-jquery': {
              root: 'Survey',
              commonjs2: 'survey-jquery',
              commonjs: 'survey-jquery',
              amd: 'survey-jquery'
          }
      },
      dependencies: { 'survey-jquery': '>=^0.12.32' }
  },
  'angular': {
      externals: {
        'survey-angular': {
            root: 'Survey',
            commonjs2: 'survey-angular',
            commonjs: 'survey-angular',
            amd: 'survey-angular'
        }
      },
      dependencies: { 'survey-angular': '>=^0.12.32' }
  },
  'vue': {
      externals: {
          'survey-vue': {
              root: 'Survey',
              commonjs2: 'survey-vue',
              commonjs: 'survey-vue',
              amd: 'survey-vue'
          }
      },
      dependencies: { 'survey-vue': '>=^0.12.32' }
  }
};

module.exports = function(options) {
  var config = {
    entry: {
        select2: path.join(__dirname, `./src/select2/${options.platform}.js`),
        imagepicker: path.join(__dirname, "./src/imagepicker.js")
    },
    output: {
      path: path.join(__dirname, `./${outputFolder}/${options.platform}`),
      filename: `[name].${options.buildType === "prod" ? "min." : ""}js`,
      library: "[name]",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: platformOptions[options.platform].externals,
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
      new webpack.optimize.UglifyJsPlugin({
        unused: true,
        dead_code: true
      })
    ]);
  }

  return config;
};