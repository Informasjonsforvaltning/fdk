import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';

import { FormCatalogPure } from './form-catalog-pure';
import validate from './form-catalog-validations';
import { asyncValidateCatalog } from './async-validate-catalog';
import { textType } from '../../../schemaTypes';
import './form-catalog.scss';
import { getConfig } from '../../../config';

const formConfigurer = compose(
  reduxForm({
    form: 'catalog',
    validate,
    shouldAsyncValidate: _.stubTrue, // override default, save even if sync validation fails
    asyncValidate: asyncValidateCatalog
  }),
  connect(state => ({
    values: getFormValues('catalog')(state)
  }))
);

const mapStateToProps = ({ catalog }, ownProps) => {
  const { catalogId } = ownProps;
  return {
    initialValues: {
      id: catalogId,
      title:
        _.get(
          catalog,
          ['items', catalogId, 'title', getConfig().registrationLanguage],
          ''
        ).length > 0
          ? _.get(catalog, ['items', catalogId, 'title'])
          : textType,
      description:
        _.get(
          catalog,
          ['items', catalogId, 'description', getConfig().registrationLanguage],
          ''
        ).length > 0
          ? _.get(catalog, ['items', catalogId, 'description'])
          : textType,
      publisher: _.get(catalog, ['items', catalogId, 'publisher'])
    }
  };
};

const enhance = compose(connect(mapStateToProps), formConfigurer);

export const FormCatalog = enhance(FormCatalogPure);
