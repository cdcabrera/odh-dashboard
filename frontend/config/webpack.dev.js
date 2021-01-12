const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { setupWebpackDotenvFile } = require('./dotenv');

const HOST = process.env.OSEED_HOST || 'localhost';
const PORT = process.env.OSEED_PORT || '3000';
const RELATIVE_DIRNAME = process.env._OSEED_RELATIVE_DIRNAME;
const IS_PROJECT_ROOT_DIR = process.env._OSEED_IS_PROJECT_ROOT_DIR;
const SRC_DIR = process.env._OSEED_SRC_DIR;
const DIST_DIR = process.env._OSEED_DIST_DIR;

const dotenvSettings = [];

if (!IS_PROJECT_ROOT_DIR) {
  const parentDirectory = path.resolve(RELATIVE_DIRNAME, '..');
  dotenvSettings.push(setupWebpackDotenvFile(path.resolve(parentDirectory, '.env.development.local')));
  dotenvSettings.push(setupWebpackDotenvFile(path.resolve(parentDirectory, '.env.development')));
}

dotenvSettings.push(setupWebpackDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.development.local')));
dotenvSettings.push(setupWebpackDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.development')));

module.exports = merge(
  {
    plugins: [
      ...dotenvSettings
    ]
  },
  common('development'),
  {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: DIST_DIR,
      host: HOST,
      port: PORT,
      compress: true,
      inline: true,
      historyApiFallback: true,
      hot: true,
      overlay: true,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [
            SRC_DIR,
            path.resolve(RELATIVE_DIRNAME, 'node_modules/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-styles/css'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/styles/base.css'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css'
            ),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css'
            ),
            path.resolve(
              RELATIVE_DIRNAME,
              'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css'
            )
          ],
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
);
