const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
const pool = new Pool({
  user: 'postgres',
  host: '20.163.133.90',
  database: 'goodreadingbookstore_database',
  password: '1n1P4ssword4rdh1',
  port: 5432,
});

app.use(express.json());

app.post('/execute', async (req, res) => {
  const { query } = req.body;
  console.log('Received query:', query);
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Error executing query' });
  }
});


app.listen(3001, () => {
  console.log('API server running on port 3001');
});
