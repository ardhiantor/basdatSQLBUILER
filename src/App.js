import React from 'react';
import QueryBuilder from './components/QueryBuilder';
import UpdateQuery from './components/UpdateQuery';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="container">
      <h1 className="text-center mb-4">Welcome to Good Reading Bookstore</h1>
      <QueryBuilder />
      <UpdateQuery />
    </div>
  );
};

export default App;
