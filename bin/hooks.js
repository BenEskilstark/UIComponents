'use strict';

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

var useEnhancedReducer = function useEnhancedReducer(reducer, initState, initializer) {
  var lastState = useRef(initState);
  var getState = useCallback(function () {
    return lastState.current;
  }, []);
  return [].concat(_toConsumableArray(useReducer(function (state, action) {
    return lastState.current = reducer(state, action);
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