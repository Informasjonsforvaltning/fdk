const path = require('path');
const express = require('express');

module.exports = {
  start() {
    const app = express();

    const port = Number(process.env.PORT || 3000);
    app.set('port', port);

    app.get('/config.js', (req, res) => {
      res.sendFile(path.join(__dirname, '../config.js'));
    });

    app.use('/static', express.static(path.join(__dirname, '/../dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(app.get('port'), () => {
      console.log('FDK-search lytter på', app.get('port')); // eslint-disable-line no-console
    });
  }
};
