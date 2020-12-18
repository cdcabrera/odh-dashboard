const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const {
  compilerOptions: tsConfigCompilerOptions = { outDir: './dist', baseUrl: './src' }
} = require(path.resolve(__dirname, './tsconfig.json'));

const IMAGES_DIRNAME = process.env.IMAGES_DIRNAME || 'images';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const SRC_DIR = path.resolve(__dirname, process.env.SRC_DIR || tsConfigCompilerOptions.baseUrl);
const DIST_DIR = path.resolve(__dirname, process.env.DIST_DIR || tsConfigCompilerOptions.outDir);

process.env.SRC_DIR = SRC_DIR;
process.env.DIST_DIR = DIST_DIR;

console.info(`
Prepping files...

SRC DIR: ${SRC_DIR}
OUTPUT DIR: ${DIST_DIR}
PUBLIC PATH: ${PUBLIC_PATH}
`);

module.exports = env => {
  return {
    entry: {
      app: path.join(SRC_DIR, 'index.tsx')
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx|js)?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              }
            }
          ]
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          // only process modules with this loader
          // if they live under a 'fonts' or 'pficon' directory
          include: [
            path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
            path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon')
          ],
          use: {
            loader: 'file-loader',
            options: {
              // Limit at 50k. larger files emitted into separate files
              limit: 5000,
              outputPath: 'fonts',
              name: '[name].[ext]',
            }
          }
        },
        {
          test: /\.svg$/,
          include: input => input.indexOf('background-filter.svg') > 1,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 5000,
                outputPath: 'svgs',
                name: '[name].[ext]',
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader if they live under a 'bgimages' directory
          // this is primarily useful when applying a CSS background using an SVG
          include: input => input.indexOf(IMAGES_DIRNAME) > -1,
          use: {
            loader: 'svg-url-loader',
            options: {
              limit: 10000
            }
          }
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader when they don't live under a 'bgimages',
          // 'fonts', or 'pficon' directory, those are handled with other loaders
          include: input => (
            (input.indexOf(IMAGES_DIRNAME) === -1) &&
            (input.indexOf('fonts') === -1) &&
            (input.indexOf('background-filter') === -1) &&
            (input.indexOf('pficon') === -1)
          ),
          use: {
            loader: 'raw-loader',
            options: {}
          }
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            SRC_DIR,
            path.resolve(__dirname, 'node_modules/patternfly'),
            path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/images'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/images'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images')
          ],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 5000,
                outputPath: 'images',
                name: '[name].[ext]',
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        }
      ]
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, DIST_DIR),
      publicPath: PUBLIC_PATH
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(SRC_DIR, 'index.html')
      }),
      new Dotenv({
        systemvars: true,
        silent: true
      }),
      new CopyPlugin({
        patterns: [
          { from: path.join(SRC_DIR, 'locales'), to: path.join(DIST_DIR, 'locales'), noErrorOnMissing: true },
          { from: path.join(SRC_DIR, 'favicons'), to: path.join(DIST_DIR, 'favicons'), noErrorOnMissing: true },
          { from: path.join(SRC_DIR, 'images'), to: path.join(DIST_DIR, 'images'), noErrorOnMissing: true },
          { from: path.join(SRC_DIR, 'favicon.ico'), to: path.join(DIST_DIR), noErrorOnMissing: true },
          { from: path.join(SRC_DIR, 'manifest.json'), to: path.join(DIST_DIR), noErrorOnMissing: true },
          { from: path.join(SRC_DIR, 'robots.txt'), to: path.join(DIST_DIR), noErrorOnMissing: true }
        ]
      })
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, './tsconfig.json')
        })
      ],
      symlinks: false,
      cacheWithContext: false
    }
  }
};