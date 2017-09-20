var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool:"eval",
  context:path.join(__dirname),
  entry: [
//    'webpack-hot-middleware/client?reload=true',
    './src/index.jsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("styles.css")
  ],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions:[".js", ".jsx", ".webpack.js", ".web.js"]
  },
  resolveLoader: {
    //root: path.join(__dirname, "node_modules")
    modules: [__dirname, 'node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-react')
          ]
        }
      },
      {
        test: /\.scss$/,
        //loaders: ["style", "css", "sass"]
        use: ExtractTextPlugin.extract({  
          fallback: 'style-loader',  
          use: ['css-loader', 'sass-loader']  
        })
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[path][name].[ext]'
        ]
      }
    ]
  }
};
