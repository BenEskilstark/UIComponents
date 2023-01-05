const React = require('react');
const NumberField = require('./NumberField.react');
const {
  useState,
  useMemo,
  useEffect
} = React;

/**
 *  props:
 *  min, max: number,
 *  value: ?number (min if null),
 *  onChange: (number) => void,
 *  step: ?number (1 if null),
 *  label: ?string,
 *  isFloat: ?boolean,
 *  noNumberField: ?boolean,
 *  noOrignalValue: ?boolean,
 *  inline: ?boolean,
 *  style: ?Object,
 */
function Slider(props) {
  const {
    isFloat
  } = props;
  const label = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, props.label);
  let value = props.value != null ? props.value : props.min;
  value = isFloat ? Math.floor(value * 10) : value;
  const displayValue = isFloat ? value / 10 : value;
  const min = isFloat ? props.min * 10 : props.min;
  const max = isFloat ? props.max * 10 : props.max;
  const originalValue = useMemo(() => {
    return displayValue;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: props.style || {}
  }, props.label != null ? label : null, /*#__PURE__*/React.createElement("input", {
    type: "range",
    id: 'slider_' + label,
    min: min,
    max: max,
    value: value,
    onChange: ev => {
      if (props.disabled) {
        return;
      }
      const val = ev.target.value;
      props.onChange(parseFloat(isFloat ? val / 10 : val));
    },
    step: props.step != null ? props.step : 1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, props.noNumberField ? null : /*#__PURE__*/React.createElement(NumberField, {
    disabled: props.disabled,
    value: displayValue,
    onlyInt: !isFloat,
    onChange: val => {
      props.onChange(val);
    },
    submitOnBlur: false
  }), props.noOriginalValue ? null : "(" + originalValue + ")"));
}
module.exports = Slider;