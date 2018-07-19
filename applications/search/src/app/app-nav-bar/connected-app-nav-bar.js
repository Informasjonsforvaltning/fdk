import { connect } from 'react-redux';
import { AppNavBar } from './app-nav-bar';
import { setLanguage } from '../../redux/actions';

const mapStateToProps = state => ({
  language: state.settings.language
});

const mapDispatchToProps = dispatch => ({
  onChangeLanguage: language => dispatch(setLanguage(language))
});

export const ConnectedAppNavBar = connect(mapStateToProps, mapDispatchToProps)(
  AppNavBar
);
