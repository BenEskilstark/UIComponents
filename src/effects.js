const React = require('react');
const {
  useEffect, useState, useMemo, useReducer,
  useRef, useCallback,
} = React;

const useEnhancedReducer = (reducer, initState, initializer) => {
  const lastState = useRef(initState)
  const getState = useCallback(() => lastState.current, [])
  return [
    ...useReducer(
      (state, action) => lastState.current = reducer(state, action),
      initState,
      initializer
    ),
    getState
  ]
}

module.exports = {
  useEnhancedReducer,
};
