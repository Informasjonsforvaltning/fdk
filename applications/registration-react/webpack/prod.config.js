import merge from 'webpack-merge';

import baseConfig from './base.config';

export default merge(baseConfig, {
  mode: 'production',
  devtool: 'none'
});
