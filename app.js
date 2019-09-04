'use strict';

const express = require('express');
const twig = require('twig');

const app = express();

/**
 * Expose the /public folder of our app so we can reference the JS and CSS files in that folder on our page
 */
app.use(express.static('public'));

/**
 * Homepage route to our chat app
 */
app.get('/', (req, res) => {
  res.render('index.twig');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;