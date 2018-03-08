/*
 * A simple express server with HTTPS.
 */

'use strict';

const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

const config = require('./config');

const app = express();

// routes can go here
app.use('/', express.static('webpages', { extensions: ['html'] }));

// starting the server
// using mainly HTTPS; with HTTP redirecting to that

const port = process.env.PORT || config.port;
const httpsPort = process.env.HTTPSPORT || config.httpsPort;

const credentials = {};
try {
  credentials.key = fs.readFileSync(config.httpsKey, 'utf8');
  credentials.cert = fs.readFileSync(config.httpsCert, 'utf8');
} catch (e) {
  console.error('ERROR: cannot open HTTPS credentials');
  console.error(e);
  process.exit(1);
}

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log(`Server listening on HTTPS port ${httpsPort}`);

  // HTTP app will just redirect to HTTPS
  const redirectApp = express();
  redirectApp.get('*', (req, res) => res.redirect('https://' + req.hostname + req.url));

  http.createServer(redirectApp).listen(port, () => {
    console.log(`HTTP redirect server listening on port ${port}`);
  });
});
