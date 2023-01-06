const React = require('react');
const {
  useMouseHandler,
  mouseReducer,
  useEnhancedReducer
} = require('./hooks');
const {
  add,
  subtract
} = require('bens_utils').vectors;
const {
  clamp
} = require('bens_utils').math;
const {
  useEffect,
  useState,
  useMemo
} = React;

/**
 * TODO:
 */

/*
 *  Props:
 *    id: string,
 *    style: object, // optional styling for the drag area
 *    snapX: number, // nearest multiple to snap to
 *    snapY: number,
 *    isDropAllowed: (id, position) => boolean,
 *    onDrop: (id, position) => void,
 *  Children Props:
 *    id: string,
 *    disabled: optional boolean, // not draggable
 *    style: {top, left, width, height}
 */

const DragArea = props => {
  var _state$mouse;
  const id = props.id ? props.id : "dragArea";

  // check for new draggables or removed draggables
  useEffect(() => {
    dispatch({
      draggables: props.children.map(c => {
        const elem = document.getElementById(c.props.id);
        if (!elem) return {
          id: c.props.id
        };
        return {
          id: c.props.id,
          disabled: c.props.disabled,
          style: {
            top: parseInt(elem.style.top),
            left: parseInt(elem.style.left),
            width: parseInt(elem.style.width),
            height: parseInt(elem.style.height)
          }
        };
      }).reverse()
    });
    props.children.forEach(c => {
      const elem = document.getElementById(c.props.id);
      elem.style["pointer-events"] = "none";
    });
  }, [props.children]);

  // handle state of everything
  const [state, dispatch, getState] = useEnhancedReducer((state, action) => {
    switch (action.type) {
      case 'SET_DRAGGABLE':
        {
          const {
            id,
            position
          } = action;
          let nextDraggables = [];
          for (const draggable of state.draggables) {
            if (draggable.id == id) {
              nextDraggables.push({
                ...draggable,
                style: {
                  ...draggable.style,
                  top: position.y,
                  left: position.x
                }
              });
            } else {
              nextDraggables.push(draggable);
            }
          }
          return {
            ...state,
            draggables: nextDraggables
          };
        }
      case 'SET_MOUSE_DOWN':
      case 'SET_MOUSE_POS':
        return {
          ...state,
          mouse: mouseReducer(state.mouse, action)
        };
    }
    return state;
  }, {
    mouse: null,
    selectedID: null,
    draggables: [],
    selectedOffset: null
  });

  // drag handling
  useMouseHandler(id, {
    dispatch,
    getState
  }, {
    mouseMove: (state, dispatch, pixel) => {
      if (!state.selectedID) return;
      let draggable = null;
      for (const d of state.draggables) {
        if (d.id == state.selectedID) draggable = d;
      }
      if (!draggable) return;
      const nextPosition = clampToArea(id, subtract(pixel, state.selectedOffset), draggable.style);
      dispatch({
        type: 'SET_DRAGGABLE',
        id: state.selectedID,
        position: nextPosition
      });
    },
    mouseLeave: (state, dispatch) => {
      if (!state.selectedID) return;
      dispatch({
        type: 'SET_DRAGGABLE',
        id: state.selectedID,
        position: subtract(state.mouse.downPixel, state.selectedOffset)
      });
      dispatch({
        selectedID: null,
        selectedOffset: null
      });
      dispatch({
        type: 'SET_MOUSE_DOWN',
        isDown: false,
        isLeft: true
      });
    },
    leftDown: (state, dispatch, pixel) => {
      for (const draggable of state.draggables) {
        if (clickedInElem(pixel, draggable.style) && !draggable.disabled) {
          const selectedOffset = {
            x: pixel.x - draggable.style.left,
            y: pixel.y - draggable.style.top
          };
          dispatch({
            selectedID: draggable.id,
            selectedOffset
          });
          return;
        }
      }
    },
    leftUp: (state, dispatch, pixel) => {
      if (!state.selectedID) return;
      let draggable = null;
      for (const d of state.draggables) {
        if (d.id == state.selectedID) draggable = d;
      }
      let dropPosition = pixel;
      if (draggable && (props.snapX || props.snapY)) {
        let snapX = props.snapX ?? 1;
        let snapY = props.snapY ?? 1;
        const x = Math.round(draggable.style.left / snapX) * snapX;
        const y = Math.round(draggable.style.top / snapY) * snapY;
        dropPosition = {
          x,
          y
        };
      }
      if (props.isDropAllowed && !props.isDropAllowed(state.selectedID, dropPosition)) {
        dispatch({
          type: 'SET_DRAGGABLE',
          id: state.selectedID,
          position: subtract(state.mouse.downPixel, state.selectedOffset)
        });
      } else {
        dispatch({
          type: 'SET_DRAGGABLE',
          id: state.selectedID,
          position: dropPosition
        });
        if (props.onDrop) props.onDrop(state.selectedID, dropPosition);
      }
      dispatch({
        selectedID: null,
        selectedOffset: null
      });
    }
  });

  // update element positions based on state
  useEffect(() => {
    for (const draggable of state.draggables) {
      const elem = document.getElementById(draggable.id);
      elem.style.left = draggable.style.left;
      elem.style.top = draggable.style.top;
      if (draggable.id == state.selectedID) {
        elem.style.zIndex = 5;
      } else {
        elem.style.zIndex = 1;
      }
    }
  }, [state.draggables, state.selectedID]);
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      cursor: state !== null && state !== void 0 && (_state$mouse = state.mouse) !== null && _state$mouse !== void 0 && _state$mouse.isLeftDown && state.selectedID ? 'grabbing' : 'grab',
      position: 'relative',
      ...(props.style ? props.style : {})
    }
  }, props.children);
};
const clickedInElem = (pixel, style) => {
  return pixel.x >= style.left && pixel.x <= style.left + style.width && pixel.y >= style.top && pixel.y <= style.top + style.height;
};
const clampToArea = (dragAreaID, pixel, style) => {
  const dragArea = document.getElementById(dragAreaID);
  const {
    width,
    height
  } = dragArea.getBoundingClientRect();
  return {
    x: clamp(pixel.x, 0, width - style.width),
    y: clamp(pixel.y, 0, height - style.height)
  };
};
const mouseInsideDragArea = (dragAreaID, pixel) => {
  const dragArea = document.getElementById(dragAreaID);
  const {
    width,
    height
  } = dragArea.getBoundingClientRect();
  const result = pixel.x >= 0 && pixel.x <= width && pixel.y >= 0 && pixel.y <= height;
  console.log("in drag area", result);
  return result;
};
module.exports = DragArea;