const React = require('react');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - rows: number
 *  - cols: ?number
 *  - onChange: (str) => void
 *  - style: Object
 *
 *  NOTE:
 *    in the style use resize: none to prevent it from being resizeable
 */
const TextArea = (props) => {
  const {
    value, placeholder, id,
    onChange, onBlur, onFocus,
    className, rows, cols,
  } = props;
  const style = props.style != null ? props.style : {};
  return (
    <textarea
      id={id ? id : null}
      className={className ? className : null}
      style={style}
      placeholder={placeholder}
      onChange={(ev) => {
        if (props.onChange) onChange(ev.target.value);
      }}
      onBlur={(ev) => {
        if (props.onBlur) onBlur(ev.target.value);
      }}
      onFocus={(ev) => {
        if (props.onFocus) onFocus(ev.target.value);
      }}
      rows={rows}
      cols={cols}
      value={value}
    />
  );
};

module.exports = TextArea;
