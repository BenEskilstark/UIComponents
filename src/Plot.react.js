/**
 * See ~/Code/teaching/clusters for an example of how to use the plot
 * Specifically ui/Main and reducers/plotReducer
 */

const React = require('react');
const Button = require('./Button.react');
const Canvas = require('./Canvas.react');
const {useState, useMemo, useEffect, useReducer} = React;


// type Point = {
//   x: number,
//   y: number,
//   color: ?string, // css color
// };
//
// type Axis = {
//   dimension: 'x' | 'y',
//   label: string,
//   min: ?number,
//   max: ?number,
//   adaptiveRange: ?boolean, // min/max adapt to the given points
//   hidden: ?boolean, // don't render the axis
//   majorTicks: ?number,
//   minorTicks: ?number,
// };

/**
 * NOTE: 0, 0 is the bottom left corner
 *
 * props:
 *   points: Array<Point>,
 *   xAxis: Axis,
 *   yAxis: Axis,
 *   isLinear: boolean,
 *   watch: ?number, // if provided, will watch for changes in this value
 *                   // and add a point to the plot whenever it changes
 *                   // up to a maximum number of points equal to the xAxis size
 *   inline: ?boolean,
 *
 * canvas props:
 *   useFullScreen: boolean,
 *   width: number,
 *   height: number,
 */

const Plot = (props) => {

  // screen resizing
  const [resizeCount, setResize] = useState(0);
  useEffect(() => {
    function handleResize() {
      setResize(resizeCount + 1);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [resizeCount]);

  // track points with watching
  const [allPoints, setAllPoints] = useState(props.points);
  useEffect(() => {
    if (props.watch == null) {
      setAllPoints(props.points);
      return;
    }
    const watchedPoint = {x: allPoints.length, y: props.watch}
    if (allPoints.length < props.xAxis.max) {
      setAllPoints([...allPoints, watchedPoint]);
    } else {
      const [_, ...next] = allPoints;
      setAllPoints([...next, watchedPoint]);
    }
  }, [props.watch, setAllPoints, allPoints, props.xAxis, props.points]);


  // rendering
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const {xAxis, yAxis, isLinear} = props;
    const {width, height} = canvas.getBoundingClientRect();

    let xmax = xAxis.max == null ? 10 : xAxis.max;
    let xmin = xAxis.min == null ? 0 : xAxis.min;
    let ymax = yAxis.max == null ? 10 : yAxis.max;
    let ymin = yAxis.min == null ? 0 : yAxis.min;

    // handling adaptive ranges
    if (xAxis.adaptiveRange) {
      for (const point of allPoints) {
        if (point.x < minVal) {
          xmin = point.x;
        }
        if (point.x > maxVal) {
          xmax = point.x;
        }
      }
    }
    if (yAxis.adaptiveRange) {
      for (const point of allPoints) {
        if (point.y < minVal) {
          ymin = point.y;
        }
        if (point.y > maxVal) {
          ymax = point.y;
        }
      }
    }

    // scaling allPoints to canvas
    const xTrans = width / (xmax - xmin);
    const yTrans = height / (ymax - ymin);
    const transX = (x) => x * xTrans - xmin * xTrans;
    const transY = (y) => y * yTrans - ymin * yTrans;

    // clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // drawing axes
    if (!xAxis.hidden) {
      ctx.fillStyle = 'black';
      const xMajor = xAxis.majorTicks || 10;
      for (let x = xmin; x < xmax; x += xMajor) {
        drawLine(ctx, {x: transX(x), y: height}, {x: transX(x), y: height - 20});
      }
      const xMinor = xAxis.minorTicks || 2;
      for (let x = xmin; x < xmax; x += xMinor) {
        drawLine(ctx, {x: transX(x), y: height}, {x: transX(x), y: height - 10});
      }
    }
    if (!yAxis.hidden) {
      const yMajor = yAxis.majorTicks || 10;
      for (let y = ymin; y < ymax; y += yMajor) {
        drawLine(ctx, {x: 0, y: transY(y)}, {x: 20, y: transY(y)});
      }
      const yMinor = yAxis.minorTicks || 2;
      for (let y = ymin; y < ymax; y += yMinor) {
        drawLine(ctx, {x: 0, y: transY(y)}, {x: 10, y: transY(y)});
      }
    }

    // drawing allPoints
    const sortedPoints = [...allPoints].sort((a, b) => a.x - b.x);
    let prevPoint = null;
    for (const point of sortedPoints) {
      ctx.fillStyle = point.color ? point.color : 'black';
      const x = transX(point.x);
      const y = ymax * yTrans - ymin * yTrans - point.y * yTrans;
      const size = 2;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);

      if (isLinear && prevPoint != null) {
        ctx.fillStyle = 'black';
        drawLine(ctx, prevPoint, {x, y});
      }
      prevPoint = {x, y};
    }

  }, [props, resizeCount, allPoints]);

  // axis labels
  let xAxisLabel = null;
  let yAxisLabel = null;
  if (props.xAxis.label != null) {
    xAxisLabel = (
      <div style={{
        textAlign: 'center',
      }}>
        {props.xAxis.label}
      </div>
    );
  }
  if (props.yAxis.label != null) {
    yAxisLabel = (
      <div style={{
        display: 'table-cell',
        verticalAlign: 'middle',
      }}>
        {props.yAxis.label}
      </div>
    );
  }

  return (
    <div
      style={{
        width: 'fit-content',
        display: props.inline ? 'inline' : 'table',
      }}
    >
      {yAxisLabel}
      <div style={{display: 'inline-block'}}>
        <Canvas
          useFullScreen={props.useFullScreen}
          width={props.width}
          height={props.height}
        />
      </div>
      {xAxisLabel}
    </div>
  )
}

const drawLine = (ctx, p1, p2) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
};

module.exports = Plot;
