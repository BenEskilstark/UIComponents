
const React = require('react');
const ReactDOM = require('react-dom/client');
const {useState, useEffect, useMemo, useReducer} = React;

const AudioWidget = require('./AudioWidget.react.js');
const Button = require('./Button.react.js');
const Canvas = require('./Canvas.react.js');
const Checkbox = require('./Checkbox.react.js');
const Divider = require('./Divider.react.js');
const Dropdown = require('./Dropdown.react.js');
const Indicator = require('./Indicator.react.js');
const InfoCard = require('./InfoCard.react.js');
const Modal = require('./Modal.react.js');
const NumberField = require('./NumberField.react.js');
const Plot = require('./Plot.react.js');
const plotReducer = require('./plotReducer.js').plotReducer;
const QuitButton = require('./QuitButton.react.js');
const RadioPicker = require('./RadioPicker.react.js');
const Slider = require('./Slider.react.js');
const Table = require('./Table.react.js');
const TextField = require('./TextField.react.js');


function renderUI(root): React.Node {
  root.render(<Main />);
}


const Main = () => {
  const [modal, setModal] = useState(null);
  const [fullCanvas, setFullCanvas] = useState(false);

  useEffect(() => {
    const canvasWidth = fullCanvas ? window.innerWidth : 300;
    const canvasHeight = fullCanvas ? window.innerHeight : 300;
    render(canvasWidth, canvasHeight);
  }, []);

  return (
    <div>
      {modal}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          zIndex: 5,
        }}
      >
        <Button
          label={"Display Modal"}
          disabled={modal != null}
          onClick={() => {
            setModal(<Modal
              title="Modal"
              body="lorem ipsum dolor the quick brown fox jumped over the lazy dog"
              buttons={[{label: 'Dismiss', onClick: () => setModal(null)}]}
            />);
          }}
        />
        <Button
          label={fullCanvas ? "Smaller Canvas" : "Set Full Screen Canvas"}
          onClick={() => setFullCanvas(!fullCanvas)}
        />
      </div>
      <Canvas
        width={300}
        height={300}
        useFullScreen={fullCanvas}
        onResize={render}
      />
    </div>
  );
};

const grid = {
  width: 500,
  height: 500,
};

const render = (canvasWidth, canvasHeight) => {
  const cvs = document.getElementById('canvas');
  const ctx = cvs.getContext('2d');

  ctx.save();
  ctx.fillStyle = 'gray';
  const pxW = canvasWidth / grid.width;
  const pxH = canvasHeight / grid.height;
  ctx.scale(pxW, pxH);

  ctx.fillRect(0, 0, grid.width, grid.height);
  ctx.fillStyle = 'steelblue';
  ctx.fillRect(25, 25, 250, 400);
  ctx.restore();
}

const root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);

