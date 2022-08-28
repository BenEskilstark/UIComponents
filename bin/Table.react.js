'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require('react');
var Button = require('./Button.react');
var Dropdown = require('./Dropdown.react');
var useEffect = React.useEffect,
    useMemo = React.useMemo,
    useState = React.useState;

/**
type ColumnName = string;
type Props = {
  columns: {[name: ColumnName]: {
    displayName: string,
    sortFn: ?() => number, // sorts alphanumerically if not provided
    maxWidth: number, // maximum number of characters allowed
    filterable: ?boolean, // if true, then have a dropdown with all unique
                          // options and filter rows by these
  }},
  rows: Array<{[name: ColumnName]: mixed}>,
  hideColSorts: boolean,
};
*/

var tableStyle = {
  backgroundColor: '#faf8ef',
  width: '100%',
  borderRadius: 8
};

function Table(props) {
  var columns = props.columns,
      rows = props.rows,
      hideColSorts = props.hideColSorts;

  var colNames = useMemo(function () {
    return Object.keys(columns);
  }, [columns]);

  var _useState = useState({ by: 'ASC', name: null }),
      _useState2 = _slicedToArray(_useState, 2),
      sortByColumn = _useState2[0],
      setSortByColumn = _useState2[1];

  var computeSelectedByColumn = function computeSelectedByColumn() {
    var selected = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = colNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var col = _step.value;

        if (columns[col].filterable) {
          selected[col] = '*';
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return selected;
  };

  var _useState3 = useState(computeSelectedByColumn),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedByColumn = _useState4[0],
      setSelectedByColumn = _useState4[1];

  useEffect(function () {
    var selected = computeSelectedByColumn();
    setSelectedByColumn(selected);
  }, [colNames.length]);

  var columnOptions = useMemo(function () {
    var filters = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = colNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var col = _step2.value;

        if (columns[col].filterable) {
          filters[col] = ['*'];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = rows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var row = _step3.value;

              if (!filters[col].includes(row[col])) {
                filters[col].push(row[col]);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return filters;
  }, [columns]);

  var headers = colNames.map(function (col) {
    var filterDropdown = null;
    if (columns[col].filterable) {
      filterDropdown = React.createElement(Dropdown, {
        options: columnOptions[col],
        selected: selectedByColumn[col].selected,
        onChange: function onChange(n) {
          setSelectedByColumn(_extends({}, selectedByColumn, _defineProperty({}, col, n)));
        }
      });
    }
    return React.createElement(
      'th',
      { key: 'header_' + col },
      columns[col].displayName,
      hideColSorts ? null : React.createElement(
        'div',
        { style: { fontWeight: 'normal' } },
        'Sort:',
        React.createElement(Button, {
          label: '/\\',
          fontSize: 12,
          onClick: function onClick() {
            setSortByColumn({ by: 'ASC', name: col });
          }
        }),
        React.createElement(Button, {
          label: '\\/',
          fontSize: 12,
          onClick: function onClick() {
            setSortByColumn({ by: 'DESC', name: col });
          }
        }),
        filterDropdown
      )
    );
  });

  var filteredRows = useMemo(function () {
    var filtered = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = rows[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var row = _step4.value;

        var addRow = true;
        for (var col in selectedByColumn) {
          if (row[col] != selectedByColumn[col] && selectedByColumn[col] != '*') {
            addRow = false;
            break;
          }
        }
        if (addRow) {
          filtered.push(row);
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return filtered;
  }, [rows, selectedByColumn, columnOptions]);

  var sortedRows = useMemo(function () {
    if (sortByColumn.name == null) return filteredRows;
    var sorted = [];
    if (columns[sortByColumn.name].sortFn != null) {
      sorted = [].concat(_toConsumableArray(filteredRows)).sort(columns[sortByColumn.name].sortFn);
    } else {
      sorted = [].concat(_toConsumableArray(filteredRows)).sort(function (rowA, rowB) {
        if (rowA[sortByColumn.name] < rowB[sortByColumn.name]) {
          return -1;
        }
        return 1;
      });
    }
    if (sortByColumn.by != 'ASC') {
      return sorted.reverse();
    }
    return sorted;
  }, [sortByColumn, filteredRows]);

  var rowHTML = sortedRows.map(function (row, i) {
    var rowData = colNames.map(function (col) {
      var dataCell = columns[col].maxWidth ? ("" + row[col]).slice(0, columns[col].maxWidth) : row[col];
      return React.createElement(
        'td',
        { key: 'cell_' + col + row[col] },
        dataCell
      );
    });
    return React.createElement(
      'tr',
      { key: 'row_' + i },
      rowData
    );
  });

  return React.createElement(
    'table',
    { style: tableStyle },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        headers
      )
    ),
    React.createElement(
      'tbody',
      null,
      rowHTML
    )
  );
}

module.exports = Table;