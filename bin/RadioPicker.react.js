const React = require('react');

// props:
// options: Array<string>
// selected: string
// onChange: (option) => void
// displayOptions: ?Array<string>
// isInline: ?boolean,

class RadioPicker extends React.Component {
  render() {
    const optionToggles = [];
    for (let i = 0; i < this.props.options.length; i++) {
      const option = this.props.options[i];
      const displayOption = this.props.displayOptions && this.props.displayOptions[i] ? this.props.displayOptions[i] : option;
      optionToggles.push( /*#__PURE__*/React.createElement("div", {
        key: 'radioOption_' + option,
        style: {
          display: this.props.isInline ? 'inline' : 'block'
        }
      }, displayOption, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        className: "radioCheckbox",
        value: displayOption,
        checked: option === this.props.selected,
        onChange: () => this.props.onChange(option)
      })));
    }
    return /*#__PURE__*/React.createElement("div", null, optionToggles);
  }
}
module.exports = RadioPicker;