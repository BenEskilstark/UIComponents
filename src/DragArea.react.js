const React = require('react');
const {
  useMouseHandler, mouseReducer,
  useEnhancedReducer,
} = require('./hooks');
const {subtract} = require('bens_utils').vectors;
const {useEffect, useState, useMemo} = React;

/**
 * TODO:
 *  - take in function for sending new position to parent
 *  - take in function for checking if drop position is allowed and sending back to start
 *    position otherwise
 *  - don't allow dragging outside parent
 *  - make sure that when children are added/removed that dragging works as expected
 */

/*
 *  Props:
 *    id: string,
 *    style: object, // optional styling for the drag area
 *    snapX: number, // nearest multiple to snap to
 *    snapY: number,
 *    isDropAllowed: (id, position) => boolean,
 *    onDrop
 */

const DragArea = (props) => {
  const id = props.id ? props.id : "dragArea";

  // check for new draggables or removed draggables
  useEffect(() => {
    console.log(props.children);
    dispatch({draggables: props.children.map(c => {
      const elem = document.getElementById(c.props.id);
      if (!elem) return {id: c.props.id};
      return {id: c.props.id, style: {
        top: parseInt(elem.style.top), left: parseInt(elem.style.left),
        width: parseInt(elem.style.width), height: parseInt(elem.style.height),
      }};
    }).reverse()});
    props.children.forEach(c => {
      const elem = document.getElementById(c.props.id);
      elem.style["pointer-events"] = "none";
    });
  }, [props.children]);

  // handle state of everything
  const [state, dispatch, getState] = useEnhancedReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_DRAGGABLE': {
          const {id, position} = action;
          let nextDraggables = [];
          for (const draggable of state.draggables) {
            if (draggable.id == id) {
              nextDraggables.push({
                ...draggable,
                style: {
                  ...draggable.style,
                  top: position.y,
                  left: position.x,
                },
              });
            } else {
              nextDraggables.push(draggable);
            }
          }
          return {
            ...state,
            draggables: nextDraggables,
          };
        }
        case 'SET_MOUSE_DOWN':
        case 'SET_MOUSE_POS':
          return {
            ...state,
            mouse: mouseReducer(state.mouse, action),
          };
      }
      return state;
    }, {mouse: null, selectedID: null, draggables: [], selectedOffset: null},
  );

  // drag handling
  useMouseHandler(
    id, {dispatch, getState},
    {
      mouseMove: (state, dispatch, pixel) => {
        if (!state.selectedID) return;
        let draggable = null;
        for (const d of state.draggables) {
          if (d.id == state.selectedID) draggable = d;
        }
        if (!draggable) return;

        dispatch({
          type: 'SET_DRAGGABLE', id: state.selectedID,
          position: subtract(pixel, state.selectedOffset),
        });
      },
      leftDown: (state, dispatch, pixel) => {
        for (const draggable of state.draggables) {
          if (clickedInElem(pixel, draggable.style)) {
            const selectedOffset = {
              x: pixel.x - draggable.style.left,
              y: pixel.y - draggable.style.top,
            };
            dispatch({selectedID: draggable.id, selectedOffset})
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
          let snapX = props.snapX || 1;
          let snapY = props.snapY || 1;
          const x = Math.round(draggable.style.left / snapX) * snapX;
          const y = Math.round(draggable.style.top / snapY) * snapY;
          dropPosition = {x, y};
        }
        if (props.isDropAllowed && !props.isDropAllowed(id, dropPosition)) {
          // TODO: rollback to initial position
        } else {
          dispatch({
            type: 'SET_DRAGGABLE', id: state.selectedID,
            position: dropPosition,
          });
          if (props.onDrop) props.onDrop(state.selectedID, dropPosition);
        }
        dispatch({selectedID: null, selectedOffset: null});
      },
    },
  );

  // update element positions based on state
  useEffect(() => {
    for (const draggable of state.draggables) {
      const elem = document.getElementById(draggable.id);
      elem.style.left = draggable.style.left;
      elem.style.top = draggable.style.top;
    }
  }, [state.draggables]);


  return (
    <div
      id={id}
      style={{
        ...(props.style ? props.style : {}),
      }}
    >
      {props.children}
    </div>
  );
};

const clickedInElem = (pixel, style) => {
  return (
    pixel.x >= style.left && pixel.x <= style.left + style.width &&
    pixel.y >= style.top && pixel.y <= style.top + style.height
  );
}

module.exports = DragArea;
