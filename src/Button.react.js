const React = require('react');
const {useState, useEffect} = React;

// props:
// id: ?string
// label: string
// onClick: () => void
// onMouseDown: optional () => void
// onMouseUp: optional () => void
// disabled: optional boolean
// style: optional Object
// hoverCard: optional JSX

function Button(props) {
  const id = props.id || props.label;

  const touchFn = () => {
    if (props.onMouseDown != null) {
      props.onMouseDown();
    } else {
      props.onClick();
    }
  }
  const [intervalID, setIntervalID] = useState(null);
  const [hover, setHover] = useState(false);
  let hoverDisplay = null;
  if (hover) {
    hoverDisplay = (
      <div
        style={{
          position: 'relative',
        }}
      >
        {props.hoverCard}
      </div>
    );
  }

  const [touched, setTouched] = useState(false);

  return (
    <button type="button"
      style={{
        touchAction: 'initial',
        fontSize: '18px',
        ...props.style,
      }}
      key={id || label}
      className={props.disabled ? 'buttonDisable' : ''}
      id={id.toUpperCase() + '_button'}
      onClick={() => {
        if (props.disabled) {
          return;
        }
        if (touched) {
          setTouched(false);
          return;
        }
        props.onClick();
      }}
      onTouchStart={(ev) => {
        if (props.disabled) {
          return;
        }
        if (intervalID) {
          console.log("already in interval, clearing");
          clearInterval(intervalID);
          setIntervalID(null);
        }
        touchFn();
        setTouched(true);
        // HACK: if you set the right condition, allow repetive presses
        // if (false) {
        //   const interval = setInterval(touchFn, 120);
        //   setIntervalID(interval);
        // }
      }}
      onTouchEnd={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      }}
      onTouchCancel={(ev) => {
        clearInterval(intervalID);
        setIntervalID(null);
        props.onMouseUp;
      }}
      onTouchMove={(ev) => {
        ev.preventDefault();
      }}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={() => {
        if (props.hoverCard) setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      disabled={props.disabled}
    >
      {props.label}
      {hoverDisplay}
    </button>
  );
}

module.exports = Button;
