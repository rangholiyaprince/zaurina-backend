require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');
const apiRoutes = require('./routes');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[GLOBAL] Received ${req.method} request for ${req.url}`);
  next();
});

const passport = require('./config/passport');
app.use(passport.initialize());

// API Routes - All routes are now centralized in routes/index.js
app.use('/api', apiRoutes);

// Error Middleware
app.use(errorHandler);

module.exports = app;
