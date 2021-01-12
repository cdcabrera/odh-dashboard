const Dotenv = require('dotenv-webpack');

const setupWebpackDotenvFile = path => {
  const settings = {
    systemvars: true,
    silent: true
  };

  if (path) {
    settings.path = path;
  }

  return new Dotenv(settings);
};

module.exports = { setupWebpackDotenvFile };
