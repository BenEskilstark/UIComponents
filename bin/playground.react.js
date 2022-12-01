'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var _require = require('./hooks.js'),
    useEnhancedEffect = _require.useEnhancedEffect;

function renderUI(root) {
  root.render(React.createElement(Main, null));
}

var Main = function Main(props) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      modal = _useState2[0],
      setModal = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      fullCanvas = _useState4[0],
      setFullCanvas = _useState4[1];

  var _useState5 = useState({ val: 0 }),
      _useState6 = _slicedToArray(_useState5, 2),
      counter = _useState6[0],
      setCounter = _useState6[1];

  var _useState7 = useState({ val: 0 }),
      _useState8 = _slicedToArray(_useState7, 2),
      counter2 = _useState8[0],
      setCounter2 = _useState8[1];

  // useEnhancedEffect(() => {
  //   console.log("counter1", counter, "counter2", counter2);
  // }, [counter], [counter2]);


  useEffect(function () {
    console.log("counter1", counter.val, "counter2", counter2.val);
  }, [counter]);

  useEffect(function () {
    var canvasWidth = fullCanvas ? window.innerWidth : 300;
    var canvasHeight = fullCanvas ? window.innerHeight : 300;
    render(canvasWidth, canvasHeight);
  }, []);

  var _useReducer = useReducer(function (table, action) {
    if (action.type == 'ADD_NAME') {
      var id = table.nextID++;
      return _extends({}, table, {
        columns: _extends({}, table.columns),
        rows: [].concat(_toConsumableArray(table.rows), [{ id: table.nextID++, name: action.name }])
      });
    }
    return table;
  }, {
    nextID: 1,
    rows: [{ id: 0, name: 'ben' }],
    columns: {
      id: { filterable: true },
      name: { filterable: true }
    }
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      table = _useReducer2[0],
      updateTable = _useReducer2[1];

  console.log(table);

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
        label: "Pressed " + counter.val + " times",
        onClick: function onClick() {
          return setCounter({ val: counter.val + 1 });
        }
      }),
      React.createElement(Button, {
        label: "Pressed " + counter2.val + " times",
        onClick: function onClick() {
          return setCounter2({ val: counter2.val + 1 });
        }
      }),
      React.createElement(Button, {
        label: "Add Row",
        onClick: function onClick() {
          return updateTable({ type: 'ADD_NAME', name: 'foo' });
        }
      }),
      React.createElement('div', null),
      React.createElement(Button, {
        label: "Display Modal",
        disabled: modal != null,
        onClick: function onClick() {
          setModal(React.createElement(Modal, {
            title: 'Modal',
            body: React.createElement(ModalBody, {
              counter: counter,
              counter2: counter2
            }),
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
    React.createElement(
      'div',
      {
        style: {
          display: 'flex'
        }
      },
      React.createElement(Canvas, {
        width: 300,
        height: 300,
        useFullScreen: fullCanvas,
        onResize: render
      }),
      React.createElement(Table, {
        style: { paddingTop: '3rem', fontSize: 19 },
        rows: table.rows,
        columns: table.columns
      })
    )
  );
};

var ModalBody = function ModalBody(props) {
  useEffect(function () {
    console.log(props.counter.val, props.counter2.val);
    return function () {
      console.log(props.counter.val, props.counter2.val);
    };
  }, [props.counter]);

  return React.createElement(
    'div',
    null,
    'lorem ipsum the quick brown fox jumped over the lazy dog'
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