"use strict";

var webpack = require("webpack");
var path = require("path");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var GenerateJsonPlugin = require('generate-json-webpack-plugin');

var packageJson = require("./package.json");

var copyright = [
    "surveyjs-widgets - Widgets for the SurveyJS library v" + packageJson.version,
    "Copyright (c) 2015-2017 Devsoft Baltic OÜ  - http://surveyjs.io/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

var outputFolder = "package";
var widgets = ["select2", "imagepicker", "icheck", "datepicker", "tagbox"];
var entry = {};

module.exports = function(options) {
    var packagePath = `./${outputFolder}/surveyjs-widgets`;
    
    var targetPackageJson = {
        'name': `surveyjs-widgets`,
        'version': packageJson.version,
        'description': 'Custom widgets for the SurveyJS library',
        'keywords': [
            'Survey',
            'JavaScript',
            'Bootstrap',
            'Library',
            'SurveyJS',
            'Widgets'
        ],
        'homepage': 'https://surveyjs.io/',
        'license': 'MIT',
        'files': [],
        'repository': {
            'type': 'git',
            'url': 'https://github.com/surveyjs/widgets.git'
        },
        'dependencies': {
            'select2': '^4.0.4' //TODO add jquery and all widgets
        },
        'peerDependencies': {}
    };

    widgets.forEach(function(widget) {
        targetPackageJson.files.push(`${widget}.js`);
        targetPackageJson.files.push(`${widget}.min.js`);
        targetPackageJson.files.push(`${widget}.min.js.map`);
        entry[widget] = path.join(__dirname, `./src/${widget}.js`);
    })

    var config = {
        entry: entry,
        output: {
            path: path.join(__dirname, packagePath),
            filename: `[name].${options.buildType === "prod" ? "min." : ""}js`,
            library: "[name]",
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsWebpackPlugin()
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
            targetPackageJson,
            undefined,
            2
        ),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, './src/targetREADME.md'),
            to: path.join(__dirname, `${packagePath}/README.md`)
        }])
    ]);
    }

    return config;
};