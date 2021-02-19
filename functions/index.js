const express = require('express');
const cors = require('cors');
const app = express();

// Firebase
const functions = require('firebase-functions');
const { admin, db } = require('./admin');
const config = require('./config');
const firebase = require('firebase/app');
firebase.initializeApp(config);

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/helloworld', (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello World!');
});

app.post('/login', (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.email,
  };
  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      return res.status(200).json('Login succesful');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.status(404).json(errorCode, errorMessage);
    });
});

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
app.get('/addMessage', async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await db
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
