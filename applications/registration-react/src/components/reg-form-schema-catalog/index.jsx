/* eslint-disable no-class-assign */
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidatePut';
import shouldAsyncValidate from '../../utils/shouldAsyncValidate';
import { textType } from '../../schemaTypes';
import './index.scss';

const FormCatalog = reduxForm({
  form: 'catalog',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: []
})(
  connect(state => ({
    values: getFormValues('catalog')(state)
  }))(Form)
);

const mapStateToProps = ({ catalog }) => ({
  initialValues: {
    id:
      catalog.catalogItem.id && catalog.catalogItem.id.length > 0
        ? catalog.catalogItem.id
        : '',
    title:
      catalog.catalogItem.title &&
      catalog.catalogItem.title.nb &&
      catalog.catalogItem.title.nb.length > 0
        ? catalog.catalogItem.title
        : textType,
    description:
      catalog.catalogItem.description &&
      catalog.catalogItem.description.nb &&
      catalog.catalogItem.description.nb.length > 0
        ? catalog.catalogItem.description
        : textType,
    publisher: catalog.catalogItem.publisher
  }
});

export default connect(mapStateToProps)(FormCatalog);
/* eslint-enable no-class-assign */
