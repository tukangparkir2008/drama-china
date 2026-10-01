const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse query and body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API Base URL
const API_BASE_URL = 'https://dramabos.live';

// Available providers
const providers = [
  { slug: 'shortmax', name: 'ShortMax' },
  { slug: 'starshort', name: 'StarShort' },
  { slug: 'dramabox', name: 'DramaBox' },
  { slug: 'flickreels', name: 'FlickReels' },
  { slug: 'dramabite', name: 'DramaBite' }
];

// Global middleware to handle provider selection
app.use((req, res, next) => {
  // Check if provider is set in query
  let selectedProvider = req.query.provider || 'shortmax'; // default provider

  // Expose to views
  res.locals.providers = providers;
  res.locals.selectedProvider = selectedProvider;
  res.locals.API_BASE_URL = API_BASE_URL;

  next();
});

// Import Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
