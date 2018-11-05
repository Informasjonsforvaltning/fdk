import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormThemes } from './configured-form-theme';
import { themeType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, themesItems } = ownProps;
  return {
    initialValues: {
      theme: _.get(datasetItem, 'theme', [themeType]),
      themesItems
    },
    syncErrors: getFormSyncErrors('themes')(state)
  };
};

export const ConnectedFormThemes = connect(mapStateToProps)(
  ConfiguredFormThemes
);
