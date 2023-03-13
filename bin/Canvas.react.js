const React = require('react');
const {
  useResponsiveDimensions
} = require('./hooks');
const {
  useEffect,
  useState,
  useMemo,
  Component
} = React;
function Canvas(props) {
  let {
    useFullScreen,
    // only necessary if not useFullScreen
    width,
    height,
    view,
    // {x, y, width, height} of the world coordinates for the canvas
    // independent of the canvas element's width/height

    style,
    // style overrides

    id,
    // optional if you have multiple canvases on the same page

    onResize // optional function called when the canvas resizes
  } = props;
  const [windowWidth, windowHeight] = useResponsiveDimensions(onResize);

  // maintain canvas context sizing
  // useEffect(() => {
  //   const canvas = document.getElementById(id || "canvas");
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");

  //   ctx.restore(); // restore from previous resizing
  //   ctx.save();
  //   if (view && view.x != null && view.y != null) {
  //     ctx.translate(view.x, view.y);
  //   }
  // }, [width, height, view, useFullScreen, windowWidth, windowHeight]);

  return /*#__PURE__*/React.createElement("div", {
    id: "canvasWrapper",
    style: {
      width: useFullScreen ? windowWidth : width,
      height: useFullScreen ? windowHeight : height
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    id: id || "canvas",
    style: {
      cursor: 'pointer',
      width: useFullScreen ? windowWidth : width,
      height: useFullScreen ? windowHeight : height,
      ...(style ? style : {})
    },
    width: view && view.width ? view.width : width,
    height: view && view.height ? view.height : height
  }));
}
module.exports = Canvas;