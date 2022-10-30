'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var useEffect = React.useEffect,
    useState = React.useState,
    useMemo = React.useMemo,
    Component = React.Component;


function Canvas(props) {
  var useFullScreen = props.useFullScreen,
      width = props.width,
      height = props.height,
      style = props.style,
      id = props.id,
      onResize = props.onResize;

  var _useState = useState(width && !useFullScreen ? width : window.innerWidth),
      _useState2 = _slicedToArray(_useState, 2),
      windowWidth = _useState2[0],
      setWindowWidth = _useState2[1];

  var _useState3 = useState(height && !useFullScreen ? height : window.innerHeight),
      _useState4 = _slicedToArray(_useState3, 2),
      windowHeight = _useState4[0],
      setWindowHeight = _useState4[1];

  useEffect(function () {
    function handleResize() {
      if (useFullScreen) {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      } else {
        setWindowWidth(width);
        setWindowHeight(height);
      }
    }

    handleResize();

    if (useFullScreen) {
      window.addEventListener('resize', handleResize);
    }

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [useFullScreen, onResize]);

  useEffect(function () {
    if (onResize) {
      onResize(windowWidth, windowHeight);
    }
  }, [useFullScreen, onResize, windowWidth, windowHeight]);

  return React.createElement(
    'div',
    { id: 'canvasWrapper',
      style: {
        width: width,
        height: height
      }
    },
    React.createElement('canvas', {
      id: id || "canvas", style: _extends({
        cursor: 'pointer'
      }, style ? style : {}),
      width: useFullScreen ? windowWidth : width,
      height: useFullScreen ? windowHeight : height
    })
  );
}

module.exports = React.memo(Canvas);