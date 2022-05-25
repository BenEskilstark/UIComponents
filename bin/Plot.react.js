'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * See ~/Code/teaching/clusters for an example of how to use the plot
 * Specifically ui/Main and reducers/plotReducer
 */

var React = require('react');
var Button = require('./Button.react');
var Canvas = require('./Canvas.react');
var useState = React.useState,
    useMemo = React.useMemo,
    useEffect = React.useEffect,
    useReducer = React.useReducer;

// type Point = {
//   x: number,
//   y: number,
//   color: ?string, // css color
// };
//
// type Axis = {
//   dimension: 'x' | 'y',
//   label: string,
//   min: ?number,
//   max: ?number,
//   adaptiveRange: ?boolean, // min/max adapt to the given points
//   hidden: ?boolean, // don't render the axis
//   majorTicks: ?number,
//   minorTicks: ?number,
// };

/**
 * NOTE: 0, 0 is the bottom left corner
 *
 * props:
 *   points: Array<Point>,
 *   xAxis: Axis,
 *   yAxis: Axis,
 *   isLinear: boolean,
 *   watch: ?number, // if provided, will watch for changes in this value
 *                   // and add a point to the plot whenever it changes
 *                   // up to a maximum number of points equal to the xAxis size
 *   inline: ?boolean,
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

  // track points with watching

  var _useState3 = useState(props.points),
      _useState4 = _slicedToArray(_useState3, 2),
      allPoints = _useState4[0],
      setAllPoints = _useState4[1];

  useEffect(function () {
    if (props.watch == null) {
      setAllPoints(props.points);
      return;
    }
    var watchedPoint = { x: allPoints.length, y: props.watch };
    if (allPoints.length < props.xAxis.max) {
      setAllPoints([].concat(_toConsumableArray(allPoints), [watchedPoint]));
    } else {
      var _allPoints = _toArray(allPoints),
          _ = _allPoints[0],
          next = _allPoints.slice(1);

      setAllPoints([].concat(_toConsumableArray(next), [watchedPoint]));
    }
  }, [props.watch, setAllPoints, allPoints, props.xAxis, props.points]);

  // rendering
  useEffect(function () {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var xAxis = props.xAxis,
        yAxis = props.yAxis,
        isLinear = props.isLinear;

    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
        width = _canvas$getBoundingCl.width,
        height = _canvas$getBoundingCl.height;

    var xmax = xAxis.max == null ? 10 : xAxis.max;
    var xmin = xAxis.min == null ? 0 : xAxis.min;
    var ymax = yAxis.max == null ? 10 : yAxis.max;
    var ymin = yAxis.min == null ? 0 : yAxis.min;

    // handling adaptive ranges
    if (xAxis.adaptiveRange) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allPoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          if (point.x < minVal) {
            xmin = point.x;
          }
          if (point.x > maxVal) {
            xmax = point.x;
          }
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
    }
    if (yAxis.adaptiveRange) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = allPoints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _point = _step2.value;

          if (_point.y < minVal) {
            ymin = _point.y;
          }
          if (_point.y > maxVal) {
            ymax = _point.y;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    // scaling allPoints to canvas
    var xTrans = width / (xmax - xmin);
    var yTrans = height / (ymax - ymin);
    var transX = function transX(x) {
      return x * xTrans - xmin * xTrans;
    };
    var transY = function transY(y) {
      return y * yTrans - ymin * yTrans;
    };

    // clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // drawing axes
    if (!xAxis.hidden) {
      ctx.fillStyle = 'black';
      var xMajor = xAxis.majorTicks || 10;
      for (var x = xmin; x < xmax; x += xMajor) {
        drawLine(ctx, { x: transX(x), y: height }, { x: transX(x), y: height - 20 });
      }
      var xMinor = xAxis.minorTicks || 2;
      for (var _x = xmin; _x < xmax; _x += xMinor) {
        drawLine(ctx, { x: transX(_x), y: height }, { x: transX(_x), y: height - 10 });
      }
    }
    if (!yAxis.hidden) {
      var yMajor = yAxis.majorTicks || 10;
      for (var y = ymin; y < ymax; y += yMajor) {
        drawLine(ctx, { x: 0, y: transY(y) }, { x: 20, y: transY(y) });
      }
      var yMinor = yAxis.minorTicks || 2;
      for (var _y = ymin; _y < ymax; _y += yMinor) {
        drawLine(ctx, { x: 0, y: transY(_y) }, { x: 10, y: transY(_y) });
      }
    }

    // drawing allPoints
    var sortedPoints = [].concat(_toConsumableArray(allPoints)).sort(function (a, b) {
      return a.x - b.x;
    });
    var prevPoint = null;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = sortedPoints[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _point2 = _step3.value;

        ctx.fillStyle = _point2.color ? _point2.color : 'black';
        var _x2 = transX(_point2.x);
        var _y2 = ymax * yTrans - ymin * yTrans - _point2.y * yTrans;
        var size = 2;
        ctx.fillRect(_x2 - size, _y2 - size, size * 2, size * 2);

        if (isLinear && prevPoint != null) {
          ctx.fillStyle = 'black';
          drawLine(ctx, prevPoint, { x: _x2, y: _y2 });
        }
        prevPoint = { x: _x2, y: _y2 };
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }, [props, resizeCount, allPoints]);

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
        display: props.inline ? 'inline' : 'table'
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