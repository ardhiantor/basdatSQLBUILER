import React, { useState } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';

const QueryBuilder = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [syntax, setSyntax] = useState('SELECT');
  const [columns, setColumns] = useState(['']);
  const [tables, setTables] = useState(['']);
  const [whereClause, setWhereClause] = useState('');
  const [joins, setJoins] = useState([]);
  const [joinType, setJoinType] = useState('INNER');
  const [joinTable, setJoinTable] = useState('');
  const [joinColumn, setJoinColumn] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSyntaxChange = (event) => {
    setSyntax(event.target.value);
  };

  const handleColumnChange = (index, event) => {
    const newColumns = [...columns];
    newColumns[index] = event.target.value;
    setColumns(newColumns);
  };

  const handleTableChange = (index, event) => {
    const newTables = [...tables];
    newTables[index] = event.target.value;
    setTables(newTables);
  };

  const handleWhereChange = (event) => {
    setWhereClause(event.target.value);
  };

  const handleJoinTableChange = (index, event) => {
    const newJoins = [...joins];
    newJoins[index].table = event.target.value;
    newJoins[index].column = 'publisher_id'; // Update the column value to 'publisher_id'
    setJoins(newJoins);
  };

  const handleJoinColumnChange = (index, event) => {
    const newJoins = [...joins];
    newJoins[index].column = event.target.value;
    setJoins(newJoins);
  };

  const handleAddColumn = () => {
    setColumns([...columns, '']);
  };

  const handleDeleteColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleAddTable = () => {
    setTables([...tables, '']);
  };

  const handleDeleteTable = (index) => {
    const newTables = [...tables];
    newTables.splice(index, 1);
    setTables(newTables);
  };

  const handleAddJoin = () => {
    setJoins([...joins, { table: '', column: '' }]);
  };

  const handleDeleteJoin = (index) => {
    const newJoins = [...joins];
    newJoins.splice(index, 1);
    setJoins(newJoins);
  };

  const handleJoinTypeChange = (event) => {
    setJoinType(event.target.value);
  };

  const handleGenerateQuery = async () => {
    try {
      let generatedQuery = '';

      if (query) {
        generatedQuery = query;
      } else {
        generatedQuery += `${syntax} `;

        if (syntax === 'SELECT') {
          generatedQuery += `${columns.join(', ')} FROM ${tables[0]}`;

          for (let i = 1; i < tables.length; i++) {
            generatedQuery += ` ${joinType} JOIN ${tables[i]} ON ${tables[0]}.${joinColumn} = ${tables[i]}.${joinColumn}`;
          }
        }

        if (joins.length > 0) {
          joins.forEach((join) => {
            generatedQuery += ` ${joinType} JOIN ${join.table} ON ${tables[0]}.${joinColumn} = ${join.table}.${join.column}`;
          });
        }

        if (whereClause) {
          generatedQuery += ` WHERE ${whereClause}`;
        }
      }

      const response = await axios.post('http://localhost:3001/execute', { query: generatedQuery });
      setResult(response.data);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  const renderTable = () => {
    if (result.length === 0) {
      return null;
    }

    const tableColumns = Object.keys(result[0]).map((key) => ({
      dataField: key,
      text: key,
    }));

    return <BootstrapTable keyField="id" data={result} columns={tableColumns} />;
  };

  const renderColumnsInputs = () => {
    return columns.map((column, index) => (
      <div key={`column-${index}`} className="mb-2">
        <label>Column Name {index + 1}</label>
        <input
          type="text"
          className="form-control"
          value={column}
          onChange={(event) => handleColumnChange(index, event)}
        />
        {index > 0 && (
          <button className="btn btn-danger mt-2" onClick={() => handleDeleteColumn(index)}>
            Delete Column
          </button>
        )}
      </div>
    ));
  };

  const renderTablesInputs = () => {
    return tables.map((table, index) => (
      <div key={`table-${index}`} className="mb-2">
        <label>Table Name {index + 1}</label>
        <input
          type="text"
          className="form-control"
          value={table}
          onChange={(event) => handleTableChange(index, event)}
        />
        {index > 0 && (
          <button className="btn btn-danger mt-2" onClick={() => handleDeleteTable(index)}>
            Delete Table
          </button>
        )}
      </div>
    ));
  };

  const renderJoinsInputs = () => {
    return joins.map((join, index) => (
      <div key={`join-${index}`} className="mb-2">
        <label>Join Table {index + 1}</label>
        <input
          type="text"
          className="form-control"
          value={join.table}
          onChange={(event) => handleJoinTableChange(index, event)}
          placeholder="Enter the table to join"
        />
        <label>Join Column {index + 1}</label>
        <input
          type="text"
          className="form-control"
          value={join.column}
          onChange={(event) => handleJoinColumnChange(index, event)}
          placeholder="Enter the column to join"
        />
        {index > 0 && (
          <button className="btn btn-danger mt-2" onClick={() => handleDeleteJoin(index)}>
            Delete Join
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">SQL Builder</h2>
      <div className="row mb-4">
        <div className="col-md-3">
          <label>Syntax</label>
          <select className="form-control" value={syntax} onChange={handleSyntaxChange}>
            <option value="SELECT">SELECT</option>
          </select>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          {renderColumnsInputs()}
          <button className="btn btn-primary" onClick={handleAddColumn}>
            Add Column
          </button>
        </div>
        <div className="col-md-6">
          {renderTablesInputs()}
          <button className="btn btn-primary" onClick={handleAddTable}>
            Add Table
          </button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Join Type</label>
          <select className="form-control" value={joinType} onChange={handleJoinTypeChange}>
            <option value="INNER">INNER JOIN</option>
            <option value="LEFT">LEFT JOIN</option>
            <option value="RIGHT">RIGHT JOIN</option>
          </select>
        </div>
        <div className="col-md-6">
          {renderJoinsInputs()}
          <button className="btn btn-primary" onClick={handleAddJoin}>
            Add Join
          </button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Where Clause</label>
          <input
            type="text"
            className="form-control"
            value={whereClause}
            onChange={handleWhereChange}
            placeholder="Enter WHERE clause"
          />
        </div>
      </div>
      <div className="row mb-4 justify-content-center"> {/* Center alignment */}
        <div className="col-md-6">
          <label>Custom Query</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter your SQL query"
            />
            <button className="btn btn-primary ml-2" onClick={handleGenerateQuery}> {/* Move button to the left */}
              Generate Query
            </button>
          </div>
        </div>
      </div>
      <div>{renderTable()}</div>
    </div>
  );
};

export default QueryBuilder;









// import React, { useState } from 'react';
// import axios from 'axios';
// import BootstrapTable from 'react-bootstrap-table-next';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const QueryBuilder = () => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState([]);
//   const [syntax, setSyntax] = useState('SELECT');
//   const [columns, setColumns] = useState(['']);
//   const [tables, setTables] = useState(['']);
//   const [whereClause, setWhereClause] = useState('');

//   const handleInputChange = (event) => {
//     setQuery(event.target.value);
//   };

//   const handleSyntaxChange = (event) => {
//     setSyntax(event.target.value);
//   };

//   const handleColumnChange = (index, event) => {
//     const newColumns = [...columns];
//     newColumns[index] = event.target.value;
//     setColumns(newColumns);
//   };

//   const handleTableChange = (index, event) => {
//     const newTables = [...tables];
//     newTables[index] = event.target.value;
//     setTables(newTables);
//   };

//   const handleWhereChange = (event) => {
//     setWhereClause(event.target.value);
//   };

//   const handleAddColumn = () => {
//     setColumns([...columns, '']);
//   };

//   const handleDeleteColumn = (index) => {
//     const newColumns = [...columns];
//     newColumns.splice(index, 1);
//     setColumns(newColumns);
//   };

//   const handleAddTable = () => {
//     setTables([...tables, '']);
//   };

//   const handleDeleteTable = (index) => {
//     const newTables = [...tables];
//     newTables.splice(index, 1);
//     setTables(newTables);
//   };

//   const handleGenerateQuery = async () => {
//     try {
//       let generatedQuery = `${syntax} `;

//       if (syntax === 'SELECT') {
//         generatedQuery += `${columns.join(', ')} FROM ${tables[0]}`;

//         for (let i = 1; i < tables.length; i++) {
//           generatedQuery += ` JOIN ${tables[i]}`;
//         }
//       }

//       if (whereClause) {
//         generatedQuery += ` WHERE ${whereClause}`;
//       }

//       const response = await axios.post('http://localhost:3001/execute', { query: generatedQuery });
//       setResult(response.data);
//     } catch (error) {
//       console.error('Error executing query:', error);
//     }
//   };

//   const renderTable = () => {
//     if (result.length === 0) {
//       return null;
//     }

//     const tableColumns = Object.keys(result[0]).map((key) => ({
//       dataField: key,
//       text: key,
//     }));

//     return <BootstrapTable keyField="id" data={result} columns={tableColumns} />;
//   };

//   const renderColumnsInputs = () => {
//     return columns.map((column, index) => (
//       <div key={`column-${index}`} className="mb-2">
//         <label>Column Name {index + 1}</label>
//         <input
//           type="text"
//           className="form-control"
//           value={column}
//           onChange={(event) => handleColumnChange(index, event)}
//         />
//         {index > 0 && (
//           <button className="btn btn-danger mt-2" onClick={() => handleDeleteColumn(index)}>
//             Delete Column
//           </button>
//         )}
//       </div>
//     ));
//   };

//   const renderTablesInputs = () => {
//     return tables.map((table, index) => (
//       <div key={`table-${index}`} className="mb-2">
//         <label>Table Name {index + 1}</label>
//         <input
//           type="text"
//           className="form-control"
//           value={table}
//           onChange={(event) => handleTableChange(index, event)}
//         />
//         {index > 0 && (
//           <button className="btn btn-danger mt-2" onClick={() => handleDeleteTable(index)}>
//             Delete Table
//           </button>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="container">
//       <h2 className="text-center mb-4">SQL Builder</h2>
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <label>Syntax</label>
//           <select className="form-control" value={syntax} onChange={handleSyntaxChange}>
//             <option value="SELECT">SELECT</option>
//           </select>
//         </div>
//       </div>
//       <div className="row mb-4">
//         <div className="col-md-6">
//           {renderColumnsInputs()}
//           <button className="btn btn-primary" onClick={handleAddColumn}>
//             Add Column
//           </button>
//         </div>
//         <div className="col-md-6">
//           {renderTablesInputs()}
//           <button className="btn btn-primary" onClick={handleAddTable}>
//             Add Table
//           </button>
//         </div>
//       </div>
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <label>Where Clause</label>
//           <input
//             type="text"
//             className="form-control"
//             value={whereClause}
//             onChange={handleWhereChange}
//             placeholder="Enter WHERE clause"
//           />
//         </div>
//       </div>
//       <div className="row mb-4">
//         <div className="col-md-2">
//           <button className="btn btn-primary" onClick={handleGenerateQuery}>
//             Generate Query
//           </button>
//         </div>
//       </div>
//       <div>{renderTable()}</div>
//     </div>
//   );
// };

// export default QueryBuilder;


// import React, { useState } from 'react';
// import axios from 'axios';

// const QueryBuilder = () => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState([]);

//   const handleInputChange = (event) => {
//     setQuery(event.target.value);
//   };

//   const handleGenerateQuery = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/execute', { query: query });
//       setResult(response.data);
//     } catch (error) {
//       console.error('Error executing query:', error);
//     }
//   };  

//   const renderTable = () => {
//     if (result.length === 0) {
//       return null;
//     }

//     const headers = Object.keys(result[0]);

//     return (
//       <table>
//         <thead>
//           <tr>
//             {headers.map((header) => (
//               <th key={header}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {result.map((row, index) => (
//             <tr key={index}>
//               {headers.map((header) => (
//                 <td key={header}>{row[header]}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div>
//       <h2>SQL Builder</h2>
//       <input type="text" value={query} onChange={handleInputChange} />
//       <button onClick={handleGenerateQuery}>Generate Query</button>
//       <div>{renderTable()}</div>
//     </div>
//   );
// };

// export default QueryBuilder;


// import React, { useState } from 'react';
// import axios from 'axios';

// const QueryBuilder = () => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState('');

//   const handleInputChange = (event) => {
//     setQuery(event.target.value);
//   };

//   const handleGenerateQuery = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/execute', { query: query });
//       setResult(JSON.stringify(response.data));
//     } catch (error) {
//       console.error('Error executing query:', error);
//     }
//   };  

//   return (
//     <div>
//       <h2>SQL Builder</h2>
//       <input type="text" value={query} onChange={handleInputChange} />
//       <button onClick={handleGenerateQuery}>Generate Query</button>
//       <p>Result: {result}</p>
//     </div>
//   );
// };

// export default QueryBuilder;
