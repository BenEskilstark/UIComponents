function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const React = require('react');
const {
  subtract,
  add
} = require('bens_utils').vectors;
const {
  useMouseHandler,
  useEnhancedReducer,
  mouseReducer
} = require('./hooks');
const {
  useEffect,
  useState,
  useMemo
} = React;

/**
 * Required Props:
 *  - id: id of draggable area
 *  - options: Array<{label, onClick, style, isCircular, color}>
 *  - onSelectIndex: (index, option, isCancel) => void,
 *  - selectedIndex: index,
 *  - clickToSelect: ?boolean // whether clicking an element should select it from anywhere
 *  - width: pixels
 *  - height: pixels
 */
const SwipePicker = props => {
  const {
    options,
    style,
    width,
    height,
    id,
    minSize = 0.6,
    maxSize = 0.9,
    clickToSelect,
    frozenOnOneOption,
    selectedStyle = {},
    deselectedStyle = {},
    onSelectIndex,
    selectedIndex,
    defaultColor = 'rgb(205,202,179)',
    gap = 10,
    onMouseDown,
    onMouseMove
  } = props;

  // options can have dynamic widths so use these to get them on the fly
  const getOptionWidth = index => {
    const optionElem = document.getElementById(id + "_option_" + index);
    if (!optionElem) return 0;
    return optionElem.getBoundingClientRect().width;
  };
  const getWidthToOption = index => {
    let widthToCurrentElement = 0;
    for (let i = 0; i < index; i++) {
      widthToCurrentElement += getOptionWidth(i) + gap;
    }
    return widthToCurrentElement + getOptionWidth(index) / 2;
  };

  // distances to left, right, center
  const getOptionDistFromLeft = (index, left) => {
    const widthToCurrentElement = getWidthToOption(index);
    return widthToCurrentElement + left;
  };
  const getOptionDistFromRight = (index, left) => {
    const widthToCurrentElement = getWidthToOption(index);
    return Math.abs(widthToCurrentElement + left - width);
  };
  const getOptionDistFromCenter = (index, left) => {
    const widthToCurrentElement = getWidthToOption(index);
    return widthToCurrentElement + left - width / 2;
  };

  // get option relative to location
  const getOptionAtCenter = (options, left) => {
    let index = 0;
    let distToCenter = Math.abs(getOptionDistFromCenter(0, left));
    for (let i = 0; i < options.length; i++) {
      let testDist = Math.abs(getOptionDistFromCenter(i, left));
      if (testDist < distToCenter) {
        distToCenter = testDist;
        index = i;
      }
    }
    return index;
  };
  const getOptionAtOffset = (options, offset) => {
    const parentLeft = document.getElementById(id).getBoundingClientRect().x;
    for (let i = 0; i < options.length; i++) {
      const optionElem = document.getElementById(id + "_option_" + i);
      const {
        x,
        width
      } = optionElem.getBoundingClientRect();
      const left = x - parentLeft;
      if (left < offset && left + width > offset) {
        return i;
      }
    }
    return null;
  };

  // handle state of everything
  const [state, dispatch, getState] = useEnhancedReducer((state, action) => ({
    ...state,
    mouse: mouseReducer(state.mouse, action)
  }), {
    mouse: {},
    selectedIndex,
    left: 0,
    prevLeft: 0
  });

  // drag handling
  useMouseHandler(id, {
    dispatch,
    getState
  }, {
    mouseMove: (state, dispatch, pixel) => {
      if (!state.mouse.isLeftDown) return;
      if (options.length < 2 && frozenOnOneOption) return;
      dispatch({
        left: state.prevLeft + subtract(pixel, state.mouse.downPixel).x
      });
      if (onMouseMove) {
        onMouseMove(pixel);
      }
    },
    leftDown: (state, dispatch, pixel) => {
      if (options.length < 2 && frozenOnOneOption) return;
      dispatch({
        prevLeft: state.left
      });
      if (onMouseDown) {
        onMouseDown(pixel);
      }
    },
    leftUp: (state, dispatch, pixel) => {
      let nextSelectedIndex = getOptionAtCenter(options, state.left);
      const indexAtPixel = getOptionAtOffset(options, pixel.x);
      if (clickToSelect && indexAtPixel != null && nextSelectedIndex == state.selectedIndex) {
        nextSelectedIndex = indexAtPixel;
      }
      // check for onClick:
      if (indexAtPixel != null && (indexAtPixel == state.selectedIndex && nextSelectedIndex == state.selectedIndex || clickToSelect) && options[nextSelectedIndex].onClick) {
        options[nextSelectedIndex].onClick();
      }
      if (options.length < 2 && frozenOnOneOption) return;
      dispatch({
        selectedIndex: nextSelectedIndex
      });
      if (onSelectIndex) {
        onSelectIndex(nextSelectedIndex, options[nextSelectedIndex]);
      }
    },
    mouseLeave: (state, dispatch) => {
      if (!state.mouse.isLeftDown) return;
      if (options.length < 2 && frozenOnOneOption) return;
      const selectedIndex = getOptionAtCenter(options, state.left);
      dispatch({
        type: 'SET_MOUSE_DOWN',
        isLeft: true,
        isDown: false
      });
      dispatch({
        selectedIndex
      });
      if (onSelectIndex) {
        onSelectIndex(selectedIndex, options[selectedIndex], true /* is cancel */);
      }
    }
  }, [options], 12 // throttle rate for mouse move
  );

  // listening for selected element changing from outside
  useEffect(() => {
    dispatch({
      selectedIndex
    });
  }, [selectedIndex]);

  // centering selected element
  useEffect(() => {
    const widthToSelectedElement = getWidthToOption(state.selectedIndex);
    dispatch({
      left: width / 2 - widthToSelectedElement
    });
  }, [state.selectedIndex, !state.mouse.isLeftDown, width]);
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      position: 'relative',
      width,
      height,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap,
      overflowX: 'hidden',
      position: 'absolute',
      left: state.left,
      transition: 'left ' + (state.mouse.isLeftDown ? '0s' : '0.25s'),
      top: 0,
      pointerEvents: 'none'
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement(PickerOption, _extends({
    key: id + "_option_" + o.label + "_" + i
  }, o, {
    width: width,
    height: height,
    color: o.color ?? defaultColor,
    style: {
      ...o.style,
      ...(i == state.selectedIndex ? selectedStyle : deselectedStyle),
      background: getOptionDistFromLeft(i, state.left) < getOptionWidth(i) ? `linear-gradient(to right, transparent 0%, ${o.color ?? defaultColor} ${300 - getOptionDistFromLeft(i, state.left) / getOptionWidth(i) * 300}%)` : getOptionDistFromRight(i, state.left) < getOptionWidth(i) ? `linear-gradient(to left, transparent 0%, ${o.color ?? defaultColor} ${300 - getOptionDistFromRight(i, state.left) / getOptionWidth(i) * 300}%)` : o.color ?? defaultColor // NO-OP
    },

    isSelected: i == state.selectedIndex,
    sizeMult: !state.mouse.isLeftDown ? i == state.selectedIndex ? maxSize : minSize : Math.max(maxSize - Math.abs(getOptionDistFromCenter(i, state.left)) / (width / 2), minSize),
    id: id + "_option_" + i
  })))));
};

/**
 * Props:
 *  - isSelected: boolean
 *  - onClick: () => void
 *  - style: style overrides for outermost component
 */
const PickerOption = props => {
  const {
    style,
    isSelected,
    onClick,
    label,
    width: parentWidth,
    height: parentHeight,
    isCircular,
    id,
    sizeMult,
    color: backgroundColor
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      backgroundColor,
      borderRadius: isCircular ? '50%' : 5,
      // transition: 'background 0.5s',

      height: sizeMult * parentHeight,
      width: isCircular ? sizeMult * parentHeight : 'auto',
      padding: isCircular ? 0 : '0 ' + parentHeight * 0.2,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      pointerEvents: 'none',
      userSelect: 'none',
      ...style
    }
    // onClick={onClick}
  }, label);
};
module.exports = SwipePicker;