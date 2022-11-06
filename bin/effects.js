'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var React = require('react');
var useEffect = React.useEffect,
    useState = React.useState,
    useMemo = React.useMemo,
    useReducer = React.useReducer,
    useRef = React.useRef,
    useCallback = React.useCallback;


var useEnhancedReducer = function useEnhancedReducer(reducer, initState, initializer) {
  var lastState = useRef(initState);
  var getState = useCallback(function () {
    return lastState.current;
  }, []);
  return [].concat(_toConsumableArray(useReducer(function (state, action) {
    return lastState.current = reducer(state, action);
  }, initState, initializer)), [getState]);
};

module.exports = {
  useEnhancedReducer: useEnhancedReducer
};