import { connect } from 'react-redux';
import { App } from './app';

const mapStateToProps = state => ({
  // react-localization module designed to be stateful, so we have to re-render the app when the selected language is changed
  language: state.settings.language
});

export const ConnectedApp = connect(mapStateToProps)(App);
