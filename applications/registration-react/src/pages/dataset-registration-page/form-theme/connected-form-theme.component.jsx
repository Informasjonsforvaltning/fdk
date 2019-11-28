import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { ConfiguredFormThemes } from './configured-form-theme';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, themesItems } = ownProps;

  return {
    initialValues: {
      theme: datasetItem.theme || [],
      themesItems
    },
    syncErrors: getFormSyncErrors('themes')(state)
  };
};

export const ConnectedFormThemes = connect(mapStateToProps)(
  ConfiguredFormThemes
);
