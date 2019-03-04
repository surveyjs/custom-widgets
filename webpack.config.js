"use strict";

var webpack = require("webpack");
var path = require("path");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

var packageJson = require("./package.json");

var copyright = [
  "surveyjs-widgets - Widgets for the SurveyJS library v" + packageJson.version,
  "Copyright (c) 2015-2019 Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)"
].join("\n");

var outputFolder = "package";

var main = "surveyjs-widgets";

var widgets = [
  main,
  "select2",
  "select2-tagbox",
  "jquery-ui-datepicker",
  "inputmask",
  "icheck",
  "jquery-bar-rating",
  "signature_pad",
  "sortablejs",
  "nouislider",
  "ck-editor",
  "easy-autocomplete",
  "pretty-checkbox",
  "bootstrap-slider",
  "microphone"
];

var dependencies = {
  select2: "^4.0.4",
  icheck: "^1.0.2",
  "jquery-ui": "^1.12.1",
  sortablejs: "^1.6.1",
  signature_pad: "^2.3.2",
  nouislider: "^10.1.0",
  inputmask: "^3.3.10",
  "jquery-bar-rating": "^1.2.2",
  "easy-autocomplete": "^1.3.5",
  "pretty-checkbox": "^3.0.3",
  "bootstrap-slider": "^10.0.0",
  recordrtc: "^5.4.6"
};

var entry = {};

module.exports = function(options) {
  var packagePath = `./${outputFolder}`;

  var targetPackageJson = {
    name: `surveyjs-widgets`,
    version: packageJson.version,
    description: "Custom widgets for the SurveyJS library",
    keywords: [
      "Survey",
      "JavaScript",
      "Bootstrap",
      "Library",
      "SurveyJS",
      "Widgets"
    ],
    homepage: "https://surveyjs.io/",
    license: "MIT",
    files: [],
    main: main + ".js",
    repository: {
      type: "git",
      url: "https://github.com/surveyjs/widgets.git"
    },
    dependencies: {
      jquery: "^3.2.1"
    },
    peerDependencies: {}
  };

  widgets.forEach(function(widget) {
    if (widget !== main) {
      targetPackageJson.files.push(`widgets/${widget}.js`);
      targetPackageJson.files.push(`widgets/${widget}.min.js`);
      targetPackageJson.files.push(`widgets/${widget}.min.js.map`);
      entry["widgets/" + widget] = path.join(__dirname, `./src/${widget}.js`);
    } else {
      targetPackageJson.files.push(`${widget}.js`);
      targetPackageJson.files.push(`${widget}.min.js`);
      targetPackageJson.files.push(`${widget}.min.js.map`);
      entry[widget] = path.join(__dirname, `./src/${widget}.js`);
    }
  });

  targetPackageJson.dependencies = Object.assign(
    targetPackageJson.dependencies,
    dependencies
  );

  var config = {
    entry: entry,
    output: {
      path: path.join(__dirname, packagePath),
      filename: `[name].${options.buildType === "prod" ? "min." : ""}js`,
      library: "[name]",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: {
      jquery: {
        root: "jQuery",
        commonjs2: "jquery",
        commonjs: "jquery",
        amd: "jquery"
      },
      inputmask: {
        root: "Inputmask",
        commonjs2: "inputmask",
        commonjs: "inputmask",
        amd: "inputmask"
      },
      nouislider: {
        root: "noUiSlider",
        commonjs2: "nouislider",
        commonjs: "nouislider",
        amd: "nouislider"
      },
      signature_pad: {
        root: "SignaturePad",
        commonjs2: "signature_pad",
        commonjs: "signature_pad",
        amd: "signature_pad"
      },
      sortablejs: {
        root: "Sortable",
        commonjs2: "sortablejs",
        commonjs: "sortablejs",
        amd: "sortablejs"
      },
      "bootstrap-slider": {
        root: "Slider",
        commonjs2: "bootstrap-slider",
        commonjs: "bootstrap-slider",
        amd: "bootstrap-slider"
      }
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

  if (options.buildType === "dev") {
    config.plugins = config.plugins.concat([
      new CleanWebpackPlugin([outputFolder], { verbose: true })
    ]);
  }

  if (options.buildType === "prod") {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        unused: true,
        dead_code: true
      }),
      new webpack.BannerPlugin(copyright),
      new GenerateJsonPlugin("package.json", targetPackageJson, undefined, 2),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "./src/targetREADME.md"),
          to: path.join(__dirname, `${packagePath}/README.md`)
        }
      ])
    ]);
  }

  return config;
};
