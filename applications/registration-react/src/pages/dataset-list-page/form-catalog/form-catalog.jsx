import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { FormCatalogPure } from './form-catalog-pure';
import validate from './form-catalog-validations';
import { putCatalogDataset } from './async-catalog-dataset';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';
import { textType } from '../../../schemaTypes';
import './form-catalog.scss';

const FormCatalogFormConfigured = reduxForm({
  form: 'catalog',
  validate,
  shouldAsyncValidate,
  asyncValidate: putCatalogDataset
})(
  connect(state => ({
    values: getFormValues('catalog')(state)
  }))(FormCatalogPure)
);

const mapStateToProps = ({ catalog, config }, ownProps) => {
  const registrationLanguage = _.get(config, 'registrationLanguage', 'nb');
  const { catalogId } = ownProps;
  return {
    initialValues: {
      id: catalogId,
      title:
        _.get(catalog, ['items', catalogId, 'title', registrationLanguage], '')
          .length > 0
          ? _.get(catalog, ['items', catalogId, 'title'])
          : textType,
      description:
        _.get(
          catalog,
          ['items', catalogId, 'description', registrationLanguage],
          ''
        ).length > 0
          ? _.get(catalog, ['items', catalogId, 'description'])
          : textType,
      publisher: _.get(catalog, ['items', catalogId, 'publisher'])
    }
  };
};

export const FormCatalog = connect(mapStateToProps)(FormCatalogFormConfigured);
/* eslint-enable no-class-assign */
