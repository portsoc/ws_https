'use strict';

const domainName = 'testing.jacek.cz';

module.exports = {
  domainName,
  port: 8080,
  httpsPort: 8443,
  httpsCert: `/etc/letsencrypt/live/${domainName}/fullchain.pem`,
  httpsKey: `/etc/letsencrypt/live/${domainName}/privkey.pem`,
};
