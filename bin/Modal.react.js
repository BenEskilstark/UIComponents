'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Button = require('./Button.react');

var isMobile = require('bens_utils').platform.isMobile;

/*
type Props = {
  title: ?string,
  body: ?string,
  buttons: Array<{
    label: string,
    onClick: () => void,
  }>,
  style: ?Object,
  height: ?number,
};
*/

function Modal(props) {
  var title = props.title,
      body = props.body,
      buttons = props.buttons,
      style = props.style,
      buttonStyle = props.buttonStyle;

  var height = props.height ? props.height : 450;
  var overrideStyle = style ? style : {};
  var overrideButtonStyle = buttonStyle ? buttonStyle : {};

  var buttonHTML = buttons.map(function (b) {
    return React.createElement(Button, {
      key: "b_" + b.label,
      disabled: !!b.disabled,
      label: b.label, onClick: b.onClick
    });
  });

  var rect = document.getElementById('container').getBoundingClientRect();
  var width = props.width ? props.width : Math.min(rect.width * 0.8, 350);
  return React.createElement(
    'div',
    {
      style: _extends({
        position: 'absolute',
        backgroundColor: 'whitesmoke',
        border: '1px solid black',
        padding: 4,
        boxShadow: '2px 2px #666666',
        borderRadius: 3,
        color: '#46403a',
        textAlign: 'center',
        width: width,
        top: isMobile() ? 0 : (canvasRect.height - height) / 2,
        left: (rect.width - width) / 2
      }, overrideStyle)
    },
    React.createElement(
      'h3',
      null,
      React.createElement(
        'b',
        null,
        title
      )
    ),
    body,
    React.createElement(
      'div',
      {
        style: _extends({}, overrideButtonStyle)
      },
      buttonHTML
    )
  );
}

module.exports = Modal;