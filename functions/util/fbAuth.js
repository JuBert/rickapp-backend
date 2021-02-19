const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer '[1]);
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const user = decodedToken;
      return db
        .collection('users')
        .where('userId', '==', user.uid)
        .limit(1)
        .get();
    })
    .catch((error) => {
      console.error('Error while verifying token', err);
      return res.status(403).json(err);
    });
};
