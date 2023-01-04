const React = require('react');
const {throttle} = require('bens_utils').helpers;
const {
  useEffect, useState, useMemo, useReducer,
  useRef, useCallback,
} = React;



// use like
// const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState);
// ALSO
// can dispatch an action with no type and the action is simply merged into the state
// with no need for handling
const useEnhancedReducer = (reducer, initState, initializer) => {
  const lastState = useRef(initState)
  const getState = useCallback(() => lastState.current, [])
  return [
    ...useReducer(
      (state, action) => {
        const mergeReducer = (state, action) => {
          if (action.type === undefined) {
            return {
              ...state, ...action,
            }
          }
          return reducer(state, action)
        };
        return lastState.current = mergeReducer(state, action);
      },
      initState,
      initializer
    ),
    getState
  ]
}


// --------------------------------------------------------------------
// UseMouseHandler
// --------------------------------------------------------------------
// NOTE:
// type PseudoStore = {dispatch: (action) => void, getState: () => State}
// type Handlers = {
//  mouseMove,
//  leftDown, leftUp,
//  rightDown, rightUp,
//  scroll,
// };
const useMouseHandler = (elementID, pseudoStore, handlers, dependencies) => {
  useEffect(() => {
    if (handlers.mouseMove) {
      document.onmousemove = throttle(onMove, [elementID, pseudoStore, handlers], 12);
      document.ontouchmove = (ev) => {
        if (ev.target.id === state.streamID + '_canvas') {
          ev.preventDefault();
        }
        onMove(elementID, pseudoStore, handlers, ev);
      }
    } else {
      document.onmousemove = null;
      document.ontouchmove = null;
    }
    document.ontouchstart = (ev) => {
      onMouseDown(elementID, pseudoStore, handlers, ev);
    }
    document.ontouchend = (ev) => {
      onMouseUp(elementID, pseudoStore, handlers, ev);
    }
    document.ontouchcancel = (ev) => {
      onMouseUp(elementID, pseudoStore, handlers, ev);
    }
    document.onmousedown = (ev) => {
      onMouseDown(elementID, pseudoStore, handlers, ev);
    }
    document.onmouseup = (ev) => {
      onMouseUp(elementID, pseudoStore, handlers, ev);
    }
    if (handlers.scroll) {
      let scrollLocked = false;
      document.onwheel = (ev) => {
        if (!scrollLocked) {
          onScroll(elementID, pseudoStore, handlers, ev);
          scrollLocked = true;
          setTimeout(() => {scrollLocked = false}, 150);
        }
      }
    }

    return () => {
      document.onmousemove = null;
      document.ontouchmove = null;
      document.ontouchstart = null;
      document.ontouchend = null;
      document.ontouchcancel = null;
      document.onmousedown = null;
      document.onmouseup = null;
      document.onwheel = null;
    }
  }, dependencies || []);
}

const getMousePixel = (elementID, ev) => {
  if (ev.target.id != elementID) return null;
  const elem = document.getElementById(elementID);
  if (!elem) return null;
  const rect = elem.getBoundingClientRect();
  let x = ev.clientX;
  let y = ev.clientY;
  if (
    ev.type === 'touchstart' || ev.type === 'touchmove'
  ) {
    const touch = ev.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  if (ev.type == 'touchend') {
    const touch = ev.changedTouches[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  const elemPos = {
    x: x - rect.left,
    y: y - rect.top,
  };

  return elemPos;
};


const onScroll = (elementID, pseudoStore, handlers, ev) => {
  if (ev.target.id != elementID) return null;
  const {getState, dispatch} = pseudoStore;
  handlers.scroll(getState(), dispatch, ev.wheelDelta < 0 ? 1 : -1);
};

const onMove = (elementID, pseudoStore, handlers, ev) => {
  const {getState, dispatch} = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;

  dispatch({type: 'SET_MOUSE_POS', curPixel: pos});
  if (handlers.mouseMove != null) {
    handlers.mouseMove(getState(), dispatch, pos);
  }
};

const onMouseDown = (elementID, pseudoStore, handlers, ev) => {
  const elem = document.getElementById(elementID);
  // don't open the normal right-click menu
  if (elem != null) {
    elem.addEventListener('contextmenu', ev => ev.preventDefault());
  }

  const {getState, dispatch} = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;

  if (ev.button == 0 || ev.type == 'touchstart') { // left click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: true, isDown: true, downPixel: pos,
    });
    if (handlers.leftDown != null) {
      handlers.leftDown(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) { // right click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: false, isDown: true, downPixel: pos,
    });
    if (handlers.rightDown != null) {
      handlers.rightDown(getState(), dispatch, pos);
    }
  }
}

const onMouseUp = (elementID, pseudoStore, handlers, ev) => {
  const {getState, dispatch} = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;

  if (ev.button == 0 || ev.type == 'touchend' || ev.type == 'touchcancel') { // left click
    dispatch({type: 'SET_MOUSE_DOWN', isLeft: true, isDown: false})
    if (handlers.leftUp != null) {
      handlers.leftUp(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) { // right click
    dispatch({type: 'SET_MOUSE_DOWN', isLeft: false, isDown: false})
    if (handlers.rightUp != null) {
      handlers.rightUp(getState(), dispatch, pos);
    }
  }
}




// --------------------------------------------------------------------
// UseEnhanced Effect (experimental)
// --------------------------------------------------------------------
// pass accessibleVals that the effect can read but won't re-run when they change
const useEnhancedEffect = (effectFn, dependencies, accessibleVals) => {
  const compares = dependencies.map(useCompare);
  useEffect(() => {
    if (compares.filter(c => c).length == 0) return;
    effectFn();
  }, [...dependencies, ...accessibleVals, ...compares]);
}

// Desired hook
function useCompare (val) {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

// Helper hook
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}



module.exports = {
  useEnhancedReducer,
  useMouseHandler,
  useEnhancedEffect,
  useCompare,
  usePrevious,

};
