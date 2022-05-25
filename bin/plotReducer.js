'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var plotReducer = function plotReducer(state, action) {
  switch (action.type) {
    case 'SET_AXIS':
      var axis = action.axis;

      var whichAxis = axis.dimension == 'x' ? 'xAxis' : 'yAxis';
      return _extends({}, state, _defineProperty({}, whichAxis, _extends({ label: axis.dimension, min: 0, max: 100 }, axis)));
    case 'SET_POINTS':
      var points = action.points;

      return _extends({}, state, {
        points: points
      });
    case 'ADD_POINTS':
      {
        var _points = action.points;

        return _extends({}, state, {
          points: state.points ? [].concat(_toConsumableArray(state.points), _toConsumableArray(_points)) : _points
        });
      }
    case 'ADD_POINT_CIRCULAR':
      {
        var point = action.point;

        if (point.x < state.xAxis.max) {
          return _extends({}, state, {
            points: state.points ? [].concat(_toConsumableArray(state.points), [point]) : points
          });
        } else {
          var _state$points = _toArray(state.points),
              _ = _state$points[0],
              next = _state$points.slice(1);

          return _extends({}, state, {
            points: state.points ? [].concat(_toConsumableArray(next), [point]) : points
          });
        }
      }
    case 'CLEAR_POINTS':
      {
        return _extends({}, state, {
          points: []
        });
      }
    case 'PRINT_POINTS':
      {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = state.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _point = _step.value;

            console.log(_point.x + "," + _point.y);
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

        return state;
      }
  }
};

module.exports = { plotReducer: plotReducer };