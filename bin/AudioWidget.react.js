const React = require('react');
const Button = require('./Button.react');
const {
  useState,
  useEffect,
  useMemo
} = React;

/**
 * Props:
 *
 * audioFiles, // array of {path, type} pairs
 * isMuted, // optional boolean for outside control of this widget
 * setIsMuted, // optional function called when this is toggled
 * isShuffled, // optional boolean for whether audio should play in random order
 * style, // optional object of css styles
 *
 */

const AudioWidget = props => {
  const [isMuted, setIsMuted] = useState(!!props.isMuted);
  const [playIndex, setPlayIndex] = useState(0);
  const playOrder = useMemo(() => {
    let array = props.audioFiles.map((a, i) => i);
    if (props.isShuffled) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      // initialOrder.sort(() => (Math.random() > 0.5) ? 1 : -1)
    }

    return array;
  }, [props.audioFiles]);
  let widgetStyle = {
    margin: 5,
    borderRadius: 8,
    left: 5
  };

  // player
  const audioPlayer = useMemo(() => {
    const a = new Audio(props.audioFiles[playIndex].path);
    return a;
  }, [playIndex, isMuted, props.audioFiles]);
  useEffect(() => {
    if (!isMuted) {
      audioPlayer.addEventListener('loadeddata', () => {
        audioPlayer.play();
        setTimeout(() => setPlayIndex((playIndex + 1) % props.audioFiles.length), audioPlayer.duration * 1000);
      });
    }
    return () => {
      audioPlayer.pause();
    };
  }, [playIndex, isMuted, props.audioFiles, audioPlayer]);
  return /*#__PURE__*/React.createElement("div", {
    style: props.style ? props.style : widgetStyle
  }, /*#__PURE__*/React.createElement(Button, {
    label: isMuted ? 'Turn Music ON' : 'Turn Music OFF',
    onClick: () => {
      audioPlayer.pause();
      setIsMuted(!isMuted);
      if (props.setIsMuted) {
        props.setIsMuted(!isMuted);
      }
    }
  }));
};
module.exports = AudioWidget;