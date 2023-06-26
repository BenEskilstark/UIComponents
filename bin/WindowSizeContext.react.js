const React = require('react');
const {
  useEffect,
  useState,
  createContext
} = React;
const WindowSizeContext = createContext({});
const WindowSizeProvider = ({
  children
}) => {
  // detect orientation changes
  const [orientation, setOrientation] = useState(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
  useEffect(() => {
    const handleResize = () => {
      let isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };
    window.matchMedia("(orientation: portrait)").addEventListener("change", handleResize);
  }, []);

  // screen resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [orientation]);
  const values = {
    orientation,
    windowWidth,
    windowHeight
  };
  return /*#__PURE__*/React.createElement(WindowSizeContext.Provider, {
    value: values
  }, children);
};
module.exports = {
  WindowSizeContext,
  WindowSizeProvider
};