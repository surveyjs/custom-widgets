"use strict";

var webpack = require("webpack");
var path = require("path");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

var packageJson = require("./package.json");

const today = new Date();
const year = today.getFullYear();

var copyright = [
  "surveyjs-widgets - Widgets for the SurveyJS library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
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
  "sortablejs",
  "nouislider",
  "ck-editor",
  "easy-autocomplete",
  "pretty-checkbox",
  "bootstrap-slider",
  "microphone",
  "emotionsratings",
  "leaflet"
];

var dependencies = {
  select2: "^4.0.4",
  icheck: "^1.0.2",
  "jquery-ui": "^1.12.1",
  sortablejs: "^1.6.1",
  nouislider: "^14.6.3",
  inputmask: "^5.0.3",
  "jquery-bar-rating": "^1.2.2",
  "easy-autocomplete": "^1.3.5",
  "pretty-checkbox": "^3.0.3",
  "bootstrap-slider": "^10.0.0",
  recordrtc: "^5.4.6",
  "emotion-ratings": "^2.0.1",
  "leaflet": "^1.7.1"
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
      leaflet: {
        root: "L",
        commonjs2: "L",
        commonjs: "L",
        amd: "L"
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
    optimization:{
      minimize: options.buildType === "prod"
    },
    mode:  options.buildType === "prod" ? "production" : "development",
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
