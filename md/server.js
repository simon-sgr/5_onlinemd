const express = require('express');
const marked = require('marked');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static('public'));
app.use(cors());

app.post('/markdown', express.text(), (req, res) => {
  const markdown = req.body;
  const html = marked.parse(markdown);
  res.send(html);
});

app.listen(3002, () => {
  console.log('Server listening on http://localhost:3002')
});