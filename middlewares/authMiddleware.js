const { auth } = require('express-oauth2-jwt-bearer');

// TODO: make .env
const authenticate = () => {
  return auth({
    audience: 'https://stock-master-be.vercel.app',
    issuerBaseURL: 'https://lutfiandri.au.auth0.com/',
    tokenSigningAlg: 'RS256',
  });
};

module.exports = {
  authenticate,
};
