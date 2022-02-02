'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

function Divider(props) {
  var style = props.style;

  return React.createElement('div', {
    style: _extends({
      width: '100%',
      height: '0px',
      border: '1px solid black'
    }, style)
  });
}

module.exports = Divider;