
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
const {useEnhancedEffect} = require('./hooks.js');


function renderUI(root): React.Node {
  root.render(<Main />);
}


const Main = (props) => {
  const [modal, setModal] = useState(null);
  const [fullCanvas, setFullCanvas] = useState(false);

  const [counter, setCounter] = useState({val: 0});
  const [counter2, setCounter2] = useState({val: 0});

  // useEnhancedEffect(() => {
  //   console.log("counter1", counter, "counter2", counter2);
  // }, [counter], [counter2]);
  useEffect(() => {
    console.log(
      "counter1", counter.val,
      "counter2", counter2.val,
    );
  }, [counter]);

  useEffect(() => {
    const canvasWidth = fullCanvas ? window.innerWidth : 300;
    const canvasHeight = fullCanvas ? window.innerHeight : 300;
    render(canvasWidth, canvasHeight);
  }, []);

  const [table, updateTable] = useReducer(
    (table, action) => {
      if (action.type == 'ADD_NAME') {
        const id = table.nextID++;
        return {...table,
          columns: {...table.columns},
          rows: [...table.rows,
            {id: table.nextID++, name: action.name},
          ],
        };
      }
      return table;
    },
    {
      nextID: 1,
      rows: [{id: 0, name: 'ben'}],
      columns: {
        id: {filterable: true},
        name: {filterable: true},
      }
    },
  );

  console.log(table);

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
          label={"Pressed " + counter.val + " times"}
          onClick={() => setCounter({val: counter.val + 1})}
        />
        <Button
          label={"Pressed " + counter2.val + " times"}
          onClick={() => setCounter2({val: counter2.val + 1})}
        />
        <Button
          label={"Add Row"}
          onClick={() => updateTable({type: 'ADD_NAME', name: 'foo'})}
        />
        <div></div>
        <Button
          label={"Display Modal"}
          disabled={modal != null}
          onClick={() => {
            setModal(<Modal
              title="Modal"
              body={
                <ModalBody
                  counter={counter}
                  counter2={counter2}
                />
              }
              buttons={[{label: 'Dismiss', onClick: () => setModal(null)}]}
            />);
          }}
        />
        <Button
          label={fullCanvas ? "Smaller Canvas" : "Set Full Screen Canvas"}
          onClick={() => setFullCanvas(!fullCanvas)}
        />
      </div>
      <div
        style={{
         display: 'flex',
        }}
      >
        <Canvas
          width={300}
          height={300}
          useFullScreen={fullCanvas}
          onResize={render}
        />
        <Table
          style={{paddingTop: '3rem', fontSize: 19}}
          rows={table.rows}
          columns={table.columns}
        />
      </div>
    </div>
  );
};

const ModalBody = (props) => {
  useEffect(() => {
    console.log(props.counter.val, props.counter2.val)
    return () => {
      console.log(props.counter.val, props.counter2.val)
    }
  }, [props.counter]);

  return (
    <div>
      lorem ipsum the quick brown fox jumped over the lazy dog
    </div>
  );
}

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

