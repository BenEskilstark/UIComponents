'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var useEffect = React.useEffect,
    useState = React.useState,
    useMemo = React.useMemo,
    Component = React.Component;


function Canvas(props) {
  var useFullScreen = props.useFullScreen,
      width = props.width,
      height = props.height,
      cellSize = props.cellSize,
      dispatch = props.dispatch,
      focus = props.focus;

  var _useState = useState(width ? width : window.innerWidth),
      _useState2 = _slicedToArray(_useState, 2),
      windowWidth = _useState2[0],
      setWindowWidth = _useState2[1];

  var _useState3 = useState(height ? height : window.innerHeight),
      _useState4 = _slicedToArray(_useState3, 2),
      windowHeight = _useState4[0],
      setWindowHeight = _useState4[1];

  useEffect(function () {
    function handleResize() {
      if (useFullScreen) {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }
    }

    window.addEventListener('resize', handleResize);
  });

  if (useFullScreen) {
    var sizeMult = 0.9;
    if (windowWidth < 600 || windowHeight < 800) {
      sizeMult = 0.75;
    }
    if (windowWidth > 1000 || windowHeight > 1000) {
      sizeMult = 1.25;
    }
    if (windowWidth > 1200 || windowHeight > 1200) {
      sizeMult = 1.3;
    }
    useEffect(function () {
      if (focus != null) {
        var viewPos = { x: 0, y: 0 };
        var viewWidth = windowWidth / (cellSize * sizeMult);
        var viewHeight = windowHeight / (cellHeight * sizeMult);
        viewPos = {
          x: focus.position.x - viewWidth / 2,
          y: focus.position.y - viewHeight / 2
        };
        dispatch({ type: 'SET_VIEW_POS',
          viewPos: viewPos, viewWidth: viewWidth, viewHeight: viewHeight
        });
      }
    }, [windowWidth, windowHeight]);
  }

  var fullScreenStyle = {
    height: '100%',
    width: '100%',
    margin: 'auto',
    position: 'relative'
  };
  var nonFullScreenStyle = {
    height: windowHeight,
    width: windowWidth
  };

  return React.createElement(
    'div',
    { id: 'canvasWrapper',
      style: useFullScreen ? fullScreenStyle : nonFullScreenStyle
    },
    React.createElement('canvas', {
      id: 'canvas', style: {
        backgroundColor: 'white',
        cursor: 'pointer'
      },
      width: windowWidth, height: windowHeight
    })
  );
}

function withPropsChecker(WrappedComponent) {
  return function (_Component) {
    _inherits(PropsChecker, _Component);

    function PropsChecker() {
      _classCallCheck(this, PropsChecker);

      return _possibleConstructorReturn(this, (PropsChecker.__proto__ || Object.getPrototypeOf(PropsChecker)).apply(this, arguments));
    }

    _createClass(PropsChecker, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        Object.keys(nextProps).filter(function (key) {
          return nextProps[key] !== _this2.props[key];
        }).map(function (key) {
          console.log('changed property:', key, 'from', _this2.props[key], 'to', nextProps[key]);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(WrappedComponent, this.props);
      }
    }]);

    return PropsChecker;
  }(Component);
}

module.exports = React.memo(Canvas);