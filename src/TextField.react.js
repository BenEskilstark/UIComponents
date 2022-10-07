const React = require('react');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - password: ?boolean
 *  - onChange: (str) => void
 *  - style: Object
 */
const TextField = (props) => {
  const {value, placeholder, password, onChange} = props;
  const style = props.style != null ? props.style : {};
  return (
    <input
      style={style}
      placeholder={placeholder}
      type={password ? 'password' : 'text'}
      value={value}
      onChange={(ev) => {
        onChange(ev.target.value);
      }}
    />

  );
};

module.exports = TextField;
