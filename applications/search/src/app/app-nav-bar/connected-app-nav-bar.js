import { connect } from 'react-redux';
import { AppNavBar } from './app-nav-bar';
import { setLanguageAction } from '../../redux/modules/settings';

const mapStateToProps = state => ({
  language: state.settings.language
});

const mapDispatchToProps = dispatch => ({
  onChangeLanguage: language => dispatch(setLanguageAction(language))
});

export const ConnectedAppNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppNavBar);
