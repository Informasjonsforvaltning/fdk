import { connect } from 'react-redux';
import _ from 'lodash';

import { App } from './app';
import { loadConfigFromServer } from '../../redux/modules/config';

const mapStateToProps = ({ config }) => ({
  registrationLanguage: _.get(config, 'registrationLanguage', 'nb')
});

const mapDispatchToProps = dispatch => ({
  loadConfig: () => dispatch(loadConfigFromServer())
});

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
