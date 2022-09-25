const React = require('react');
const Button = require('./Button.react');
const {isMobile} = require('bens_utils').platform;

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
  const {title, body, buttons, style, buttonStyle} = props;
  const height = props.height ? props.height : 450;
  const overrideStyle = style ? style : {};
  const overrideButtonStyle = buttonStyle ? buttonStyle : {};

  const buttonHTML = buttons.map(b => {
    return (<Button
      key={"b_" + b.label}
      disabled={!!b.disabled}
      label={b.label} onClick={b.onClick}
    />);
  });

  const rect = document.getElementById('container').getBoundingClientRect();
  const width = props.width ? props.width : Math.min(rect.width * 0.8, 350);
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'whitesmoke',
        border: '1px solid black',
        padding: 4,
        boxShadow: '2px 2px #666666',
        borderRadius: 3,
        color: '#46403a',
        textAlign: 'center',
        width,
        top: isMobile() ? 0 : (canvasRect.height - height) / 2,
        left: (rect.width - width) / 2,
        ...overrideStyle,
      }}
    >
      <h3><b>{title}</b></h3>
      {body}
      <div
        style={{
          ...overrideButtonStyle,
        }}
      >
        {buttonHTML}
      </div>
    </div>
  );
}

module.exports = Modal;
