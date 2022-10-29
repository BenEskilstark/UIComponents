'use strict';

var React = require('react');

/**
 * Props:
 *  - value: str,
 *  - placeholder: ?str
 *  - password: ?boolean
 *  - onChange: (str) => void
 *  - style: Object
 */
var TextField = function TextField(props) {
  var value = props.value,
      placeholder = props.placeholder,
      password = props.password,
      _onChange = props.onChange,
      id = props.id;

  var style = props.style != null ? props.style : {};
  return React.createElement('input', {
    id: id ? id : null,
    style: style,
    placeholder: placeholder,
    type: password ? 'password' : 'text',
    value: value,
    onChange: function onChange(ev) {
      _onChange(ev.target.value);
    }
  });
};

module.exports = TextField;