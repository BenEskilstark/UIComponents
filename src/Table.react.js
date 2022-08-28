const React = require('react');
const Button = require('./Button.react');
const Dropdown = require('./Dropdown.react');
const {useEffect, useMemo, useState} = React;

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
};
*/

const tableStyle = {
  backgroundColor: '#faf8ef',
  width: '100%',
  borderRadius: 8,
};

function Table(props) {
  const {columns, rows, hideColSorts} = props;
  const colNames = Object.keys(columns);

  // sort by column
  const [sortByColumn, setSortByColumn] = useState({by: 'ASC', name: null});
  useEffect(() => {
    setSortByColumn({by: 'ASC', name: null});
  }, [columns]);

  // filter by column
  const computeSelectedByColumn = (colNames) => {
    const selected = {};
    for (const col of colNames) {
      if (columns[col].filterable) {
        selected[col] = '*';
      }
    }
    return selected;
  }
  const [selectedByColumn, setSelectedByColumn] = useState(computeSelectedByColumn(colNames));
  useEffect(() => {
    const selected = computeSelectedByColumn(colNames);
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
      filterDropdown = (
        <Dropdown
          options={columnOptions[col]}
          selected={selectedByColumn[col] ? selectedByColumn[col].selected : '*'}
          onChange={(n) => {
            setSelectedByColumn({...selectedByColumn, [col]: n});
          }}
        />
      );
    }
    return (
      <th key={'header_' + col}>
        {columns[col].displayName || col}
        {hideColSorts ? null : (
          <div style={{fontWeight: 'normal'}}>
            Sort:
            <Button
              label="/\"
              fontSize={12}
              onClick={() => {
                setSortByColumn({by: 'ASC', name: col});
              }}
            />
            <Button
              label="\/"
              fontSize={12}
              onClick={() => {
                setSortByColumn({by: 'DESC', name: col});
              }}
            />
            {filterDropdown}
          </div>
        )}
      </th>
    )
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
      const dataCell = columns[col].maxWidth
        ? ("" + row[col]).slice(0, columns[col].maxWidth)
        : row[col];
      return (
        <td key={'cell_'+col+row[col]}>{dataCell}</td>
      );
    });
    return <tr key={'row_'+i}>{rowData}</tr>;
  });

  return (
    <div>
      {props.hideNumRows ? null :
        (<span>Total Rows: {rows.length} Rows Displayed: {filteredRows.length}</span>)
      }
      <table style={tableStyle}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {rowHTML}
        </tbody>
      </table>
    </div>
  );
}

module.exports = Table;
