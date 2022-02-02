'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var useState = React.useState,
    useEffect = React.useEffect;

// props:
// id: ?string
// label: string
// onClick: () => void
// onMouseDown: optional () => void
// onMouseUp: optional () => void
// disabled: optional boolean
// style: optional Object

function Button(props) {
  var id = props.id || props.label;

  var touchFn = function touchFn() {
    if (props.onMouseDown != null) {
      props.onMouseDown();
    } else {
      props.onClick();
    }
  };

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      intervalID = _useState2[0],
      setIntervalID = _useState2[1];

  return React.createElement(
    'button',
    { type: 'button',
      style: _extends({
        touchAction: 'initial',
        fontSize: '18px'
      }, props.style),
      key: id || label,
      className: props.disabled ? 'buttonDisable' : '',
      id: id.toUpperCase() + '_button',
      onClick: props.disabled ? function () {} : props.onClick,
      onTouchStart: function onTouchStart(ev) {
        ev.preventDefault();
        if (props.disabled) {
          return;
        }
        if (intervalID) {
          console.log("already in interval, clearing");
          clearInterval(intervalID);
          setIntervalID(null);
        }
        touchFn();
        // HACK: if you set the right condition, allow repetive presses
        if (false) {
          var interval = setInterval(touchFn, 120);
          setIntervalID(interval);
        }
      },
      onTouchEnd: function onTouchEnd(ev) {
        ev.preventDefault();
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      },
      onTouchCancel: function onTouchCancel(ev) {
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      },
      onTouchMove: function onTouchMove(ev) {
        ev.preventDefault();
      },
      onMouseDown: props.onMouseDown,
      onMouseUp: props.onMouseUp,
      disabled: props.disabled
    },
    props.label
  );
}

module.exports = Button;