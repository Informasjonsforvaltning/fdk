/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production2') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
