const React = require('react');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - password: ?boolean
 *  - onChange: (str) => void
 *  - style: Object
 */
const TextField = props => {
  const {
    value,
    placeholder,
    password,
    id,
    onChange,
    onBlur,
    onFocus,
    className
  } = props;
  const style = props.style != null ? props.style : {};
  return /*#__PURE__*/React.createElement("input", {
    id: id ? id : null,
    className: className ? className : null,
    style: style,
    placeholder: placeholder,
    type: password ? 'password' : 'text',
    value: value,
    onChange: ev => {
      if (props.onChange) onChange(ev.target.value);
    },
    onBlur: ev => {
      if (props.onBlur) onBlur(ev.target.value);
    },
    onFocus: ev => {
      if (props.onFocus) onFocus(ev.target.value);
    }
  });
};
module.exports = TextField;