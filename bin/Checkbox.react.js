const React = require('react');

/**
 * Props:
 *  label: ?string
 *  checked: boolean
 *  onChange: (value: boolean) => void
 */
function Checkbox(props) {
  const {
    checked,
    label,
    onChange
  } = props;
  const checkbox = /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: () => {
      onChange(!checked);
    }
  });
  if (label == null) {
    return checkbox;
  } else {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block'
      }
    }, label, checkbox);
  }
}
module.exports = Checkbox;