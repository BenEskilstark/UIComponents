'use strict';

var React = require('react');
var useEffect = React.useEffect,
    useRef = React.useRef;

/**
 *
 * props:
 *   value: number, // will watch for changes in this value
 *   minChange: ?number, // changes smaller than this won't be registered
 */

var Indicator = function Indicator(props) {
  var prev = usePrevious(props.value);

  var minChange = props.minChange ? props.minChange : 0;
  var change = props.value - prev;
  var color = 'black';
  var symbol = '-';
  if (Math.abs(change) > minChange) {
    if (change > 0) {
      color = 'green';
      symbol = '/\\';
    } else {
      color = 'red';
      symbol = '\\/';
    }
  }

  return React.createElement(
    'div',
    {
      style: {
        display: 'inline',
        color: color,
        fontFamily: 'Times',
        fontSize: 15
      }
    },
    React.createElement(
      'b',
      null,
      symbol
    )
  );
};

var usePrevious = function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  });
  return ref.current;
};

module.exports = Indicator;