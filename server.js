require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

let db = [
  { original_url: "https://www.google.com", short_url: 1},
  { original_url: "https://forum.freecodecamp.org/", short_url: 3},
];

function shortenUrl(url) {
  const shortedUrl = { original_url: url, short_url: Math.floor(Math.random() * 10000) + 1};
  db.push(shortedUrl);
  return shortedUrl;
}

function findUrl(short_url) {
  return db.find(el => el.short_url == short_url);
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:url', function(req, res) {
  res.redirect(findUrl(req.params.url).original_url);
});

app.post('/api/shorturl', function(req, res) {
  if (validURL(req.body.url)) {
    res.json({
      error: 'invalid url'
    })
  } else {
    res.json(shortenUrl(req.body.url));
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
