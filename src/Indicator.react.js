
const React = require('react');
const {useEffect, useRef} = React;


/**
 *
 * props:
 *   value: number, // will watch for changes in this value
 *   minChange: ?number, // changes smaller than this won't be registered
 */

const Indicator = (props) => {
  const prev = usePrevious(props.value);

  const minChange = props.minChange ? props.minChange : 0;
  let change = props.value - prev;
  let color = 'black';
  let symbol = '-';
  if (Math.abs(change) > minChange) {
    if (change > 0) {
      color = 'green';
      symbol = '/\\';
    } else {
      color = 'red';
      symbol = '\\/';
    }
  }


  return (
    <div
      style={{
        display: 'inline',
        color,
        fontFamily: 'Times',
        fontSize: 15,
      }}
    >
      <b>{symbol}</b>
    </div>
  );
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

module.exports = Indicator;
