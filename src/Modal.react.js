const React = require('react');
const Button = require('./Button.react');
const Divider = require('./Divider.react');

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: 'whitesmoke',
          border: '1px solid black',
          boxSizing: 'border-box',
          boxShadow: '2px 2px #666666',
          borderRadius: 3,
          color: '#46403a',
          textAlign: 'center',
          width,
          ...overrideStyle,
        }}
      >
        <div
          style={{
            fontSize: '1.2em',
          }}
        >
          <b>{title}</b>
        </div>
        {body}
        <Divider style={{
          marginTop: 4,
          marginBottom: 4,
        }} />
        <div
          style={{
            marginBottom: 4,
            ...overrideButtonStyle,
          }}
        >
          {buttonHTML}
        </div>
      </div>
    </div>
  );
}

module.exports = Modal;
