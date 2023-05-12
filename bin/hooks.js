const React = require('react');
const {
  throttle
} = require('bens_utils').helpers;
const {
  useEffect,
  useState,
  useMemo,
  useReducer,
  useRef,
  useCallback
} = React;

// --------------------------------------------------------------------
// UseEnhancedReducer
// --------------------------------------------------------------------
// use like
// const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState);
// ALSO
// can dispatch an action with no type and the action is simply merged into the state
// with no need for handling
const useEnhancedReducer = (reducer, initState, initializer) => {
  const lastState = useRef(initState);
  const getState = useCallback(() => lastState.current, []);
  return [...useReducer((state, action) => {
    const mergeReducer = (state, action) => {
      if (action.type === undefined) {
        return {
          ...state,
          ...action
        };
      }
      return reducer(state, action);
    };
    return lastState.current = mergeReducer(state, action);
  }, initState, initializer), getState];
};

// --------------------------------------------------------------------
// UseResponsiveDimensions
// --------------------------------------------------------------------
// use like
// const [width, height] = useResponsiveDimensions((width, height) => doStuff);
const useResponsiveDimensions = onResize => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);
  useEffect(() => {
    if (onResize) {
      onResize(windowWidth, windowHeight);
    }
  }, [windowWidth, windowHeight]);
  return [windowWidth, windowHeight];
};

// --------------------------------------------------------------------
// UseHotkeyHandler
// --------------------------------------------------------------------

// NOTE:
// type PseudoStore = {dispatch: (action) => void, getState: () => HotKeys}
// Use Like:
// const [hotKeys, hotKeyDispatch, getHotKeyState] = useEnhancedReducer(hotKeyReducer);
// useHotKeyHandler({dispatch: hotKeyDispatch, getState: getHotKeyState});
// useEffect(() => {
//    hotKeyDispatch({type: 'SET_HOTKEY', key: 'space', press: 'onKeyDown', fn: (state, dispatch) => {
//      doSomething();
//    }});
// }, []);
// NOTE: key must be capitalized! space, enter, left,right,up,down also allowed
const useHotKeyHandler = (pseudoStore, noWASD, dependencies) => {
  useEffect(() => {
    const {
      dispatch,
      getState
    } = pseudoStore;
    const keyFn = (ev, keyEventType, pressed) => {
      const state = getState();
      const dir = getUpDownLeftRight(ev, noWASD);
      if (dir != null) {
        if (state && state[keyEventType][dir] != null) {
          state[keyEventType][dir](getState(), dispatch);
        }
        dispatch({
          type: 'SET_KEY_PRESS',
          key: dir,
          pressed
        });
        return;
      }
      if (ev.keyCode === 13) {
        if (state && state[keyEventType].enter != null) {
          state[keyEventType].enter(getState(), dispatch);
        }
        dispatch({
          type: 'SET_KEY_PRESS',
          key: 'enter',
          pressed
        });
        return;
      }
      if (ev.keyCode === 32) {
        if (state && state[keyEventType].space != null) {
          state[keyEventType].space(getState(), dispatch);
        }
        dispatch({
          type: 'SET_KEY_PRESS',
          key: 'space',
          pressed
        });
        return;
      }
      const character = String.fromCharCode(ev.keyCode).toUpperCase();
      if (character != null) {
        if (state && state[keyEventType][character] != null) {
          state[keyEventType][character](getState(), dispatch);
        }
        dispatch({
          type: 'SET_KEY_PRESS',
          key: character,
          pressed
        });
      }
    };

    // keypress event handling
    document.onkeydown = ev => {
      keyFn(ev, "onKeyDown", true);
    };
    document.onkeypress = ev => {
      keyFn(ev, "onKeyPress", true);
    };
    document.onkeyup = ev => {
      keyFn(ev, "onKeyUp", false);
    };
  }, dependencies ?? []);
};
const hotKeyReducer = (hotKeys, action) => {
  if (hotKeys === undefined) {
    hotKeys = {
      onKeyDown: {},
      onKeyPress: {},
      onKeyUp: {},
      keysDown: {}
    };
  }
  switch (action.type) {
    case 'SET_KEY_PRESS':
      {
        const {
          key,
          pressed,
          once
        } = action;
        hotKeys.keysDown[key] = pressed;
        if (once == true) {
          hotKeys.once = true;
        }
        return hotKeys;
      }
    case 'SET_HOTKEY':
      {
        const {
          key,
          press,
          fn
        } = action;
        hotKeys[press][key] = fn;
        return hotKeys;
      }
  }
  return hotKeys;
};
const getUpDownLeftRight = (ev, noWASD) => {
  const keyCode = ev.keyCode;
  if (noWASD) {
    if (keyCode === 38) {
      return 'down';
    }
    if (keyCode === 40) {
      return 'up';
    }
    if (keyCode === 37) {
      return 'left';
    }
    if (keyCode === 39) {
      return 'right';
    }
    return null;
  }
  if (keyCode === 87 || keyCode === 38 || keyCode === 119) {
    return 'down';
  }
  if (keyCode === 83 || keyCode === 40 || keyCode === 115) {
    return 'up';
  }
  if (keyCode === 65 || keyCode === 37 || keyCode === 97) {
    return 'left';
  }
  if (keyCode === 68 || keyCode === 39 || keyCode === 100) {
    return 'right';
  }
  return null;
};

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
const useMouseHandler = (elementID, pseudoStore, handlers, dependencies, moveThrottle) => {
  useEffect(() => {
    const mvFn = throttle(onMove, [elementID, pseudoStore, handlers], moveThrottle ?? 12);
    const touchMvFn = ev => {
      // if (ev.target.id != elementID) ev.preventDefault();
      onMove(elementID, pseudoStore, handlers, ev);
    };
    const mouseDownFn = ev => {
      onMouseDown(elementID, pseudoStore, handlers, ev);
    };
    const mouseUpFn = ev => {
      onMouseUp(elementID, pseudoStore, handlers, ev);
    };
    const mouseLeaveFn = ev => {
      onMouseLeave(elementID, pseudoStore, handlers, ev);
    };
    let scrollLocked = false;
    const scrollFn = ev => {
      if (!scrollLocked) {
        onScroll(elementID, pseudoStore, handlers, ev);
        scrollLocked = true;
        setTimeout(() => {
          scrollLocked = false;
        }, 150);
      }
    };
    if (handlers.scroll) {
      window.addEventListener("scroll", scrollFn);
    }
    if (handlers.mouseMove) {
      window.addEventListener("mousemove", mvFn);
      window.addEventListener("touchmove", touchMvFn);
    }
    window.addEventListener("mousedown", mouseDownFn);
    window.addEventListener("mouseup", mouseUpFn);
    window.addEventListener("touchstart", mouseDownFn);
    window.addEventListener("touchend", mouseUpFn);
    window.addEventListener("touchcancel", mouseUpFn);
    window.addEventListener("mouseout", mouseLeaveFn);
    return () => {
      window.removeEventListener("scroll", scrollFn);
      window.removeEventListener("mousemove", mvFn);
      window.removeEventListener("touchmove", touchMvFn);
      window.removeEventListener("mousedown", mouseDownFn);
      window.removeEventListener("mouseup", mouseUpFn);
      window.removeEventListener("touchstart", mouseDownFn);
      window.removeEventListener("touchend", mouseUpFn);
      window.removeEventListener("touchcancel", mouseUpFn);
      window.removeEventListener("mouseleave", mouseLeaveFn);
    };
  }, dependencies ?? []);
};
const getMousePixel = (elementID, ev) => {
  if (ev.target.id != elementID) return null;
  const elem = document.getElementById(elementID);
  if (!elem) return null;
  const rect = elem.getBoundingClientRect();
  let x = ev.clientX;
  let y = ev.clientY;
  if (ev.type === 'touchstart' || ev.type === 'touchmove') {
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
    y: y - rect.top
  };
  return elemPos;
};
const onScroll = (elementID, pseudoStore, handlers, ev) => {
  if (ev.target.id != elementID) return null;
  const {
    getState,
    dispatch
  } = pseudoStore;
  handlers.scroll(getState(), dispatch, ev.wheelDelta < 0 ? 1 : -1);
};
const onMouseLeave = (elementID, pseudoStore, handlers, ev) => {
  if (ev.target.id != elementID) return null;
  const {
    getState,
    dispatch
  } = pseudoStore;
  if (handlers.mouseLeave) {
    handlers.mouseLeave(getState(), dispatch);
  }
};
const onMove = (elementID, pseudoStore, handlers, ev) => {
  const {
    getState,
    dispatch
  } = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;
  dispatch({
    type: 'SET_MOUSE_POS',
    curPixel: pos
  });
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
  const {
    getState,
    dispatch
  } = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;
  if (ev.button == 0 || ev.type == 'touchstart') {
    // left click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: true,
      isDown: true,
      downPixel: pos
    });
    if (handlers.leftDown != null) {
      handlers.leftDown(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) {
    // right click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: false,
      isDown: true,
      downPixel: pos
    });
    if (handlers.rightDown != null) {
      handlers.rightDown(getState(), dispatch, pos);
    }
  }
};
const onMouseUp = (elementID, pseudoStore, handlers, ev) => {
  const {
    getState,
    dispatch
  } = pseudoStore;
  const pos = getMousePixel(elementID, ev);
  if (!pos) return;
  if (ev.button == 0 || ev.type == 'touchend' || ev.type == 'touchcancel') {
    // left click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: true,
      isDown: false
    });
    if (handlers.leftUp != null) {
      handlers.leftUp(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) {
    // right click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: false,
      isDown: false
    });
    if (handlers.rightUp != null) {
      handlers.rightUp(getState(), dispatch, pos);
    }
  }
};
const mouseReducer = (mouse, action) => {
  if (mouse == undefined) {
    mouse = {
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
      prevInteractPos: null
    };
  }
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
  }
  return mouse;
};

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
};

// Desired hook
function useCompare(val) {
  const prevVal = usePrevious(val);
  return prevVal !== val;
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
  mouseReducer,
  useHotKeyHandler,
  hotKeyReducer,
  useResponsiveDimensions,
  useEnhancedEffect,
  useCompare,
  usePrevious
};