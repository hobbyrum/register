import React, { useState, useEffect } from 'react';
import Table from './Table';
import data from './data.json';

function App() {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

  };

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      val !== null && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn] || '';
    const bValue = b[sortColumn] || '';

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, filteredData.length);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          placeholder="Filtrera..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-700"
        />
        <button 
          onClick={toggleTheme} 
          className="p-2 border rounded bg-gray-300 dark:bg-gray-700">
          Växla tema
        </button>
      </div>
      <Table
        data={sortedData}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}  
      />
      <div className="mb-4 mt-2">
        <label htmlFor="rowsPerPage" className="mr-2">Rader per sida:</label>
        <select 
          id="rowsPerPage" 
          value={rowsPerPage} 
          onChange={handleRowsPerPageChange}
          className="p-2 border rounded bg-gray-200 dark:bg-gray-700"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <div className="mt-2">
          Visar {startRow} till {endRow} av {filteredData.length}
        </div>
        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded bg-gray-300 dark:bg-gray-700 mr-2"
          >
            Föregående
          </button>
          <span>Sida {currentPage} av {totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded bg-gray-300 dark:bg-gray-700 ml-2"
          >
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
