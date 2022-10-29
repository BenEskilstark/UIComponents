
// const React = require('react');
// const ReactDOM = require('react-dom');
// const {useState, useEffect, useMemo, useReducer} = react;

// const {
module.exports = {
  AudioWidget: require('./bin/AudioWidget.react.js'),
  Button: require('./bin/Button.react.js'),
  Canvas: require('./bin/Canvas.react.js'),
  Checkbox: require('./bin/Checkbox.react.js'),
  Divider: require('./bin/Divider.react.js'),
  Dropdown: require('./bin/Dropdown.react.js'),
  Indicator: require('./bin/Indicator.react.js'),
  InfoCard: require('./bin/InfoCard.react.js'),
  Modal: require('./bin/Modal.react.js'),
  NumberField: require('./bin/NumberField.react.js'),
  Plot: require('./bin/Plot.react.js'),
  plotReducer: require('./bin/plotReducer.js').plotReducer,
  QuitButton: require('./bin/QuitButton.react.js'),
  RadioPicker: require('./bin/RadioPicker.react.js'),
  Slider: require('./bin/Slider.react.js'),
  Table: require('./bin/Table.react.js'),
  TextField: require('./bin/TextField.react.js'),
};


// function renderUI(): React.Node {
//   ReactDOM.render(
//     <Main />,
//     document.getElementById('container'),
//   );
// }
//
//
// const Main = () => {
//   const [modal, setModal] = useState(null);
//   return (
//     <div>
//       {modal}
//       <Button
//         label={"Display Modal"}
//         onClick={() => {
//           setModal(<Modal
//             title="Modal"
//             body="lorem ipsum"
//             buttons={[{label: 'Dismiss', onClick: () => setModal(null)}]}
//           />);
//         }}
//       />
//     </div>
//   );
// };
//
// renderUI;
//
// module.exports = {
//   AudioWidget,
//   Button,
//   Canvas,
//   Checkbox,
//   Divider,
//   Dropdown,
//   InfoCard,
//   Modal,
//   NumberField,
//   Plot,
//   plotReducer,
//   QuitButton,
//   RadioPicker,
//   Slider,
//   Table,
// };
