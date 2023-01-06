const React = require('react');
const CheckerBackground = require('./CheckerBackground.react.js');
const DragArea = require('./DragArea.react.js');
const {useState, useEffect, useMemo, useReducer} = React;

/*
 * TODO
 *  - call a function to move a piece
 *  - call a function to add/remove pieces
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

const Board = (props) => {
  const id = props.id ?? "Board";
  const {pixelSize, gridSize, pieces} = props;
  const cellWidth = pixelSize.width / gridSize.width;
  const cellHeight = pixelSize.height / gridSize.height;
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {props.background ?? (
        <CheckerBackground
          style={{marginTop: 1, marginLeft: 1}}
          color1="#6B8E23" color2="#FFFAF0"
          pixelSize={pixelSize} gridSize={gridSize}
        />
      )}
      <DragArea
        isDropAllowed={(id, position) => {
          if (!props.isMoveAllowed) return true;
          const x = Math.round(position.x / cellWidth);
          const y = Math.round(position.y / cellHeight);
          return props.isMoveAllowed(id, {x, y});
        }}
        onDrop={(id, position) => {
          if (!props.onPieceMove) return;
          const x = Math.round(position.x / cellWidth);
          const y = Math.round(position.y / cellHeight);
          props.onPieceMove(id, {x, y});
        }}
        id={id}
        snapX={cellWidth}
        snapY={cellHeight}
        style={{
          border: '1px solid black',
          ...(props.style ?? {}),
          ...pixelSize,
        }}
      >
        {pieces.map(p => {
          return (
            <Piece key={p.id}
              cellWidth={cellWidth} cellHeight={cellHeight}
              {...p}
            />
          );
        })}
      </DragArea>
    </div>
  );
}

const Piece = (props) => {
  const {cellWidth, cellHeight} = props;
  const size = props.size ?? {width: 1, height: 1};
  return (
    <div
      id={props.id}
      disabled={props.disabled}
      style={{
        top: props.position.y * cellHeight, left: props.position.x * cellWidth,
        width: size.width * cellWidth, height: size.height * cellHeight,
        position: 'absolute',
      }}
    >
      {props.sprite}
    </div>
  );
}

module.exports = Board;

