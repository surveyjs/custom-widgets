"use strict";

var webpack = require("webpack");
var path = require("path");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const VirtualModulePlugin = require("virtual-module-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var GenerateJsonPlugin = require('generate-json-webpack-plugin');

var packageJson = require("./package.json");
var copyright = [
    "surveyjs-widgets - Widgets for the SurveyJS library v" + packageJson.version,
    "Copyright (c) 2015-2017 Devsoft Baltic OÜ  - http://surveyjs.io/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

var outputFolder = "packages";
var commonDependencies = {
  'select2': '>=^4.0.4'
};
var widgets = ["select2", "imagepicker", "icheck", "datepicker", "tagbox"];
var entry = {};

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
      import: 'import * as Survey from "survey-react";',
      dependencies: { 'survey-react': '>=^0.12.32' },
      keywords: ['react', 'react-component']
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
      import: 'import * as Survey from "survey-knockout";',
      dependencies: { 'survey-knockout': '>=^0.12.32' },
      keywords: ['knockout']
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
      import: 'import * as Survey from "survey-jquery";',
      dependencies: { 'survey-jquery': '>=^0.12.32' },
      keywords: ['jquery', 'jquery-plugin']
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
      import: 'import * as Survey from "survey-angular";',
      dependencies: { 'survey-angular': '>=^0.12.32' },
      keywords: ['angular', 'angular-component']
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
      import: 'import * as Survey from "survey-vue";',
      dependencies: { 'survey-vue': '>=^0.12.32' },
      keywords: ['vue']
  }
};


module.exports = function(options) {
    var packagePath = `./${outputFolder}/survey-cw-${options.platform}`;
    var packagePlatformJson = {
        'name': packagePath,
        'version': packageJson.version,
        'description': 'Custom widgets for the SurveyJS library',
        'keywords': [
            'Survey',
            'JavaScript',
            'Bootstrap',
            'Library'
        ].concat(platformOptions[options.platform].keywords),
        'homepage': 'https://surveyjs.io/',
        'license': 'MIT',
        'files': [],
        'repository': {
            'type': 'git',
            'url': 'https://github.com/surveyjs/widgets.git'
        }
    };

    widgets.forEach(function(widget) {
        packagePlatformJson.files.push(`${widget}.js`);
        packagePlatformJson.files.push(`${widget}.min.js`);
        packagePlatformJson.files.push(`${widget}.min.js.map`);
        entry[widget] = path.join(__dirname, `./src/${widget}.js`);
    })

    if(!!platformOptions[options.platform].dependencies) {
        packagePlatformJson.dependencies = platformOptions[options.platform].dependencies;
    }
    if(!!platformOptions[options.platform].peerDependencies) {
        packagePlatformJson.peerDependencies = platformOptions[options.platform].peerDependencies;
    }
    packagePlatformJson.dependencies = Object.assign(packagePlatformJson.dependencies, commonDependencies);

    var config = {
    entry: entry,
    output: {
        path: path.join(__dirname, packagePath),
        filename: `[name].${options.buildType === "prod" ? "min." : ""}js`,
        library: "[name]",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    externals: platformOptions[options.platform].externals,
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.DefinePlugin({
        'PLATFORM': JSON.stringify(options.platform)
        }),
        new VirtualModulePlugin({
        moduleName: 'src/surveyjs_importer.js',
        contents: platformOptions[options.platform].import
        })
    ],
    devtool: options.buildType === "prod" ? "source-map" : "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, outputFolder),
        open: true
    }
    };


    if (options.buildType === "prod") {
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
        unused: true,
        dead_code: true
        }),
        new webpack.BannerPlugin(copyright),
        new GenerateJsonPlugin(
            'package.json',
            packagePlatformJson,
            undefined,
            2
        ),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, './src/npmREADME.md'),
            to: path.join(__dirname, `${packagePath}/README.md`)
        }])
    ]);
    }

    return config;
};