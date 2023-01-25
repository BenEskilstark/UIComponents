
const React = require('react');
const ReactDOM = require('react-dom/client');
const {useState, useEffect, useMemo, useReducer} = React;
const {oneOf, randomIn} = require('bens_utils').stochastic;

const AudioWidget = require('./AudioWidget.react.js');
const Board = require('./Board.react.js');
const Button = require('./Button.react.js');
const Canvas = require('./Canvas.react.js');
const Checkbox = require('./Checkbox.react.js');
const CheckerBackground = require('./CheckerBackground.react.js');
const Divider = require('./Divider.react.js');
const DragArea = require('./DragArea.react.js');
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
const SpriteSheet = require('./SpriteSheet.react.js');
const Table = require('./Table.react.js');
const TextField = require('./TextField.react.js');
const {
  useEnhancedEffect, useEnhancedReducer,
  useMouseHandler,
} = require('./hooks.js');


function renderUI(root) {
  root.render(<Main />);
}

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;


const Main = (props) => {
  const [modal, setModal] = useState(null);
  const [fullCanvas, setFullCanvas] = useState(false);

  const [counter, setCounter] = useState({val: 0});
  const [counter2, setCounter2] = useEnhancedReducer(() => {}, {val: 0});

  useEffect(() => {
    console.log(
      "counter1", counter.val,
      "counter2", counter2.val,
    );
  }, [counter]);

  const [table, updateTable] = useEnhancedReducer(
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

  const [mouse, mouseDispatch, getMouseState] = useEnhancedReducer(
    (mouse, action) => {
      switch (action.type) {
        case 'SET_MOUSE_DOWN': {
          const {isLeft, isDown, downPixel} = action;
          return {
            ...mouse,
            isLeftDown: isLeft ? isDown : mouse.isLeftDown,
            isRightDown: isLeft ? mouse.isRightDown : isDown,
            downPixel: isDown && downPixel != null ? downPixel : mouse.downPixel,
          };
        }
        case 'SET_MOUSE_POS': {
          const {curPixel} = action;
          return {
            ...mouse,
            prevPixel: {...mouse.curPixel},
            curPixel,
          };
        }
        case 'ADD_LINE': {
          return {
            ...mouse,
            lines: [...mouse.lines, action.line],
          };
        }
        case 'CHANGE_CANVAS_SIZE': {
          return {
            ...mouse,
            canvasSize: action.canvasSize,
          };
        }
      }
      return mouse;
    },
    {
      isLeftDown: false,
      isRightDown: false,
      downPixel: {x: 0, y: 0},
      prevPixel: {x: 0, y: 0},
      curPixel: {x: 0, y: 0},

      canvasSize: {width: CANVAS_WIDTH, height: CANVAS_HEIGHT},
      lines: [],
      prevInteractPos: null,
    }
  );

  const div = (pos, size) => {
    return {x: pos.x / size.width, y: pos.y / size.height};
  }

  useMouseHandler(
    "canvas", {dispatch: mouseDispatch, getState: getMouseState},
    {
      leftDown: (state, dispatch, pos) => {
        console.log("click", pos);
      },
      mouseMove: (state, dispatch, gridPos) => {
        if (!state.isLeftDown) return;
        dispatch({inMove: true});

        const {canvasSize} = state;
        if (state.prevInteractPos) {
          const prevPos = state.prevInteractPos;
          dispatch({type: 'ADD_LINE',
            line: {
              start: div(prevPos, canvasSize),
              end: div(gridPos, canvasSize),
              color: 'red',
            },
          });
          dispatch({prevInteractPos: gridPos});
        } else {
          dispatch({prevInteractPos: gridPos});
        }
      },
      leftUp: (state, dispatch, gridPos) => {
        dispatch({inMove: false});
        dispatch({prevInteractPos: null});
      },
    },
  );

  useEffect(() => {
    const canvasWidth = fullCanvas ? window.innerWidth : CANVAS_WIDTH;
    const canvasHeight = fullCanvas ? window.innerHeight : CANVAS_HEIGHT;
    render(canvasWidth, canvasHeight, mouse.lines);
  }, [mouse.lines, fullCanvas]);

  const [draggables, setDraggables] = useState([
    <Draggable id={"drag1"} disabled={true} key={"drag1"} style={{top: 300, left: 200}} />,
    <Draggable id={"drag2"} key={"drag2"} style={{top: 300, left: 100}} />,
    <Draggable id={"drag3"} key={"drag3"} style={{top: 100, left: 100}} />
  ]);

  const [knookX, setKnookX] = useState(2);
  const [isRotated, setIsRotated] = useState(false);

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
          label={"Add Draggable"}
          onClick={() => {
            const nextID = "drag" + (draggables.length + 1);
            setDraggables([
              ...draggables,
              <Draggable id={nextID} key={nextID}
                style={{
                  top: randomIn(0, 3) * 100, left: randomIn(0, 3) * 100,
                  backgroundColor: oneOf(['red', 'blue', 'orange', 'purple']),
                }}
              />
            ]);
          }}
        />
        <Button
          label={"Remove Draggable"}
          onClick={() => {
            setDraggables(draggables.slice(0, -1));
          }}
        />
        <Button
          label={"Add Row"}
          onClick={() => updateTable({type: 'ADD_NAME', name: 'foo'})}
        />
        <Button
          label={"Set KnookX"}
          onClick={() => setKnookX(randomIn(0, 7))}
        />
        <Button
          label={"Rotate Board"}
          onClick={() => setIsRotated(!isRotated)}
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
          marginTop: 50,
        }}
      >
        <Canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          useFullScreen={fullCanvas}
          onResize={() => {
            const canvasWidth = fullCanvas ? window.innerWidth : CANVAS_WIDTH;
            const canvasHeight = fullCanvas ? window.innerHeight : CANVAS_HEIGHT;
            mouseDispatch({type: 'CHANGE_CANVAS_SIZE',
              canvasSize: {width: canvasWidth, height: canvasHeight},
            });
            render(canvasWidth, canvasHeight, mouse.lines);
          }}
        />
        <Table
          style={{paddingTop: '3rem', fontSize: 19}}
          rows={table.rows}
          columns={table.columns}
        />
      </div>
      <div>
        <Slider
          label="Slider"
          style={{display: 'inline'}}
          min={0} max={100}
          value={counter.val}
          noOriginalValue={true}
          onChange={(v) => {
            return setCounter({val: v});
          }}
        />
        <Slider
          label="Slider 2"
          style={{display: 'inline'}}
          min={0} max={100}
          value={counter2.val}
          noNumberField={true}
          onChange={(v) => {
            return setCounter2({val: v});
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <DragArea
          snapX={100}
          snapY={100}
          isDropAllowed={(id, position) => {
            console.log(id, position);
            if (id == 'drag4') return false;
            return true;
          }}
          onDrop={(id, position) => {
            console.log(id, "dropped at", position);
          }}
          style={{
            width: 400, height: 400,
            border: '1px solid black',
          }}
        >
          {draggables}
        </DragArea>
        <Board
          pixelSize={{width: 400, height: 400}}
          gridSize={{width: 8, height: 8}}
          isRotated={isRotated}
          onPieceMove={(id, position) => {
            console.log(id, "moved to", position);
          }}
          onPiecePickup={(id, position) => {
            console.log(id, "picked up at", position);
          }}
          isMoveAllowed={(id, position) => {
            return true;
          }}
          onMoveCancel={(id) => {
            console.log("cancel", id);
          }}
          pieces={[
            {id: 'whiteKing', position: {x: 1, y: 1}, sprite: (
              <SpriteSheet src={'../chess.png'} offset={{x:0,y:0}}
                spriteSheet={{pxWidth: 50, pxHeight: 50, imagesAcross: 6, imagesDown: 2}}
              />)
            },
            {id: 'whiteQueen', position: {x: 1, y: 2}, sprite: (
              <SpriteSheet src={'../chess.png'} offset={{x:1,y:0}}
                spriteSheet={{pxWidth: 50, pxHeight: 50, imagesAcross: 6, imagesDown: 2}}
              />)
            },
            {id: 'blackKing', position: {x: 7, y: 7}, sprite: (
              <SpriteSheet src={'../chess.png'} offset={{x:0,y:1}}
                spriteSheet={{pxWidth: 50, pxHeight: 50, imagesAcross: 6, imagesDown: 2}}
              />)
            },
            {id: 'blackQueen', position: {x: 6, y: 7}, sprite: (
              <SpriteSheet src={'../chess.png'} offset={{x:1,y:1}}
                spriteSheet={{pxWidth: 50, pxHeight: 50, imagesAcross: 6, imagesDown: 2}}
              />)
            },
            {id: 'whiteKnook', position: {x: knookX, y: 2}, sprite: (
              <SpriteSheet src={'../chess2.png'} offset={{x:6,y:0}}
                spriteSheet={{pxWidth: 50, pxHeight: 50, imagesAcross: 10, imagesDown: 2}}
              />)
            },
          ]}
        />
      </div>
    </div>
  );
};

const Draggable = (props) => {
  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        width: 100, height: 100,
        top: 200, left: 250, textAlign: 'center',
        backgroundColor: 'green', borderRadius: '5%',
        cursor: 'pointer',
        ...(props.style || {})
      }}
    >
      {props.id}
    </div>
  );
};

const HorizontalSplitPane = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'red',
          opacity: 0.2,
          width: '100%',
          borderBottom: '1px solid black',
        }}
      >
        Hello
      </div>
      <div
        style={{
          backgroundColor: 'steelblue',
          opacity: 0.2,
          width: '100%',
          borderTop: '1px solid black',
        }}
      >
        World
      </div>
    </div>
  );
}

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
const mult = (pos, size) => {
  return {x: pos.x * size.width, y: pos.y * size.height};
}

const render = (canvasWidth, canvasHeight, lines) => {
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

  ctx.lineWidth = 4;

  ctx.beginPath();
  for (const line of lines) {
    const start = mult(line.start, grid);
    const end = mult(line.end, grid);
    ctx.strokeStyle = line.color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.closePath();

  ctx.restore();
}

const root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);

