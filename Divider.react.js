
const React = require('react');


function Divider(props) {
  const {style} = props;
  return (
    <div
      style={{
        width: '100%',
        height: '0px',
        border: '1px solid black',
        ...style,
      }}
    >
    </div>
  );
}

module.exports = Divider;
