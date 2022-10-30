'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Button = require('./Button.react');
var Divider = require('./Divider.react');

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
      style: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }
    },
    React.createElement(
      'div',
      {
        style: _extends({
          backgroundColor: 'whitesmoke',
          border: '1px solid black',
          boxSizing: 'border-box',
          boxShadow: '2px 2px #666666',
          borderRadius: 3,
          color: '#46403a',
          textAlign: 'center',
          width: width
        }, overrideStyle)
      },
      React.createElement(
        'div',
        {
          style: {
            fontSize: '1.2em'
          }
        },
        React.createElement(
          'b',
          null,
          title
        )
      ),
      body,
      React.createElement(Divider, { style: {
          marginTop: 4,
          marginBottom: 4
        } }),
      React.createElement(
        'div',
        {
          style: _extends({
            marginBottom: 4
          }, overrideButtonStyle)
        },
        buttonHTML
      )
    )
  );
}

module.exports = Modal;