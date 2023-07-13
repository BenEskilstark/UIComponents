const React = require('react');
const ReactDOM = require('react-dom/client');
const SwipePicker = require('./SwipePicker.react');
const Button = require('./Button.react');
const {
  useState,
  useEffect,
  useMemo
} = React;
function renderUI(root) {
  root.render( /*#__PURE__*/React.createElement(Main, null));
}
const Main = () => {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [buttonLabel, setButtonLabel] = useState("click");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'black',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: buttonLabel,
    onClick: () => {
      if (buttonLabel == "click") setButtonLabel("plunk");
      if (buttonLabel == "plunk") setButtonLabel("click");
    }
  }), /*#__PURE__*/React.createElement(SwipePicker, {
    id: "swipepicker_1",
    style: {},
    width: 500,
    height: 60,
    deselectedStyle: {
      opacity: 0.7
    },
    selectedIndex: selectedIndex,
    onSelectIndex: setSelectedIndex,
    frozenOnOneOption: true,
    options: [{
      isCircular: true,
      color: 'red'
    }, {
      isCircular: true,
      color: 'green'
    }, {
      isCircular: true,
      color: 'pink'
    }, {
      isCircular: true,
      color: 'purple'
    }, {
      color: 'steelblue',
      isCircular: true
    }, {
      isCircular: true
    }, {
      label: 'Encoder'
    }, {
      label: 'H'
    }, {
      label: 'I',
      isCircular: true
    }, {
      label: 'J',
      isCircular: true
    }, {
      label: 'K',
      isCircular: true
    }]
  }), /*#__PURE__*/React.createElement(SwipePicker, {
    id: "swipepicker_2",
    style: {
      marginTop: 10
    },
    clickToSelect: true,
    width: 500,
    height: 60,
    frozenOnOneOption: true,
    options: [{
      label: '+',
      isCircular: true
    }, {
      label: 'Encoder 1',
      onClick: () => console.log("?")
    }, {
      label: 'Encoder 2',
      onClick: () => console.log("2")
    }, {
      label: 'Encoder 3',
      onClick: () => console.log("3")
    }, {
      label: 'Encoder 4',
      onClick: () => console.log("4")
    }, {
      label: 'Encoder 5',
      onClick: () => console.log("5")
    }, {
      label: 'Encoder 6',
      onClick: () => console.log("6")
    }]
  }));
};
renderUI(ReactDOM.createRoot(document.getElementById('container')));