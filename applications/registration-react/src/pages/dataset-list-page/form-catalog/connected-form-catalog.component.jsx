/* eslint-disable no-class-assign */
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import Form from './form-catalog.component';
import validate from './form-catalog-validations';
import { putCatalogDataset } from './async-catalog-dataset';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';
import { textType } from '../../../schemaTypes';
import './connected-form-catalog.scss';
import { config } from '../../../config';

const FormCatalog = reduxForm({
  form: 'catalog',
  validate,
  shouldAsyncValidate,
  asyncValidate: putCatalogDataset,
  asyncChangeFields: []
})(
  connect(state => ({
    values: getFormValues('catalog')(state)
  }))(Form)
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

export default connect(mapStateToProps)(FormCatalog);
/* eslint-enable no-class-assign */
