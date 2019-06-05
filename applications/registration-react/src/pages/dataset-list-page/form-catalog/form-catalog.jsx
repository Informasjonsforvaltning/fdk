import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';

import { FormCatalogPure } from './form-catalog-pure';
import validate from './form-catalog-validations';
import { putCatalogDataset } from './async-catalog-dataset';
import { textType } from '../../../schemaTypes';
import './form-catalog.scss';
import { config } from '../../../services/config';

const formConfigurer = compose(
  reduxForm({
    form: 'catalog',
    validate,
    shouldAsyncValidate: _.stubTrue, // override default, save even if sync validation fails
    asyncValidate: putCatalogDataset
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
          ['items', catalogId, 'title', config.registrationLanguage],
          ''
        ).length > 0
          ? _.get(catalog, ['items', catalogId, 'title'])
          : textType,
      description:
        _.get(
          catalog,
          ['items', catalogId, 'description', config.registrationLanguage],
          ''
        ).length > 0
          ? _.get(catalog, ['items', catalogId, 'description'])
          : textType,
      publisher: _.get(catalog, ['items', catalogId, 'publisher'])
    }
  };
};

const enhance = compose(
  connect(mapStateToProps),
  formConfigurer
);

export const FormCatalog = enhance(FormCatalogPure);
