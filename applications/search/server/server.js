const _ = require('lodash');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.dev.config.js');

module.exports = {
  start() {
    const production = process.env.NODE_ENV === 'production';

    const app = express();
    app.use(compression());
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/views`);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    const port = Number(process.env.PORT || 3000);
    app.set('port', port);

    app.use('/env.json', (req, res) => {
      const vars = [
        'REDUX_LOG',
        'DISQUS_SHORTNAME'
        /*
TODO:
 There are currently lots of environment dependent configuration hardcoded in client code.
 Keep the list until the migration is gradually done:
  Twitter
  Analytics
  hotjar
  registration host
*/
      ];
      const values = vars.map(varName => process.env[varName]);
      const envObj = _.zipObject(vars, values);
      res.json(envObj);
    });

    if (!production) {
      const compiler = webpack(webpackConfig);

      app.use(
        webpackMiddleware(compiler, {
          publicPath: webpackConfig.output.publicPath,
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
      console.log('FDK-search lytter på', app.get('port')); // eslint-disable-line no-console
      console.log('env:', production ? 'production' : 'development'); // eslint-disable-line no-console
    });
  }
};
