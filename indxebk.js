const express = require('express');
const pool = require('./db/config.js'); 

const bcrypt = require('bcrypt');
const app = express();
app.use(express.json()); 

const port = 3000;
app.use(require("cors")({
   origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  console.log('Request body:', req.body); 

  const { email, password, fullname,username } = req.body;
  if (!email || !password || !fullname || !username)  {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(fullname,email, password,username) VALUES ($1, $2, $3,$4) RETURNING *',
      [fullname, email, hashedPassword,username]
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
   
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

     res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); 
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});