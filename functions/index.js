const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
// Firebase
const functions = require('firebase-functions');
// Handlers
const {
  helloworld,
  login,
  addMessage,
  getBeers,
  getOneBeer,
} = require('./handlers');

// Routes
app.get('/helloworld', helloworld);
app.get('/addMessage', addMessage);
app.post('/login', login);
app.get('/beers', getBeers);
app.get('/beer', getOneBeer);

exports.api = functions.region('europe-west1').https.onRequest(app);
