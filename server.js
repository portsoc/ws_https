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
app.use('/', express.static('static', { extensions: ['html'] }));

// starting the server
// using mainly HTTPS; with HTTP redirecting to that

const port = process.env.PORT || config.port;
const httpsPort = process.env.HTTPSPORT || config.httpsPort;

if (process.env.DISABLE_HTTPS) {
  // start server without HTTPS
  http.createServer(app).listen(port, () => {
    console.log(`SERVER WITHOUT HTTPS running on port ${port}`);
  });
} else {
  // start server with HTTPS
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
}
