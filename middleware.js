const express = require('express');
const cors = require('cors');

function applyMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  }));
}

module.exports = applyMiddleware;