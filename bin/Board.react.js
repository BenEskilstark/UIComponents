function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const React = require('react');
const DragArea = require('./DragArea.react.js');
const {
  useState,
  useEffect,
  useMemo,
  useReducer
} = React;

/*
 * TODO
 *  - call a function to make a piece move
 *  - call a function to add/remove pieces
 *  - pass through isDropAllowed and onDrop
 */

/**
 *  Props:
 *    - pixelSize: {width, height}, // board size in pixels
 *    - gridSize: {width, height}, // board size in squares
 *    - pieces: Array<{id, position, ?size, ?disabled, sprite}>
 *    - background: HTML, // background div
 *    - onPieceMove: (id, position) => void, // board position
 *    - isMoveAllowed: (id, position) => void, // board position
 *
 *  Props for pieces:
 *    - sprite: see SpriteSheet.react
 */

const Board = props => {
  const id = props.id ?? "Board";
  const {
    pixelSize,
    gridSize,
    pieces
  } = props;
  const cellWidth = pixelSize.width / gridSize.width;
  const cellHeight = pixelSize.height / gridSize.height;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, props.background, /*#__PURE__*/React.createElement(DragArea, {
    isDropAllowed: (id, position) => {
      if (!props.isMoveAllowed) return true;
      const x = Math.round(position.x / cellWidth);
      const y = Math.round(position.y / cellHeight);
      return props.isMoveAllowed(id, {
        x,
        y
      });
    },
    onDrop: (id, position) => {
      if (!props.onPieceMove) return;
      const x = Math.round(position.x / cellWidth);
      const y = Math.round(position.y / cellHeight);
      props.onPieceMove(id, {
        x,
        y
      });
    },
    id: id,
    snapX: cellWidth,
    snapY: cellHeight,
    style: {
      border: '1px solid black',
      ...(props.style ?? {}),
      ...pixelSize
    }
  }, pieces.map(p => {
    return /*#__PURE__*/React.createElement(Piece, _extends({
      key: p.id,
      cellWidth: cellWidth,
      cellHeight: cellHeight
    }, p));
  })));
};
const Piece = props => {
  const {
    cellWidth,
    cellHeight
  } = props;
  const size = props.size ?? {
    width: 1,
    height: 1
  };
  return /*#__PURE__*/React.createElement("div", {
    id: props.id,
    disabled: props.disabled,
    style: {
      top: props.position.y * cellHeight,
      left: props.position.x * cellWidth,
      width: size.width * cellWidth,
      height: size.height * cellHeight,
      position: 'absolute'
    }
  }, props.sprite);
};
module.exports = Board;