'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');

var _require = require('./hooks'),
    useMouseHandler = _require.useMouseHandler,
    mouseReducer = _require.mouseReducer,
    useEnhancedReducer = _require.useEnhancedReducer;

var subtract = require('bens_utils').vectors.subtract;

var useEffect = React.useEffect,
    useState = React.useState,
    useMemo = React.useMemo;

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

var DragArea = function DragArea(props) {
  var id = props.id ? props.id : "dragArea";

  // check for new draggables or removed draggables
  useEffect(function () {
    console.log(props.children);
    dispatch({ draggables: props.children.map(function (c) {
        var elem = document.getElementById(c.props.id);
        if (!elem) return { id: c.props.id };
        return { id: c.props.id, style: {
            top: parseInt(elem.style.top), left: parseInt(elem.style.left),
            width: parseInt(elem.style.width), height: parseInt(elem.style.height)
          } };
      }).reverse() });
    props.children.forEach(function (c) {
      var elem = document.getElementById(c.props.id);
      elem.style["pointer-events"] = "none";
    });
  }, [props.children]);

  // handle state of everything

  var _useEnhancedReducer = useEnhancedReducer(function (state, action) {
    switch (action.type) {
      case 'SET_DRAGGABLE':
        {
          var _id = action.id,
              position = action.position;

          var nextDraggables = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = state.draggables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var draggable = _step.value;

              if (draggable.id == _id) {
                nextDraggables.push(_extends({}, draggable, {
                  style: _extends({}, draggable.style, {
                    top: position.y,
                    left: position.x
                  })
                }));
              } else {
                nextDraggables.push(draggable);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return _extends({}, state, {
            draggables: nextDraggables
          });
        }
      case 'SET_MOUSE_DOWN':
      case 'SET_MOUSE_POS':
        return _extends({}, state, {
          mouse: mouseReducer(state.mouse, action)
        });
    }
    return state;
  }, { mouse: null, selectedID: null, draggables: [], selectedOffset: null }),
      _useEnhancedReducer2 = _slicedToArray(_useEnhancedReducer, 3),
      state = _useEnhancedReducer2[0],
      dispatch = _useEnhancedReducer2[1],
      getState = _useEnhancedReducer2[2];

  // drag handling


  useMouseHandler(id, { dispatch: dispatch, getState: getState }, {
    mouseMove: function mouseMove(state, dispatch, pixel) {
      if (!state.selectedID) return;
      var draggable = null;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = state.draggables[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var d = _step2.value;

          if (d.id == state.selectedID) draggable = d;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!draggable) return;

      dispatch({
        type: 'SET_DRAGGABLE', id: state.selectedID,
        position: subtract(pixel, state.selectedOffset)
      });
    },
    leftDown: function leftDown(state, dispatch, pixel) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = state.draggables[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var draggable = _step3.value;

          if (clickedInElem(pixel, draggable.style)) {
            var selectedOffset = {
              x: pixel.x - draggable.style.left,
              y: pixel.y - draggable.style.top
            };
            dispatch({ selectedID: draggable.id, selectedOffset: selectedOffset });
            return;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    },
    leftUp: function leftUp(state, dispatch, pixel) {
      if (!state.selectedID) return;
      var draggable = null;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = state.draggables[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var d = _step4.value;

          if (d.id == state.selectedID) draggable = d;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var dropPosition = pixel;
      if (draggable && (props.snapX || props.snapY)) {
        var snapX = props.snapX || 1;
        var snapY = props.snapY || 1;
        var x = Math.round(draggable.style.left / snapX) * snapX;
        var y = Math.round(draggable.style.top / snapY) * snapY;
        dropPosition = { x: x, y: y };
      }
      if (props.isDropAllowed && !props.isDropAllowed(id, dropPosition)) {
        // TODO: rollback to initial position
      } else {
        dispatch({
          type: 'SET_DRAGGABLE', id: state.selectedID,
          position: dropPosition
        });
        if (props.onDrop) props.onDrop(state.selectedID, dropPosition);
      }
      dispatch({ selectedID: null, selectedOffset: null });
    }
  });

  // update element positions based on state
  useEffect(function () {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = state.draggables[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var draggable = _step5.value;

        var elem = document.getElementById(draggable.id);
        elem.style.left = draggable.style.left;
        elem.style.top = draggable.style.top;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }, [state.draggables]);

  return React.createElement(
    'div',
    {
      id: id,
      style: _extends({}, props.style ? props.style : {})
    },
    props.children
  );
};

var clickedInElem = function clickedInElem(pixel, style) {
  return pixel.x >= style.left && pixel.x <= style.left + style.width && pixel.y >= style.top && pixel.y <= style.top + style.height;
};

module.exports = DragArea;