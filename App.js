// data.csv finns i /public/data.csv

import React from 'react';
import DataTable from "./components/DataTable";

const App = () => {
    return (
      <div className="App">
        <h1>Register över FUP och domar</h1>
        <DataTable csvFilePath="/data.csv" />
      </div>
    );
  };
  
  export default App;
  