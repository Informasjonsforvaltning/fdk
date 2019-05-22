import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';

import { FormCatalogPure } from './form-catalog-pure';
import validate from './form-catalog-validations';
import { putCatalogDataset } from './async-catalog-dataset';
import shouldAsyncValidate from '../../../lib/shouldAsyncValidate';
import { textType } from '../../../schemaTypes';
import './form-catalog.scss';
import { withInjectablesMapper } from '../../../lib/injectables';

const formConfigurer = compose(
  reduxForm({
    form: 'catalog',
    validate,
    shouldAsyncValidate,
    asyncValidate: putCatalogDataset
  }),
  connect(state => ({
    values: getFormValues('catalog')(state)
  }))
);

const mapStateToProps = ({ catalog }, ownProps) => {
  const { catalogId, registrationLanguage } = ownProps;
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

const injector = withInjectablesMapper(injectables => ({
  registrationLanguage: injectables.config.registrationLanguage
}));

const enhance = compose(
  injector,
  connect(mapStateToProps),
  formConfigurer
);

export const FormCatalog = enhance(FormCatalogPure);
