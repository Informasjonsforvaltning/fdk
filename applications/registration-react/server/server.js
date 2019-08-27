const _ = require('lodash');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.dev.config.js');

module.exports = {
  start() {
    const env = {
      production: process.env.NODE_ENV === 'production'
    };

    const app = express();
    app.use(compression());
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/views`);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    const port = Number(process.env.PORT || 4300);
    app.set('port', port);

    app.use('/env.json', (req, res) => {
      const vars = [
        'REGISTRATION_LANGUAGE',
        'SEARCH_HOST',
        'SEARCH_API_HOST',
        'SEARCH_API_AUTHORIZATION',
        'REDUX_LOG',
        'REFERENCE_DATA_HOST',
        'CONCEPT_REGISTRATION_API_HOST',
        'CONCEPT_REGISTRATION_HOST',
        'SSO_HOST',
        'REGISTRATION_API_HOST'
      ];
      const values = vars.map(varName => process.env[varName]);
      const envObj = _.zipObject(vars, values);
      res.json(envObj);
    });

    if (!env.production) {
      const compiler = webpack(config);

      app.use(
        webpackMiddleware(compiler, {
          publicPath: config.output.publicPath,
          contentBase: 'src',
          stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
          }
        })
      );
      app.use(webpackHotMiddleware(compiler));
    } else {
      app.use('/static', express.static(path.join(__dirname, '/../dist')));
    }

    app.get('*', (req, res) => {
      res.render('index');
    });

    app.listen(app.get('port'), () => {
      console.log('FDK-registration-react lytter på', app.get('port')); // eslint-disable-line no-console
      console.log('env:', env.production ? 'production' : 'development'); // eslint-disable-line no-console
    });
  }
};
