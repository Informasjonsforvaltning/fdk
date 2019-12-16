const path = require('path');
const express = require('express');
const compression = require('compression');

module.exports = {
  start() {
    const app = express();
    app.use(compression());

    const port = Number(process.env.PORT || 4300);
    app.set('port', port);

    app.use('/env.json', express.static(path.join(__dirname, 'env.json')));

    app.use('/', express.static(path.join(__dirname, '/../dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(app.get('port'), () => {
      console.log('registration-react started, port:', app.get('port')); // eslint-disable-line no-console
    });
  }
};
