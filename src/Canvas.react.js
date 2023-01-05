const React = require('react');
const {useEffect, useState, useMemo, Component} = React;

function Canvas(props) {
  let {
    useFullScreen,
    // only necessary if not useFullScreen
    width, height,

    style, // style overrides

    id, // optional if you have multiple canvases on the same page

    onResize, // optional function called when the canvas resizes

    // needed for resizing images on canvas relative to canvas size
    // cellSize, // size in pixels of grid space
    // dispatch,
    // needed for focusing an entity (plus cellSize and dispatch)
    // focus, // Entity

  } = props;

  const [windowWidth, setWindowWidth] = useState(
    width && !useFullScreen ? width : window.innerWidth,
  );
  const [windowHeight, setWindowHeight] = useState(
    height && !useFullScreen ? height : window.innerHeight,
  );

  useEffect(() => {
    function handleResize() {
      if (useFullScreen) {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
      } else {
        setWindowWidth(width);
        setWindowHeight(height);
      }
    }

    handleResize();

    if (useFullScreen) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [useFullScreen, onResize]);

  useEffect(() => {
    if (onResize) {
      onResize(windowWidth, windowHeight);
    }
  }, [useFullScreen, onResize, windowWidth, windowHeight]);

  return (
    <div id="canvasWrapper"
      style={{
        width,
        height,
      }}
    >
      <canvas
        id={id || "canvas"} style={{
          cursor: 'pointer',
          ...(style ? style : {}),
        }}
        width={useFullScreen ? windowWidth : width}
        height={useFullScreen ? windowHeight : height}
      />
    </div>
  );
}


module.exports = React.memo(Canvas);
