const express = require("express");
const openAI = require("openai");

// Importing the dotenv module to access environment variables
require("dotenv").config();

// Importing the body-parser module to parse incoming request bodies
const bp = require("body-parser");

// Creating a new Express app
const app = express();

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

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Defining an endpoint to handle incoming requests
app.post("/converse", (req, res) => {
  // Extracting the user's message from the request body
  const message = req.body.message;

  console.log("Message received: ", message);

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
      res.send(response.data.choices);
    });
});

// Starting the Express app and listening on port 3001
app.listen(3001, () => {
  console.log("Conversational AI assistant listening on port 3001!");
});