'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var InfoCard = function InfoCard(props) {
  var overrideStyle = props.style || {};
  var underrideStyle = props.underrideStyle || {};
  return React.createElement(
    'div',
    {
      style: _extends({}, underrideStyle, {
        border: props.border != null ? props.border : '1px solid black',
        backgroundColor: 'white',
        opacity: props.opacity != null ? props.opacity : 1,
        // width: 200,
        // height: 148,
        verticalAlign: 'top',
        marginBottom: 4,
        marginLeft: 4,
        display: 'inline-block',
        padding: 4
      }, overrideStyle)
    },
    props.children
  );
};

module.exports = InfoCard;