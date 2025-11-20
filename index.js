const express = require('express');
const pool = require('./db/config.js'); 
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const prisma = require("./prismaClient");

app.use(express.json()); 

const port = 3000;
app.use(require("cors")({
   origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.urlencoded({ extended: true }));
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ngdrstab_mst_user'); 
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/Getusers', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});