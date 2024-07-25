// src/components/DataTable.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const DataTable = ({ csvFilePath }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    fetch(csvFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Parsed Data:", result.data);
            setData(result.data);
            if (result.data.length > 0) {
              setColumnFilters(
                Object.keys(result.data[0]).reduce((acc, key) => {
                  acc[key] = '';
                  return acc;
                }, {})
              );
            }
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, [csvFilePath]);

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(globalFilter.toLowerCase())
    ) &&
    Object.keys(columnFilters).every(key =>
      item[key].toString().toLowerCase().includes(columnFilters[key].toLowerCase())
    )
  );

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleColumnFilterChange = (key, value) => {
    setColumnFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Globalt filter"
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map(key => (
              <th key={key}>
                <div onClick={() => requestSort(key)}>{key}</div>
                <input
                  type="text"
                  placeholder=''
                  value={columnFilters[key]}
                  onChange={e => handleColumnFilterChange(key, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;