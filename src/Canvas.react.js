const React = require('react');
const {useEffect, useState, useMemo, Component} = React;

function Canvas(props: Props) {
  let {
    useFullScreen,
    // only necessary if not useFullScreen
    width, height,

    style, // style overrides

    id, // optional if you have multiple canvases on the same page

    // needed for resizing images on canvas relative to canvas size
    cellSize, // size in pixels of grid space
    dispatch,

    // needed for focusing an entity (plus cellSize and dispatch)
    focus, // Entity

    onResize, // optional function called when the canvas resizes
  } = props;

  const [windowWidth, setWindowWidth] = useState(width ? width : window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(height ? height : window.innerHeight);

  useEffect(() => {
    function handleResize() {
      if (onResize) {
        onResize();
      } else if (useFullScreen) {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize);
  });

  const overrideStyle = style ? style : {};

  // if (useFullScreen) {
  //   let sizeMult = 0.9;
  //   if (windowWidth < 600 || windowHeight < 800) {
  //     sizeMult = 0.75;
  //   }
  //   if (windowWidth > 1000 || windowHeight > 1000) {
  //     sizeMult = 1.25;
  //   }
  //   if (windowWidth > 1200 || windowHeight > 1200) {
  //     sizeMult = 1.3;
  //   }
  //   useEffect(() => {
  //     if (focus != null) {
  //       let viewPos = {x:0, y: 0};
  //       const viewWidth = windowWidth / (cellSize * sizeMult);
  //       const viewHeight = windowHeight / (cellHeight * sizeMult);
  //         viewPos = {
  //           x: focus.position.x - viewWidth / 2,
  //           y: focus.position.y - viewHeight /2,
  //         };
  //       dispatch({type: 'SET_VIEW_POS',
  //         viewPos, viewWidth, viewHeight,
  //       });
  //     }
  //   }, [windowWidth, windowHeight]);
  // }

  const fullScreenStyle = {
    height: '100%',
    width: '100%',
    margin: 'auto',
    position: 'relative',
  };
  const nonFullScreenStyle = {
    height,
    width,
  };

  return (
    <div id="canvasWrapper"
      style={useFullScreen ? fullScreenStyle : nonFullScreenStyle}
    >
      <canvas
        id={id || "canvas"} style={{
          cursor: 'pointer',
          ...overrideStyle,
        }}
        width={useFullScreen ? windowWidth : width}
        height={useFullScreen ? windowHeight : height}
      />
    </div>
  );
}

function withPropsChecker(WrappedComponent) {
  return class PropsChecker extends Component {
    componentWillReceiveProps(nextProps) {
      Object.keys(nextProps)
        .filter(key => {
          return nextProps[key] !== this.props[key];
        })
        .map(key => {
          console.log(
            'changed property:',
            key,
            'from',
            this.props[key],
            'to',
            nextProps[key]
          );
        });
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

module.exports = React.memo(Canvas);
