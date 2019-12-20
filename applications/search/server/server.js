const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');

module.exports = {
  start() {
    const app = express();
    app.use(compression());
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/views`);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    const port = Number(process.env.PORT || 3000);
    app.set('port', port);

    app.use('/env.json', express.static(path.join(__dirname, 'env.json')));

    app.use('/static', express.static(path.join(__dirname, '/../dist')));

    app.get('*', (req, res) => {
      res.render('index');
    });

    app.listen(app.get('port'), () => {
      console.log('FDK-search lytter på', app.get('port')); // eslint-disable-line no-console
    });
  }
};
