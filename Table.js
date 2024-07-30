import React from 'react';

function Table({ data, searchTerm, rowsPerPage, currentPage, onSort, sortColumn, sortOrder }) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const highlightText = (text, highlight) => {
    if (text === undefined || text === null) {
      console.warn('Encountered undefined or null text:', text);
      return ''; // If text is undefined or null, return empty string
    }
    
    // Ensure highlight is a string for the regular expression
    const highlightText = highlight || '';
    const parts = String(text).split(new RegExp(`(${highlightText})`, 'gi'));
    
    return parts.map((part, i) => {
      if (part === undefined || part === null) {
        console.warn('Encountered undefined or null part:', part);
        return ''; // Handle undefined or null parts
      };
      if (isValidUrl(text)) {
        return (
            <a href={text} key={i} target='_blank' rel="noopener noreferrer" className='text-blue-500 underline'>
                Link
            </a>
        )
      };
      return part.toLowerCase() === highlightText.toLowerCase()
        ? <span key={i} className="font-bold">{part}</span>
        : part;
    });
  }; // End of const highlightText


  return (
    <table className="min-w-full bg-white dark:bg-gray-900">
      <thead>
        <tr>
          {data.length > 0 && Object.keys(data[0]).map(key => (
            <th key={key}
                className="p-2 border-b cursor-pointer"
                onClick={() => onSort(key)}
                >
                {key}
                {sortColumn === key && (
                    <span className={`ml-2 ${sortOrder === 'asc' ? 'text-blue-500' : 'text-red-500'}`}>
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((row, rowIndex) => (
          <tr key={rowIndex} className="even:bg-gray-100 dark:even:bg-gray-800">
            {Object.values(row).map((val, colIndex) => (
              <td key={colIndex} className="p-2 border-b">
                {val === null ? '' : isValidUrl(val) ? (
                  <a href={val} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    Länk
                  </a>
                ) : highlightText(val, searchTerm)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ); // End of return
} // End of Table

export default Table;
