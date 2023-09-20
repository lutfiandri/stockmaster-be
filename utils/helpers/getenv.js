const dotenv = require('dotenv');
const { exit } = require('process');

dotenv.config();

const getenv = (name) => {
  const env = process.env[name];
  if (!env) {
    console.error(`Environtment variable ${name} is missing!`);
    exit(1);
  }
  return env;
};

module.exports = getenv;
