const server = require("./server/server.js")

server.start();

// const express = require('express');
// const path = require('path');
//
// const app = express();
// app.use('/static', express.static(path.join(__dirname, 'dist')));
// app.use(express.static(path.join(__dirname, '/')));
// app.set('port', process.env.PORT || 4300);
//
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });
//
// app.listen(app.get('port'), () => {
//   console.log('Min flotte app lytter på', app.get('port')); // eslint-disable-line no-console
// });
