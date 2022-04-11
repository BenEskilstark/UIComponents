'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * See ~/Code/teaching/clusters for an example of how to use the plot
 * Specifically ui/Main and reducers/plotReducer
 */

var React = require('react');

var _require = require('bens_ui_components'),
    Button = _require.Button,
    Canvas = _require.Canvas;

var useState = React.useState,
    useMemo = React.useMemo,
    useEffect = React.useEffect,
    useReducer = React.useReducer;


/**
 * NOTE: 0, 0 is the bottom left corner
 *
 * props:
 *   points: Array<Point>,
 *   xAxis: Axis,
 *   yAxis: Axis,
 *   isLinear: boolean,
 *
 * canvas props:
 *   useFullScreen: boolean,
 *   width: number,
 *   height: number,
 */

var Plot = function Plot(props) {

  // screen resizing
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      resizeCount = _useState2[0],
      setResize = _useState2[1];

  useEffect(function () {
    function handleResize() {
      setResize(resizeCount + 1);
    }
    window.addEventListener('resize', handleResize);
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [resizeCount]);

  // rendering
  useEffect(function () {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var points = props.points,
        xAxis = props.xAxis,
        yAxis = props.yAxis,
        isLinear = props.isLinear;

    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
        width = _canvas$getBoundingCl.width,
        height = _canvas$getBoundingCl.height;

    // scaling points to canvas


    var xTrans = width / (xAxis.max - xAxis.min);
    var yTrans = height / (yAxis.max - yAxis.min);
    var transX = function transX(x) {
      return x * xTrans - xAxis.min * xTrans;
    };
    var transY = function transY(y) {
      return y * yTrans - yAxis.min * yTrans;
    };

    // clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // drawing axes
    ctx.fillStyle = 'black';
    var xMajor = xAxis.majorTicks || 10;
    for (var _x = xAxis.min; _x < xAxis.max; _x += xMajor) {
      drawLine(ctx, { x: transX(_x), y: height }, { x: transX(_x), y: height - 20 });
    }
    var xMinor = xAxis.minorTicks || 2;
    for (var _x2 = xAxis.min; _x2 < xAxis.max; _x2 += xMinor) {
      drawLine(ctx, { x: transX(_x2), y: height }, { x: transX(_x2), y: height - 10 });
    }
    var yMajor = yAxis.majorTicks || 10;
    for (var _y = yAxis.min; _y < yAxis.max; _y += yMajor) {
      drawLine(ctx, { x: 0, y: transY(_y) }, { x: 20, y: transY(_y) });
    }
    var yMinor = yAxis.minorTicks || 2;
    for (var _y2 = yAxis.min; _y2 < yAxis.max; _y2 += yMinor) {
      drawLine(ctx, { x: 0, y: transY(_y2) }, { x: 10, y: transY(_y2) });
    }

    // drawing points
    var sortedPoints = [].concat(_toConsumableArray(points)).sort(function (a, b) {
      return a.x - b.x;
    });
    var prevPoint = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = sortedPoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var point = _step.value;

        ctx.fillStyle = point.color ? point.color : 'black';
        var _x3 = transX(point.x);
        var _y3 = yAxis.max * yTrans - yAxis.min * yTrans - point.y * yTrans;
        var size = 2;
        ctx.fillRect(_x3 - size, _y3 - size, size * 2, size * 2);

        if (isLinear && prevPoint != null) {
          ctx.fillStyle = 'black';
          drawLine(ctx, prevPoint, { x: _x3, y: _y3 });
        }
        prevPoint = { x: _x3, y: _y3 };
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }, [props, resizeCount]);

  // axis labels
  var xAxisLabel = null;
  var yAxisLabel = null;
  if (props.xAxis.label != null) {
    xAxisLabel = React.createElement(
      'div',
      { style: {
          textAlign: 'center'
        } },
      props.xAxis.label
    );
  }
  if (props.yAxis.label != null) {
    yAxisLabel = React.createElement(
      'div',
      { style: {
          display: 'table-cell',
          verticalAlign: 'middle'
        } },
      props.yAxis.label
    );
  }

  return React.createElement(
    'div',
    {
      style: {
        width: 'fit-content',
        display: 'table'
      }
    },
    yAxisLabel,
    React.createElement(
      'div',
      { style: { display: 'inline-block' } },
      React.createElement(Canvas, {
        useFullScreen: props.useFullScreen,
        width: props.width,
        height: props.height
      })
    ),
    xAxisLabel
  );
};

var drawLine = function drawLine(ctx, p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.closePath();
};

module.exports = Plot;