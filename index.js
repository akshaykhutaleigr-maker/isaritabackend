const express = require('express');
const app = express();
require('dotenv').config();
const applyMiddleware = require('./middleware');
applyMiddleware(app);

const registerRoutes = require('./api/register');
const checkRoutes = require('./api/check');
const locationRoutes = require('./api/location');
const generate = require('./api/generate-pdf');
const login =require('./api/login');
app.use('/', registerRoutes);
app.use('/', checkRoutes);
app.use('/', locationRoutes);
app.use('/', generate);
app.use('/', login);

const port = 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
