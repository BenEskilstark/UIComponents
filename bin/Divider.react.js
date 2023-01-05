const React = require('react');
function Divider(props) {
  const {
    style
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '0px',
      border: '1px solid black',
      ...style
    }
  });
}
module.exports = Divider;