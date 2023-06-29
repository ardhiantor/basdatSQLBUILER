import React, { useState } from 'react';
import axios from 'axios';

const UpdateQuery = () => {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setMessage('');
    setIsSuccess(false);
  };

  const handleExecuteQuery = async () => {
    try {
      const response = await axios.post('http://localhost:3001/execute', { query });
      if (response.data.success) {
        setMessage('Update query executed successfully.');
        setIsSuccess(true);
      } else {
        setMessage('Error executing update query.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error executing query:', error);
      setMessage('Error executing update query.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">UPDATE Query</h2>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input type="text" className="form-control" value={query} onChange={handleInputChange} placeholder="Enter your query" />
        </div>
        <div className="col-md-2 d-flex align-items-center">
          <button className="btn btn-primary" onClick={handleExecuteQuery}>Update Query</button>
        </div>
      </div>
      {message && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <p className={`text-center mb-0 text-${isSuccess ? 'success' : 'danger'}`}>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateQuery;









// import React, { useState } from 'react';
// import axios from 'axios';

// const UpdateQuery = () => {
//   const [query, setQuery] = useState('');

//   const handleInputChange = (event) => {
//     setQuery(event.target.value);
//   };

//   const handleExecuteQuery = async () => {
//     try {
//       await axios.post('/execute', { query });
//     } catch (error) {
//       console.error('Error executing query:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>UPDATE Query</h2>
//       <input type="text" value={query} onChange={handleInputChange} />
//       <button onClick={handleExecuteQuery}>Execute Query</button>
//     </div>
//   );
// };

// export default UpdateQuery;
