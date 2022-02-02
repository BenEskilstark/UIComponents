'use strict';

var React = require('react');
var NumberField = require('./NumberField.react');
var useState = React.useState,
    useMemo = React.useMemo,
    useEffect = React.useEffect;

/**
 *  props:
 *  min, max: number,
 *  value: ?number (min if null),
 *  onChange: (number) => void,
 *  step: ?number (1 if null),
 *  label: ?string,
 *  isFloat: ?boolean
 */

function Slider(props) {
  var isFloat = props.isFloat;

  var label = React.createElement(
    'div',
    { style: { display: 'inline-block' } },
    props.label
  );
  var value = props.value != null ? props.value : props.min;
  value = isFloat ? Math.floor(value * 10) : value;
  var displayValue = isFloat ? value / 10 : value;

  var min = isFloat ? props.min * 10 : props.min;
  var max = isFloat ? props.max * 10 : props.max;

  var originalValue = useMemo(function () {
    return displayValue;
  }, []);
  return React.createElement(
    'div',
    null,
    props.label != null ? label : null,
    React.createElement('input', { type: 'range',
      id: 'slider_' + label,
      min: min, max: max,
      value: value,
      onChange: function onChange(ev) {
        var val = ev.target.value;
        props.onChange(parseFloat(isFloat ? val / 10 : val));
      },
      step: props.step != null ? props.step : 1
    }),
    React.createElement(
      'div',
      { style: { display: 'inline-block' } },
      React.createElement(NumberField, {
        value: displayValue,
        onlyInt: !isFloat,
        onChange: function onChange(val) {
          props.onChange(val);
        },
        submitOnBlur: false
      }),
      '(',
      originalValue,
      ')'
    )
  );
}

module.exports = Slider;