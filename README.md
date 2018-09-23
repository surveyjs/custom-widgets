## Widgets [![Build Status](https://travis-ci.org/surveyjs/widgets.svg?branch=master)](https://travis-ci.org/surveyjs/widgets) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)

- select2: [site](https://select2.org/), [repo](https://github.com/select2/select2), license: MIT

- select2tagbox: [site](https://select2.org/), [repo](https://github.com/select2/select2), license: MIT

- icheck: [site](http://icheck.fronteed.com/), [repo](https://github.com/fronteed/iCheck/), license: MIT

- inputmask: [site](http://robinherbots.github.io/Inputmask/), [repo](https://github.com/RobinHerbots/Inputmask), license: MIT

- jquerybarrating: [site](http://antenna.io/demo/jquery-bar-rating/examples/), [repo](https://github.com/antennaio/jquery-bar-rating), license: MIT

- jqueryuidatepicker: [site](https://jqueryui.com/datepicker/), [repo](https://github.com/jquery/jquery-ui), license: https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt

- nouislider: [site](https://refreshless.com/nouislider/), [repo](https://github.com/leongersen/noUiSlider), license: https://github.com/leongersen/noUiSlider/blob/master/LICENSE

- signaturepad: [site](http://szimek.github.io/signature_pad/), [repo](https://github.com/szimek/signature_pad), license: MIT

- sortablejs: [site](http://rubaxa.github.io/Sortable/), [repo](https://github.com/RubaXa/Sortable), license: MIT

- ckeditor: [site](https://ckeditor.com/ckeditor-4/), [repo](https://github.com/ckeditor/ckeditor-dev), license: https://github.com/ckeditor/ckeditor-dev/blob/major/LICENSE.md

- easyautocomplete: [site](http://easyautocomplete.com/), [repo](https://github.com/pawelczak/EasyAutocomplete), license: https://github.com/pawelczak/EasyAutocomplete/blob/master/LICENSE.txt

- pretty-checkbox: [site](https://lokesh-coder.github.io/pretty-checkbox/), [repo](https://github.com/lokesh-coder/pretty-checkbox/), license: https://github.com/lokesh-coder/pretty-checkbox/blob/master/LICENSE

- bootstrap-slider: [site](http://seiyria.com/bootstrap-slider/), [repo](https://github.com/seiyria/bootstrap-slider), license: https://github.com/seiyria/bootstrap-slider/blob/master/LICENSE.md

- recordrtc: [site](http://recordrtc.org/), [repo](https://github.com/muaz-khan/RecordRTC), license [MIT](http://spdx.org/licenses/MIT.html)

- imageHotArea [repo](https://github.com/TheNetworg/surveyjs-plugin-hotarea), licence: MIT

## Getting started

es5 examples: https://surveyjs.io/Examples/Library/?id=custom-widget-select2-tagbox  
es modules examples: https://stackblitz.com/edit/surveyjs-widgets-react

Install the library using es5.

```
<script src="https://unpkg.com/surveyjs-widgets"></script>
```

Install the library using npm.

```
npm install surveyjs-widgets
```

Or use Azure CDN:
https://surveyjs.azureedge.net/0.95.0/surveyjs-widgets.min.js

You find all versions/builds in the [surveyjs/build repo](https://github.com/surveyjs/builds).

## Building surveyjs-widgets from sources

To build library yourself:

1.  **Clone the repo from GitHub**

    ```
    git clone https://github.com/surveyjs/widgets.git
    cd surveyjs-widgets
    ```

2.  **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ surveyjs from sources.

    ```
    npm install
    ```

3.  **Build the library**

    ```
    npm run build
    ```

    After that you should have the libraries (angular, jquery, knockout, react and vue) at 'packages' directory.

4.  **Add your own custom widget**

    Please go to [this plunker](https://plnkr.co/edit/HdnYE5?p=preview) and select customwidget.js to review the code and comments.

    The [same plunker example](https://plnkr.co/edit/fXsLf1R88WxxDFaFEnYx?p=preview), but for SurveyJS Editor/Builder

## License

[MIT license](https://github.com/surveyjs/widgets/blob/master/LICENSE)
