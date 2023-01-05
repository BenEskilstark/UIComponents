const React = require('react');

/**
 *  Props:
 *    - color1: cssColor,
 *    - color2: cssColor,
 *    - pixelSize: {width, height}, // board size in pixels
 *    - gridSize: {width, height}, // board size in squares
 */
const CheckerboardBackground = (props) => {
  const {color1, color2, pixelSize, gridSize} = props;
  const cellWidth = pixelSize.width / gridSize.width;
  const cellHeight = pixelSize.height / gridSize.height;
  const squares = [];
  for (let x = 0; x < gridSize.width; x++) {
    for (let y = 0; y < gridSize.height; y++) {
      let backgroundColor = x % 2 == 1 ? color1 : color2;
      if (y % 2 == 1) {
        backgroundColor = x % 2 == 0 ? color1 : color2;
      }
      squares.push(
        <div key={"checker_" + x + "_" + y}
          style={{
            width: cellWidth, height: cellHeight,
            backgroundColor,
          }}
        />
      );
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        position: 'absolute',
        width: pixelSize.width, height: pixelSize.height,
      }}
    >
      {squares}
    </div>
  );
};

module.exports = CheckerboardBackground;
