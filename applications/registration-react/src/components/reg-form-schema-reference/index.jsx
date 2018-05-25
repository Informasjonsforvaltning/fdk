import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';
import { languageType } from '../../schemaTypes';

const FormReference = reduxForm({
  form: 'reference',
  validate,
  asyncValidate
})(Form);

const mapStateToProps = ({ dataset, referenceTypes, referenceDatasets }) => ({
  initialValues: {
    references:
      dataset.result.references && dataset.result.references.length > 0
        ? dataset.result.references
        : [languageType],
    referenceTypesItems: referenceTypes.referenceTypesItems,
    referenceDatasetsItems: referenceDatasets.referenceDatasetsItems
  }
});

export default connect(mapStateToProps)(FormReference);
