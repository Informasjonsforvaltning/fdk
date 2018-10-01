import { FeatureToggleProvider } from 'react-feature-toggles';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  featureToggleList: state.featureToggle
});

export const ConnectedFeatureToggleProvider = connect(mapStateToProps)(
  FeatureToggleProvider
);
