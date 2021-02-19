const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
// Firebase
const firebase = require('firebase/app');
require('firebase/auth');
const functions = require('firebase-functions');
const { admin, db } = require('./util/admin');
const config = require('./util/config');
firebase.initializeApp(config);

app.get('/helloworld', (req, res) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  res.send(firebase.apps.map((e) => e.name));
});

app.post('/login', (req, res) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(403)
        .json((general = 'Wrong credentials, please try again'));
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
