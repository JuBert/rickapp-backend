// Firebase
const { admin, db } = require('./util/admin');
const config = require('./util/config');
require('firebase/auth');
const functions = require('firebase-functions');
const firebase = require('firebase/app');
firebase.initializeApp(config);
// Axios
const axios = require('axios');

exports.helloworld = (req, res) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  res.send(firebase.apps.map((e) => e.name));
};

exports.login = (req, res) => {
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
};

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await db
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
};

exports.getBeers = (req, res) => {
  axios
    .get('https://api.punkapi.com/v2/beers?per_page=3')
    .then((response) => {
      let beers = [];
      response.data.map((beer) => {
        beers.push(beer);
      });
      res.status(200).json(beers);
    })
    .catch((err) => res.status(500).json({ error: err.code }));
};

exports.getOneBeer = (req, res) => {
  axios
    .get(`https://api.punkapi.com/v2/beers/${req.query.beer}`)
    .then((response) => {
      let beer = response.data;
      res.status(200).json(beer);
    })
    .catch((error) => res.status(500).json({ error: err.code }));
};
