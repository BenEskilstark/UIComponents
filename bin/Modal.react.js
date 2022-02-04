'use strict';

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
  height: ?number,
};
*/

function Modal(props) {
  var title = props.title,
      body = props.body,
      buttons = props.buttons;

  var height = props.height ? props.height : 450;

  // using 2 rects to properly position width and height
  var rect = document.getElementById('container').getBoundingClientRect();
  var canvasRect = null;
  var canvas = document.getElementById('canvas');
  if (canvas != null) {
    canvasRect = canvas.getBoundingClientRect();
  } else {
    canvasRect = rect;
  }

  var buttonHTML = buttons.map(function (b) {
    return React.createElement(Button, {
      key: "b_" + b.label,
      disabled: !!b.disabled,
      label: b.label, onClick: b.onClick
    });
  });

  var width = props.width ? props.width : Math.min(rect.width * 0.8, 350);
  return React.createElement(
    'div',
    {
      style: {
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
      }
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
        style: {}
      },
      buttonHTML
    )
  );
}

module.exports = Modal;