import merge from 'webpack-merge';

import baseConfig from './base.config';

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 4301,
    historyApiFallback: true,
    before: app =>
      app.get('/env.json', (_, res) =>
        res.json({
          SEARCH_HOST: process.env.SEARCH_HOST || 'http://localhost:8080',
          REGISTRATION_API_HOST:
            process.env.REGISTRATION_API_HOST || 'http://localhost:8098',
          CONCEPT_REGISTRATION_API_HOST:
            process.env.CONCEPT_REGISTRATION_API_HOST ||
            'http://localhost:8200',
          CONCEPT_REGISTRATION_HOST:
            process.env.CONCEPT_REGISTRATION_HOST || 'http://localhost:8202',
          SSO_HOST: process.env.SSO_HOST || 'http://localhost:8084'
        })
      )
  },

  optimization: {
    minimize: false
  }
});
