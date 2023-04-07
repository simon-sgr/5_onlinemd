const express = require('express');
const marked = require('marked');
const bodyParser = require('body-parser');
const cors = require('cors');

const admin = require("firebase-admin");

const serviceAccount = require("./onlinemd-d57e3-firebase-adminsdk-csry8-bcc0687bcc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onlinemd-d57e3-default-rtdb.europe-west1.firebasedatabase.app"
});

const app = express();

app.use(express.static('public'));
app.use(cors());

app.post('/markdown', express.text(), (req, res) => {

  console.log("Request headers: ", req.headers);
  const idToken = req.headers.authorization;

  if (!idToken) {
    // Respond with a 401 Unauthorized status code if the Firebase ID token is missing
    res.status(401).send('Unauthorized || ID Token is missing');
    return;
  }

  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const markdown = req.body;
      const html = marked.parse(markdown);
      res.send(html);
    });
});

app.listen(3002, () => {
  console.log('Server listening on http://localhost:3002')
});