const React = require('react');
const Button = require('./Button.react');
const Dropdown = require('./Dropdown.react');
const {
  useEffect,
  useMemo,
  useState
} = React;

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
  hideNumRows: boolean,
  style: Object containing additional styles for outer div
};
*/

const tableStyle = {
  backgroundColor: '#faf8ef',
  width: '100%',
  borderRadius: 8
};
function Table(props) {
  const {
    columns,
    rows,
    hideColSorts
  } = props;
  let colNames = [];
  if (props.columns) {
    colNames = Object.keys(columns);
  } else {
    // TODO: infer column names if not provided
  }

  // sort by column
  const [sortByColumn, setSortByColumn] = useState({
    by: 'ASC',
    name: null
  });
  useEffect(() => {
    if (!colNames.includes(sortByColumn.name)) {
      setSortByColumn({
        by: 'ASC',
        name: null
      });
    }
  }, [columns]);

  // filter by column
  const computeSelectedByColumn = colNames => {
    const selected = {};
    for (const col of colNames) {
      if (columns[col].filterable) {
        selected[col] = '*';
      }
    }
    return selected;
  };
  const [selectedByColumn, setSelectedByColumn] = useState(computeSelectedByColumn(colNames));
  useEffect(() => {
    const selected = {};
    for (const col of colNames) {
      if (columns[col].filterable) {
        selected[col] = selectedByColumn[col] || '*';
      }
    }
    setSelectedByColumn(selected);
  }, [columns]);
  const columnOptions = useMemo(() => {
    const filters = {};
    for (const col of colNames) {
      if (columns[col].filterable) {
        filters[col] = ['*'];
        for (const row of rows) {
          if (!filters[col].includes(row[col])) {
            filters[col].push(row[col]);
          }
        }
      }
    }
    return filters;
  }, [columns]);
  const headers = colNames.map(col => {
    let filterDropdown = null;
    if (columns[col].filterable) {
      filterDropdown = /*#__PURE__*/React.createElement(Dropdown, {
        options: columnOptions[col],
        selected: selectedByColumn[col] ? selectedByColumn[col].selected : '*',
        onChange: n => {
          setSelectedByColumn({
            ...selectedByColumn,
            [col]: n
          });
        }
      });
    }
    return /*#__PURE__*/React.createElement("th", {
      key: 'header_' + col
    }, columns[col].displayName || col, hideColSorts ? null : /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 'normal'
      }
    }, "Sort:", /*#__PURE__*/React.createElement(Button, {
      label: "/\\\\",
      fontSize: 12,
      onClick: () => {
        setSortByColumn({
          by: 'ASC',
          name: col
        });
      }
    }), /*#__PURE__*/React.createElement(Button, {
      label: "\\/",
      fontSize: 12,
      onClick: () => {
        setSortByColumn({
          by: 'DESC',
          name: col
        });
      }
    }), filterDropdown));
  });
  const filteredRows = useMemo(() => {
    const filtered = [];
    for (const row of rows) {
      let addRow = true;
      for (const col in selectedByColumn) {
        if (row[col] != selectedByColumn[col] && selectedByColumn[col] != '*') {
          addRow = false;
          break;
        }
      }
      if (addRow) {
        filtered.push(row);
      }
    }
    return filtered;
  }, [rows, selectedByColumn, columnOptions]);
  const sortedRows = useMemo(() => {
    if (sortByColumn.name == null) return filteredRows;
    if (columns[sortByColumn.name] == null) return filteredRows;
    let sorted = [];
    if (columns[sortByColumn.name].sortFn != null) {
      sorted = [...filteredRows].sort(columns[sortByColumn.name].sortFn);
    } else {
      sorted = [...filteredRows].sort((rowA, rowB) => {
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
  const rowHTML = sortedRows.map((row, i) => {
    const rowData = colNames.map(col => {
      const dataCell = columns[col].maxWidth ? ("" + row[col]).slice(0, columns[col].maxWidth) : row[col];
      return /*#__PURE__*/React.createElement("td", {
        key: 'cell_' + col + row[col]
      }, dataCell);
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: 'row_' + i
    }, rowData);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...tableStyle,
      ...props.style
    }
  }, props.hideNumRows ? null : /*#__PURE__*/React.createElement("span", null, "Total Rows: ", rows.length, " Rows Displayed: ", filteredRows.length), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, headers)), /*#__PURE__*/React.createElement("tbody", null, rowHTML)));
}
module.exports = Table;