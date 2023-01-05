const React = require('react');

/**
 *  Props:
 *    - style: object, // additional styling for outer div
 *    - width: px, height: px,
 *    - src: string, // image source
 *    - spriteSheet: {pxWidth, pxHeight, imagesAcross, imagesDown}, // width of a single image
 *    - offset: {x, y}, // x and y positions inside the spritesheet indexed by image
 *
 */

const SpriteSheet = props => {
  const {
    spriteSheet,
    offset
  } = props;
  const {
    pxWidth,
    pxHeight,
    imagesAcross,
    imagesDown
  } = spriteSheet;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: props.width ?? '100%',
      height: props.height ?? '100%',
      overflow: 'hidden',
      position: 'absolute',
      ...(props.style ?? {})
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: props.src,
    style: {
      position: 'absolute',
      width: pxWidth * imagesAcross,
      height: pxHeight * imagesDown,
      left: pxWidth * -1 * offset.x,
      top: pxHeight * -1 * offset.y
    }
  }));
};
module.exports = SpriteSheet;