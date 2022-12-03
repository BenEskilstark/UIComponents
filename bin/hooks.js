'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var React = require('react');
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
  useEnhancedEffect: useEnhancedEffect,
  useCompare: useCompare,
  usePrevious: usePrevious

};