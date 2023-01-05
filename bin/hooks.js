'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var React = require('react');

var throttle = require('bens_utils').helpers.throttle;

var useEffect = React.useEffect,
    useState = React.useState,
    useMemo = React.useMemo,
    useReducer = React.useReducer,
    useRef = React.useRef,
    useCallback = React.useCallback;

// use like
// const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState);
// ALSO
// can dispatch an action with no type and the action is simply merged into the state
// with no need for handling

var useEnhancedReducer = function useEnhancedReducer(reducer, initState, initializer) {
  var lastState = useRef(initState);
  var getState = useCallback(function () {
    return lastState.current;
  }, []);
  return [].concat(_toConsumableArray(useReducer(function (state, action) {
    var mergeReducer = function mergeReducer(state, action) {
      if (action.type === undefined) {
        return _extends({}, state, action);
      }
      return reducer(state, action);
    };
    return lastState.current = mergeReducer(state, action);
  }, initState, initializer)), [getState]);
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
var useMouseHandler = function useMouseHandler(elementID, pseudoStore, handlers, dependencies) {
  useEffect(function () {
    var mvFn = throttle(onMove, [elementID, pseudoStore, handlers], 12);
    var touchMvFn = function touchMvFn(ev) {
      if (ev.target.id === state.streamID + '_canvas') {
        ev.preventDefault();
      }
      onMove(elementID, pseudoStore, handlers, ev);
    };

    var mouseDownFn = function mouseDownFn(ev) {
      onMouseDown(elementID, pseudoStore, handlers, ev);
    };
    var mouseUpFn = function mouseUpFn(ev) {
      onMouseUp(elementID, pseudoStore, handlers, ev);
    };

    var scrollLocked = false;
    var scrollFn = function scrollFn(ev) {
      if (!scrollLocked) {
        onScroll(elementID, pseudoStore, handlers, ev);
        scrollLocked = true;
        setTimeout(function () {
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

    return function () {
      window.removeEventListener("scroll", scrollFn);
      window.removeEventListener("mousemove", mvFn);
      window.removeEventListener("touchmove", touchMvFn);
      window.removeEventListener("mousedown", mouseDownFn);
      window.removeEventListener("mouseup", mouseUpFn);
      window.removeEventListener("touchstart", mouseDownFn);
      window.removeEventListener("touchend", mouseUpFn);
      window.removeEventListener("touchcancel", mouseUpFn);
    };
  }, dependencies || []);
};

var getMousePixel = function getMousePixel(elementID, ev) {
  if (ev.target.id != elementID) return null;
  var elem = document.getElementById(elementID);
  if (!elem) return null;
  var rect = elem.getBoundingClientRect();
  var x = ev.clientX;
  var y = ev.clientY;
  if (ev.type === 'touchstart' || ev.type === 'touchmove') {
    var touch = ev.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  if (ev.type == 'touchend') {
    var _touch = ev.changedTouches[0];
    x = _touch.clientX;
    y = _touch.clientY;
  }
  var elemPos = {
    x: x - rect.left,
    y: y - rect.top
  };

  return elemPos;
};

var onScroll = function onScroll(elementID, pseudoStore, handlers, ev) {
  if (ev.target.id != elementID) return null;
  var getState = pseudoStore.getState,
      dispatch = pseudoStore.dispatch;

  handlers.scroll(getState(), dispatch, ev.wheelDelta < 0 ? 1 : -1);
};

var onMove = function onMove(elementID, pseudoStore, handlers, ev) {
  var getState = pseudoStore.getState,
      dispatch = pseudoStore.dispatch;

  var pos = getMousePixel(elementID, ev);
  if (!pos) return;

  dispatch({ type: 'SET_MOUSE_POS', curPixel: pos });
  if (handlers.mouseMove != null) {
    handlers.mouseMove(getState(), dispatch, pos);
  }
};

var onMouseDown = function onMouseDown(elementID, pseudoStore, handlers, ev) {
  var elem = document.getElementById(elementID);
  // don't open the normal right-click menu
  if (elem != null) {
    elem.addEventListener('contextmenu', function (ev) {
      return ev.preventDefault();
    });
  }

  var getState = pseudoStore.getState,
      dispatch = pseudoStore.dispatch;

  var pos = getMousePixel(elementID, ev);
  if (!pos) return;

  if (ev.button == 0 || ev.type == 'touchstart') {
    // left click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: true, isDown: true, downPixel: pos
    });
    if (handlers.leftDown != null) {
      handlers.leftDown(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) {
    // right click
    dispatch({
      type: 'SET_MOUSE_DOWN',
      isLeft: false, isDown: true, downPixel: pos
    });
    if (handlers.rightDown != null) {
      handlers.rightDown(getState(), dispatch, pos);
    }
  }
};

var onMouseUp = function onMouseUp(elementID, pseudoStore, handlers, ev) {
  var getState = pseudoStore.getState,
      dispatch = pseudoStore.dispatch;

  var pos = getMousePixel(elementID, ev);
  if (!pos) return;

  if (ev.button == 0 || ev.type == 'touchend' || ev.type == 'touchcancel') {
    // left click
    dispatch({ type: 'SET_MOUSE_DOWN', isLeft: true, isDown: false });
    if (handlers.leftUp != null) {
      handlers.leftUp(getState(), dispatch, pos);
    }
  }
  if (ev.button == 2) {
    // right click
    dispatch({ type: 'SET_MOUSE_DOWN', isLeft: false, isDown: false });
    if (handlers.rightUp != null) {
      handlers.rightUp(getState(), dispatch, pos);
    }
  }
};

var mouseReducer = function mouseReducer(mouse, action) {
  if (mouse == undefined) {
    mouse = {
      isLeftDown: false,
      isRightDown: false,
      downPixel: { x: 0, y: 0 },
      prevPixel: { x: 0, y: 0 },
      curPixel: { x: 0, y: 0 },

      prevInteractPos: null
    };
  }

  switch (action.type) {
    case 'SET_MOUSE_DOWN':
      {
        var isLeft = action.isLeft,
            isDown = action.isDown,
            downPixel = action.downPixel;

        return _extends({}, mouse, {
          isLeftDown: isLeft ? isDown : mouse.isLeftDown,
          isRightDown: isLeft ? mouse.isRightDown : isDown,
          downPixel: isDown && downPixel != null ? downPixel : mouse.downPixel
        });
      }
    case 'SET_MOUSE_POS':
      {
        var curPixel = action.curPixel;

        return _extends({}, mouse, {
          prevPixel: _extends({}, mouse.curPixel),
          curPixel: curPixel
        });
      }
  }
  return mouse;
};

// --------------------------------------------------------------------
// UseEnhanced Effect (experimental)
// --------------------------------------------------------------------
// pass accessibleVals that the effect can read but won't re-run when they change
var useEnhancedEffect = function useEnhancedEffect(effectFn, dependencies, accessibleVals) {
  var compares = dependencies.map(useCompare);
  useEffect(function () {
    if (compares.filter(function (c) {
      return c;
    }).length == 0) return;
    effectFn();
  }, [].concat(_toConsumableArray(dependencies), _toConsumableArray(accessibleVals), _toConsumableArray(compares)));
};

// Desired hook
function useCompare(val) {
  var prevVal = usePrevious(val);
  return prevVal !== val;
}

// Helper hook
function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
}

module.exports = {
  useEnhancedReducer: useEnhancedReducer,
  useMouseHandler: useMouseHandler,
  mouseReducer: mouseReducer,
  useEnhancedEffect: useEnhancedEffect,
  useCompare: useCompare,
  usePrevious: usePrevious

};