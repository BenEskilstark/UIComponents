'use strict';

var React = require('react');

/**
 * Props:
 *  label: ?string
 *  checked: boolean
 *  onChange: (value: boolean) => void
 */
function Checkbox(props) {
  var checked = props.checked,
      label = props.label,
      _onChange = props.onChange;

  var checkbox = React.createElement('input', {
    type: 'checkbox',
    checked: checked,
    onChange: function onChange() {
      _onChange(!checked);
    }
  });
  if (label == null) {
    return checkbox;
  } else {
    return React.createElement(
      'div',
      {
        style: {
          display: 'inline-block'
        }
      },
      label,
      checkbox
    );
  }
}

module.exports = Checkbox;