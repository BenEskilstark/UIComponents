const React = require('react');
const ReactDOM = require('react-dom/client');
const {
  useState,
  useEffect,
  useMemo,
  useReducer
} = React;
const {
  oneOf,
  randomIn
} = require('bens_utils').stochastic;
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
const TextArea = require('./TextArea.react.js');
const {
  useEnhancedEffect,
  useEnhancedReducer,
  useMouseHandler,
  useHotKeyHandler,
  hotKeyReducer
} = require('./hooks.js');
function renderUI(root) {
  root.render( /*#__PURE__*/React.createElement(Main, null));
}
let CANVAS_WIDTH = 300;
let CANVAS_HEIGHT = 300;
const grid = {
  x: 0,
  y: 200,
  width: 500,
  height: 500
};
const Main = props => {
  const [modal, setModal] = useState(null);
  const [fullCanvas, setFullCanvas] = useState(false);
  const [counter, setCounter] = useState({
    val: 0
  });
  const [counter2, setCounter2] = useEnhancedReducer(() => {}, {
    val: 0
  });
  useEffect(() => {
    console.log("counter1", counter.val, "counter2", counter2.val);
  }, [counter]);
  const [table, updateTable] = useEnhancedReducer((table, action) => {
    if (action.type == 'ADD_NAME') {
      const id = table.nextID++;
      return {
        ...table,
        columns: {
          ...table.columns
        },
        rows: [...table.rows, {
          id: table.nextID++,
          name: action.name
        }]
      };
    }
    return table;
  }, {
    nextID: 1,
    rows: [{
      id: 0,
      name: 'ben'
    }],
    columns: {
      id: {
        filterable: true
      },
      name: {
        filterable: true
      }
    }
  });
  const [hotKeys, hotKeyDispatch, getHotKeyState] = useEnhancedReducer(hotKeyReducer);
  useHotKeyHandler({
    dispatch: hotKeyDispatch,
    getState: getHotKeyState
  });
  useEffect(() => {
    hotKeyDispatch({
      type: 'SET_HOTKEY',
      key: 'space',
      press: 'onKeyDown',
      fn: (state, dispatch) => {
        setKnookX(randomIn(0, 7));
      }
    });
  }, []);
  const [mouse, mouseDispatch, getMouseState] = useEnhancedReducer((mouse, action) => {
    switch (action.type) {
      case 'SET_MOUSE_DOWN':
        {
          const {
            isLeft,
            isDown,
            downPixel
          } = action;
          return {
            ...mouse,
            isLeftDown: isLeft ? isDown : mouse.isLeftDown,
            isRightDown: isLeft ? mouse.isRightDown : isDown,
            downPixel: isDown && downPixel != null ? downPixel : mouse.downPixel
          };
        }
      case 'SET_MOUSE_POS':
        {
          const {
            curPixel
          } = action;
          return {
            ...mouse,
            prevPixel: {
              ...mouse.curPixel
            },
            curPixel
          };
        }
      case 'ADD_LINE':
        {
          return {
            ...mouse,
            lines: [...mouse.lines, action.line]
          };
        }
      case 'CHANGE_CANVAS_SIZE':
        {
          return {
            ...mouse,
            canvasSize: action.canvasSize
          };
        }
    }
    return mouse;
  }, {
    isLeftDown: false,
    isRightDown: false,
    downPixel: {
      x: 0,
      y: 0
    },
    prevPixel: {
      x: 0,
      y: 0
    },
    curPixel: {
      x: 0,
      y: 0
    },
    canvasSize: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    },
    lines: [],
    prevInteractPos: null
  });
  const div = (pos, size) => {
    return {
      x: pos.x / size.width,
      y: pos.y / size.height
    };
  };
  useMouseHandler("canvas", {
    dispatch: mouseDispatch,
    getState: getMouseState
  }, {
    leftDown: (state, dispatch, pos) => {
      console.log("click", pos);
    },
    mouseMove: (state, dispatch, gridPos) => {
      if (!state.isLeftDown) return;
      dispatch({
        inMove: true
      });
      const {
        canvasSize
      } = state;
      if (state.prevInteractPos) {
        const prevPos = state.prevInteractPos;
        dispatch({
          type: 'ADD_LINE',
          line: {
            start: div(prevPos, canvasSize),
            end: div(gridPos, canvasSize),
            color: 'red'
          }
        });
        dispatch({
          prevInteractPos: gridPos
        });
      } else {
        dispatch({
          prevInteractPos: gridPos
        });
      }
    },
    leftUp: (state, dispatch, gridPos) => {
      dispatch({
        inMove: false
      });
      dispatch({
        prevInteractPos: null
      });
    }
  });
  useEffect(() => {
    const canvasWidth = fullCanvas ? window.innerWidth : CANVAS_WIDTH;
    const canvasHeight = fullCanvas ? window.innerHeight : CANVAS_HEIGHT;
    render(canvasWidth, canvasHeight, mouse.lines);
  }, [mouse.lines, fullCanvas]);
  const [draggables, setDraggables] = useState([/*#__PURE__*/React.createElement(Draggable, {
    id: "drag1",
    disabled: false,
    key: "drag1",
    style: {
      top: 300,
      left: 200
    }
  }), /*#__PURE__*/React.createElement(Draggable, {
    id: "drag2",
    key: "drag2",
    style: {
      top: 300,
      left: 100
    }
  }), /*#__PURE__*/React.createElement(Draggable, {
    id: "drag3",
    key: "drag3",
    style: {
      top: 100,
      left: 100
    }
  })]);
  const [knookX, setKnookX] = useState(2);
  const [isRotated, setIsRotated] = useState(false);
  const [someText, setSomeText] = useState('hello world');
  return /*#__PURE__*/React.createElement("div", null, modal, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 4,
      left: 4,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Pressed " + counter.val + " times",
    onClick: () => setCounter({
      val: counter.val + 1
    }),
    hoverCard: /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        height: 20,
        backgroundColor: 'white',
        border: '1px solid black'
      }
    }, "Some help text")
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Add Draggable",
    onClick: () => {
      const nextID = "drag" + (draggables.length + 1);
      setDraggables([...draggables, /*#__PURE__*/React.createElement(Draggable, {
        id: nextID,
        key: nextID,
        style: {
          top: randomIn(0, 3) * 100,
          left: randomIn(0, 3) * 100,
          backgroundColor: oneOf(['red', 'blue', 'orange', 'purple'])
        }
      })]);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Remove Draggable",
    onClick: () => {
      setDraggables(draggables.slice(0, -1));
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Add Row",
    onClick: () => updateTable({
      type: 'ADD_NAME',
      name: 'foo'
    })
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Set KnookX",
    onClick: () => setKnookX(randomIn(0, 7))
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Rotate Board",
    onClick: () => setIsRotated(!isRotated)
  }), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement(TextField, {
    value: "hello",
    onBlur: val => {
      console.log(val);
    }
  }), /*#__PURE__*/React.createElement(TextArea, {
    value: someText,
    onChange: setSomeText,
    rows: 4,
    style: {
      resize: 'none',
      width: 400
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Display Modal",
    disabled: modal != null,
    onClick: () => {
      setModal( /*#__PURE__*/React.createElement(Modal, {
        title: "Modal",
        dismiss: () => setModal(null),
        body: /*#__PURE__*/React.createElement(ModalBody, {
          counter: counter,
          counter2: counter2
        }),
        buttons: [{
          label: 'Dismiss',
          onClick: () => setModal(null)
        }]
      }));
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Grow Canvas",
    onClick: () => {
      CANVAS_WIDTH *= 1.2;
      CANVAS_HEIGHT *= 1.2;
      mouseDispatch({
        type: 'CHANGE_CANVAS_SIZE',
        canvasSize: {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT
        }
      });
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: fullCanvas ? "Smaller Canvas" : "Set Full Screen Canvas",
    onClick: () => setFullCanvas(!fullCanvas)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      marginTop: 50
    }
  }, /*#__PURE__*/React.createElement(Canvas, {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    view: grid,
    useFullScreen: fullCanvas,
    onResize: () => {
      const canvasWidth = fullCanvas ? window.innerWidth : CANVAS_WIDTH;
      const canvasHeight = fullCanvas ? window.innerHeight : CANVAS_HEIGHT;
      mouseDispatch({
        type: 'CHANGE_CANVAS_SIZE',
        canvasSize: {
          width: canvasWidth,
          height: canvasHeight
        }
      });
      render(canvasWidth, canvasHeight, mouse.lines);
    }
  }), /*#__PURE__*/React.createElement(Table, {
    style: {
      paddingTop: '3rem',
      fontSize: 19
    },
    rows: table.rows,
    columns: table.columns
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Slider, {
    label: "Slider",
    style: {
      display: 'inline'
    },
    min: 0,
    max: 10,
    value: counter.val,
    noOriginalValue: true,
    step: 0.1,
    isFloat: true,
    onChange: v => {
      return setCounter({
        val: v
      });
    }
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Slider 2",
    style: {
      display: 'inline'
    },
    min: 0,
    max: 10,
    value: counter2.val,
    noNumberField: true,
    onChange: v => {
      return setCounter2({
        val: v
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(DragArea, {
    snapX: 100,
    snapY: 100,
    isDropAllowed: (id, position) => {
      console.log(id, position);
      if (id == 'drag4') return false;
      return true;
    },
    onDrop: (id, position) => {
      console.log(id, "dropped at", position);
    },
    style: {
      width: 400,
      height: 400,
      border: '1px solid black'
    }
  }, draggables), /*#__PURE__*/React.createElement(Board, {
    pixelSize: {
      width: 400,
      height: 400
    },
    gridSize: {
      width: 8,
      height: 8
    },
    isRotated: isRotated,
    onPieceMove: (id, position) => {
      console.log(id, "moved to", position);
    },
    onPiecePickup: (id, position) => {
      console.log(id, "picked up at", position);
    },
    isMoveAllowed: (id, position) => {
      return true;
    },
    onMoveCancel: id => {
      console.log("cancel", id);
    },
    pieces: [{
      id: 'whiteKing',
      position: {
        x: 1,
        y: 1
      },
      sprite: /*#__PURE__*/React.createElement(SpriteSheet, {
        src: '../chess.png',
        offset: {
          x: 0,
          y: 0
        },
        spriteSheet: {
          pxWidth: 50,
          pxHeight: 50,
          imagesAcross: 6,
          imagesDown: 2
        }
      })
    }, {
      id: 'whiteQueen',
      position: {
        x: 1,
        y: 2
      },
      sprite: /*#__PURE__*/React.createElement(SpriteSheet, {
        src: '../chess.png',
        offset: {
          x: 1,
          y: 0
        },
        spriteSheet: {
          pxWidth: 50,
          pxHeight: 50,
          imagesAcross: 6,
          imagesDown: 2
        }
      })
    }, {
      id: 'blackKing',
      position: {
        x: 7,
        y: 7
      },
      sprite: /*#__PURE__*/React.createElement(SpriteSheet, {
        src: '../chess.png',
        offset: {
          x: 0,
          y: 1
        },
        spriteSheet: {
          pxWidth: 50,
          pxHeight: 50,
          imagesAcross: 6,
          imagesDown: 2
        }
      })
    }, {
      id: 'blackQueen',
      position: {
        x: 6,
        y: 7
      },
      sprite: /*#__PURE__*/React.createElement(SpriteSheet, {
        src: '../chess.png',
        offset: {
          x: 1,
          y: 1
        },
        spriteSheet: {
          pxWidth: 50,
          pxHeight: 50,
          imagesAcross: 6,
          imagesDown: 2
        }
      })
    }, {
      id: 'whiteKnook',
      position: {
        x: knookX,
        y: 2
      },
      sprite: /*#__PURE__*/React.createElement(SpriteSheet, {
        src: '../chess2.png',
        offset: {
          x: 6,
          y: 0
        },
        spriteSheet: {
          pxWidth: 50,
          pxHeight: 50,
          imagesAcross: 10,
          imagesDown: 2
        }
      })
    }]
  })));
};
const Draggable = props => {
  return /*#__PURE__*/React.createElement("div", {
    id: props.id,
    style: {
      position: 'absolute',
      width: 100,
      height: 100,
      top: 200,
      left: 250,
      textAlign: 'center',
      backgroundColor: 'green',
      borderRadius: '5%',
      cursor: 'pointer',
      ...(props.style || {})
    }
  }, props.id);
};
const HorizontalSplitPane = props => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexFlow: "column",
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'red',
      opacity: 0.2,
      width: '100%',
      borderBottom: '1px solid black'
    }
  }, "Hello"), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'steelblue',
      opacity: 0.2,
      width: '100%',
      borderTop: '1px solid black'
    }
  }, "World"));
};
const ModalBody = props => {
  useEffect(() => {
    console.log(props.counter.val, props.counter2.val);
    return () => {
      console.log(props.counter.val, props.counter2.val);
    };
  }, [props.counter]);
  return /*#__PURE__*/React.createElement("div", null, "lorem ipsum the quick brown fox jumped over the lazy dog");
};
const mult = (pos, size) => {
  return {
    x: pos.x * size.width,
    y: pos.y * size.height
  };
};
const render = (canvasWidth, canvasHeight, lines) => {
  const cvs = document.getElementById('canvas');
  const ctx = cvs.getContext('2d');
  ctx.save();
  ctx.fillStyle = 'gray';
  const pxW = canvasWidth / grid.width;
  const pxH = canvasHeight / grid.height;
  // ctx.scale(1 / pxW, 1 / pxH); // not needed now that canvas size is right

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
};
const root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);