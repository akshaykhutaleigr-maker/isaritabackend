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

function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}
app.post('/register', async (req, res) => {
  try {
    const newUser = await prisma.citizenRegistration.create({
      data: {
       
        contact_fname: req.body.contact_fname,
        contact_lname: req.body.contact_lname,
        email_id: req.body.email_id,
        user_name: req.body.user_name,
        user_pass: req.body.user_pass
      }
    });

  res.json(serializeBigInt(newUser));

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Server error");
  }
});

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
    const users = await prisma.citizenRegistration.findMany();
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