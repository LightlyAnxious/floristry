const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// * Функция генерации копий HtmlWebpackPlugin

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    if (extension === 'html') {
      return new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, `build/${name}.html`),
        template: path.resolve(
          __dirname,
          `${templateDir}/${name}.${extension}`
        ),
        minify: {
          collapseWhitespace: true
        }
      });
    } else {
      return;
    }
  });
}

const htmlPlugins = generateHtmlPlugins('./source').filter(
  el => el !== undefined
);

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname),
  entry: {
    main: ['./source/js/main.js']
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'build/js')
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    },
    minimize: true,
    minimizer: [new TerserPlugin()]
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.vendor|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd()
    }),
    new DuplicatePackageCheckerPlugin()
  ].concat(htmlPlugins)
};
