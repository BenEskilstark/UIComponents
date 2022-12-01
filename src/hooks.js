const React = require('react');
const {
  useEffect, useState, useMemo, useReducer,
  useRef, useCallback,
} = React;

// use like
// const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState);
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
  useEnhancedEffect,
  useCompare,
  usePrevious,

};
