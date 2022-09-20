const React = require('react');

const InfoCard = (props) => {
  const overrideStyle = props.style || {};
  const underrideStyle = props.underrideStyle || {};
  return (
    <div
      id={props.id ? props.id : ''}
      style={{
        ...underrideStyle,
        border: props.border != null ? props.border : '1px solid black',
        backgroundColor: 'white',
        opacity: props.opacity != null ? props.opacity : 1,
        // width: 200,
        // height: 148,
        verticalAlign: 'top',
        marginBottom: 4,
        marginLeft: 4,
        display: 'inline-block',
        padding: 4,
        ...overrideStyle,
      }}
    >
      {props.children}
    </div>
  );
}

module.exports = InfoCard
