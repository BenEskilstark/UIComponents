
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
// };


const plotReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AXIS':
      const {axis} = action;
      const whichAxis = axis.dimension == 'x' ? 'xAxis' : 'yAxis';
      return {
        ...state,
        [whichAxis]: {label: axis.dimension, min: 0, max: 100, ...axis},
      };
    case 'SET_POINTS':
      const {points} = action;
      return {
        ...state,
        points,
      };
    case 'ADD_POINTS': {
      const {points} = action;
      return {
        ...state,
        points: state.points ? [...state.points, ...points] : points,
      };
    }
    case 'ADD_POINT_CIRCULAR': {
      const {point} = action;
      if (point.x < state.xAxis.max) {
        return {
          ...state,
          points: state.points ? [...state.points, point] : points,
        };
      } else {
        const [_, ...next] = state.points;
        return {
          ...state,
          points: state.points ? [...next, point] : points,
        };
      }
    }
    case 'CLEAR_POINTS': {
      return {
        ...state,
        points: [],
      };
    }
    case 'PRINT_POINTS': {
      for (const point of state.points) {
        console.log(point.x + "," + point.y);
      }
      return state;
    }
  }
}

module.exports = {plotReducer};
