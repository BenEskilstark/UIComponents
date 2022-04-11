// @flow

/**
 * See ~/Code/teaching/clusters for an example of how to use the plot
 */

const React = require('react');
const {Button, Canvas} = require('bens_ui_components');
const {useState, useMemo, useEffect, useReducer} = React;

import type {State, Action} from '../types';

type Point = {
  x: number,
  y: number,
  color: ?string, // css color
};

type Axis = {
  dimension: 'x' | 'y',
  label: string,
  min: ?number,
  max: ?number,
  majorTicks: ?number,
  minorTicks: ?number,
};

/**
 * NOTE: 0, 0 is the bottom left corner
 *
 * props:
 *   points: Array<Point>,
 *   xAxis: Axis,
 *   yAxis: Axis,
 *   isLinear: boolean,
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

  // rendering
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const {points, xAxis, yAxis, isLinear} = props;
    const {width, height} = canvas.getBoundingClientRect();

    // scaling points to canvas
    const xTrans = width / (xAxis.max - xAxis.min);
    const yTrans = height / (yAxis.max - yAxis.min);
    const transX = (x) => x * xTrans - xAxis.min * xTrans;
    const transY = (y) => y * yTrans - yAxis.min * yTrans;

    // clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // drawing axes
    ctx.fillStyle = 'black';
    const xMajor = xAxis.majorTicks || 10;
    for (let x = xAxis.min; x < xAxis.max; x += xMajor) {
      drawLine(ctx, {x: transX(x), y: height}, {x: transX(x), y: height - 20});
    }
    const xMinor = xAxis.minorTicks || 2;
    for (let x = xAxis.min; x < xAxis.max; x += xMinor) {
      drawLine(ctx, {x: transX(x), y: height}, {x: transX(x), y: height - 10});
    }
    const yMajor = yAxis.majorTicks || 10;
    for (let y = yAxis.min; y < yAxis.max; y += yMajor) {
      drawLine(ctx, {x: 0, y: transY(y)}, {x: 20, y: transY(y)});
    }
    const yMinor = yAxis.minorTicks || 2;
    for (let y = yAxis.min; y < yAxis.max; y += yMinor) {
      drawLine(ctx, {x: 0, y: transY(y)}, {x: 10, y: transY(y)});
    }

    // drawing points
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    let prevPoint = null;
    for (const point of sortedPoints) {
      ctx.fillStyle = point.color ? point.color : 'black';
      const x = transX(point.x);
      const y = yAxis.max * yTrans - yAxis.min * yTrans - point.y * yTrans;
      const size = 2;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);

      if (isLinear && prevPoint != null) {
        ctx.fillStyle = 'black';
        drawLine(ctx, prevPoint, {x, y});
      }
      prevPoint = {x, y};
    }

  }, [props, resizeCount]);

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
        display: 'table',
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
