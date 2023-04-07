const express = require("express");
const openAI = require("openai");
const cors = require('cors');

const admin = require("firebase-admin");

const serviceAccount = require("./onlinemd-d57e3-firebase-adminsdk-csry8-bcc0687bcc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onlinemd-d57e3-default-rtdb.europe-west1.firebasedatabase.app"
});

// Importing the dotenv module to access environment variables
require("dotenv").config();

// Importing the body-parser module to parse incoming request bodies
const bp = require("body-parser");

// Creating a new Express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Using body-parser middleware to parse incoming request bodies as JSON
app.use(bp.json());

// Using body-parser middleware to parse incoming request bodies as URL encoded data
app.use(bp.urlencoded({ extended: true }));

// Importing and setting up the OpenAI API client
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Defining a conversation context prompt
const conversationContextPrompt =
  "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Defining an endpoint to handle incoming requests
app.post("/converse", (req, res) => {

  console.log("Request headers: ", req.headers);
  const idToken = req.headers.authorization;

  if (!idToken) {
    // Respond with a 401 Unauthorized status code if the Firebase ID token is missing
    res.status(401).send('Unauthorized || ID Token is missing');
    return;
  }

  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // Extracting the user's message from the request body
      const message = req.body.message;

      console.log("Message received: ", message);

      res.send("THE AI IS NOT WORKING AT THE MOMENT");
      return;

      // Calling the OpenAI API to complete the message
      openai
        .createCompletion({
          model: "text-davinci-003",
          // Adding the conversation context to the message being sent
          prompt: conversationContextPrompt + message,
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: [" Human:", " AI:"],
        })
        .then((response) => {
          // Sending the response data back to the client
          if (response.status === 200) {
            res.send(response.data.choices);
          } else {
            res.send("Error: " + response.status);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      // User is not authenticated, respond with 401 Unauthorized
      res.status(401).send('Unauthorized');
    });

});

// Starting the Express app and listening on port 3001
app.listen(3001, () => {
  console.log("Conversational AI assistant listening on port 3001!");
});