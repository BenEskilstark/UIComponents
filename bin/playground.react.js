'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var ReactDOM = require('react-dom/client');
var useState = React.useState,
    useEffect = React.useEffect,
    useMemo = React.useMemo,
    useReducer = React.useReducer;


var AudioWidget = require('./AudioWidget.react.js');
var Button = require('./Button.react.js');
var Canvas = require('./Canvas.react.js');
var Checkbox = require('./Checkbox.react.js');
var Divider = require('./Divider.react.js');
var Dropdown = require('./Dropdown.react.js');
var Indicator = require('./Indicator.react.js');
var InfoCard = require('./InfoCard.react.js');
var Modal = require('./Modal.react.js');
var NumberField = require('./NumberField.react.js');
var Plot = require('./Plot.react.js');
var plotReducer = require('./plotReducer.js').plotReducer;
var QuitButton = require('./QuitButton.react.js');
var RadioPicker = require('./RadioPicker.react.js');
var Slider = require('./Slider.react.js');
var Table = require('./Table.react.js');
var TextField = require('./TextField.react.js');

function renderUI(root) {
  root.render(React.createElement(Main, null));
}

var Main = function Main() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      modal = _useState2[0],
      setModal = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      fullCanvas = _useState4[0],
      setFullCanvas = _useState4[1];

  useEffect(function () {
    var canvasWidth = fullCanvas ? window.innerWidth : 300;
    var canvasHeight = fullCanvas ? window.innerHeight : 300;
    render(canvasWidth, canvasHeight);
  }, []);

  return React.createElement(
    'div',
    null,
    modal,
    React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: 4,
          left: 4,
          zIndex: 5
        }
      },
      React.createElement(Button, {
        label: "Display Modal",
        disabled: modal != null,
        onClick: function onClick() {
          setModal(React.createElement(Modal, {
            title: 'Modal',
            body: 'lorem ipsum dolor the quick brown fox jumped over the lazy dog',
            buttons: [{ label: 'Dismiss', onClick: function onClick() {
                return setModal(null);
              } }]
          }));
        }
      }),
      React.createElement(Button, {
        label: fullCanvas ? "Smaller Canvas" : "Set Full Screen Canvas",
        onClick: function onClick() {
          return setFullCanvas(!fullCanvas);
        }
      })
    ),
    React.createElement(Canvas, {
      width: 300,
      height: 300,
      useFullScreen: fullCanvas,
      onResize: render
    })
  );
};

var grid = {
  width: 500,
  height: 500
};

var render = function render(canvasWidth, canvasHeight) {
  var cvs = document.getElementById('canvas');
  var ctx = cvs.getContext('2d');

  ctx.save();
  ctx.fillStyle = 'gray';
  var pxW = canvasWidth / grid.width;
  var pxH = canvasHeight / grid.height;
  ctx.scale(pxW, pxH);

  ctx.fillRect(0, 0, grid.width, grid.height);
  ctx.fillStyle = 'steelblue';
  ctx.fillRect(25, 25, 250, 400);
  ctx.restore();
};

var root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);