const express = require('express');
const sdk = require('api')('@writesonic/v2.2#4enbxztlcbti48j');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

require("dotenv").config();

sdk.auth(process.env.API_KEY);
const app = express();
app.use(express.static('public'));
app.use(cors());

const serviceAccount = require('./onlinemd-d57e3-firebase-adminsdk-csry8-bcc0687bcc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://onlinemd-d57e3-default-rtdb.europe-west1.firebasedatabase.app'
});


app.post('/converse', express.text(), (req, res) => {
  console.log("Request headers: ", req.headers);
  const idToken = req.headers.authorization;

  if (!idToken) {
    // Respond with a 401 Unauthorized status code if the Firebase ID token is missing
    res.status(401).send('Unauthorized || ID Token is missing');
    return;
  }

  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      console.log(req.body);
      sdk.chatsonic_V2BusinessContentChatsonic_post({
        enable_google_results: 'true',
        enable_memory: false,
        input_text: req.body
      }, { engine: 'premium', language: 'de' })
        .then(({ data }) => res.send(data.message))
        .catch(err => console.error(err));
    });
});

app.listen(3003, () => {
  console.log('Sonic listening on port 3003!');
});