const React = require('react');
const Button = require('./Button.react');
const Divider = require('./Divider.react');

/*
type Props = {
  title: ?string,
  body: ?string,
  dismiss: ?() => void, // if provided, will display an X
                        // and call this fn on click
  buttons: Array<{
    label: string,
    onClick: () => void,
  }>,
  style: ?Object,
  height: ?number,
};
*/

function Modal(props) {
  const {
    title,
    body,
    dismiss,
    buttons,
    style,
    buttonStyle
  } = props;
  const modalButtons = buttons ? buttons : [];
  const overrideStyle = style ? style : {};
  const overrideButtonStyle = buttonStyle ? buttonStyle : {};
  const buttonHTML = modalButtons.map(b => {
    return /*#__PURE__*/React.createElement(Button, {
      key: "b_" + b.label,
      disabled: !!b.disabled,
      label: b.label,
      onClick: b.onClick
    });
  });
  const rect = document.getElementById('container').getBoundingClientRect();
  const width = props.width ? props.width : Math.min(rect.width * 0.8, 350);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'whitesmoke',
      border: '1px solid black',
      boxSizing: 'border-box',
      boxShadow: '2px 2px #666666',
      borderRadius: 3,
      color: '#46403a',
      textAlign: 'center',
      width,
      ...overrideStyle
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.2em'
    }
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement(Button, {
    label: "\u274C",
    style: {
      display: dismiss ? 'inline' : 'none',
      border: 'none',
      backgroundColor: 'inherit',
      float: 'right',
      cursor: 'pointer',
      fontSize: 10
    },
    onClick: dismiss
  })), body, modalButtons.length > 0 ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Divider, {
    style: {
      marginTop: 4,
      marginBottom: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      ...overrideButtonStyle
    }
  }, buttonHTML)) : null));
}
module.exports = Modal;