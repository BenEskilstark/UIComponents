'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var Button = require('./Button.react');
var useState = React.useState,
    useEffect = React.useEffect,
    useMemo = React.useMemo;

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

var AudioWidget = function AudioWidget(props) {
  var _useState = useState(!!props.isMuted),
      _useState2 = _slicedToArray(_useState, 2),
      isMuted = _useState2[0],
      setIsMuted = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      playIndex = _useState4[0],
      setPlayIndex = _useState4[1];

  var playOrder = useMemo(function () {
    var array = props.audioFiles.map(function (a, i) {
      return i;
    });
    if (props.isShuffled) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      // initialOrder.sort(() => (Math.random() > 0.5) ? 1 : -1)
    }
    return array;
  }, [props.audioFiles]);

  var widgetStyle = {
    margin: 5,
    borderRadius: 8,
    left: 5
  };

  // player
  var audioPlayer = useMemo(function () {
    var a = new Audio(props.audioFiles[playIndex].path);
    return a;
  }, [playIndex, isMuted, props.audioFiles]);

  useEffect(function () {
    if (!isMuted) {
      audioPlayer.addEventListener('loadeddata', function () {
        audioPlayer.play();
        setTimeout(function () {
          return setPlayIndex((playIndex + 1) % props.audioFiles.length);
        }, audioPlayer.duration * 1000);
      });
    }
    return function () {
      audioPlayer.pause();
    };
  }, [playIndex, isMuted, props.audioFiles, audioPlayer]);

  return React.createElement(
    'div',
    {
      style: props.style ? props.style : widgetStyle
    },
    React.createElement(Button, {
      label: isMuted ? 'Turn Music ON' : 'Turn Music OFF',
      onClick: function onClick() {
        audioPlayer.pause();
        setIsMuted(!isMuted);
        if (props.setIsMuted) {
          props.setIsMuted(!isMuted);
        }
      }
    })
  );
};

module.exports = AudioWidget;