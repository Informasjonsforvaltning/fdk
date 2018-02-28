import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTitleField from '../reg-form-field-input-title';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidatePut';
import shouldAsyncValidate from '../../utils/shouldAsyncValidate';
import { textType } from '../../schemaTypes';
import { validateRequired, validateMinTwoChars, validateURL } from '../../validation/validation';
import './index.scss';

const validate = values => {
  let errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;

  errors = validateRequired('title', title, errors);
  errors = validateMinTwoChars('title', title, errors);

  errors = validateRequired('description', description, errors);
  errors = validateMinTwoChars('description', description, errors);

  errors = validateMinTwoChars('objective', objective, errors);

  errors = validateURL('landingPage', landingPage, errors, true);

  return errors
}

// let FormCatalog = (props) => {
class FormCatalog extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    this.state = {
      collapseTitle: false,
      collapse: false
    };
  }

  toggleTitle() {
    this.setState({ collapseTitle: !this.state.collapseTitle });
  }

  toggleDescription() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { helptextItems, initialValues, values } = this.props;
    const { id, title, description, publisher } = initialValues;

    const collapseClass = cx(
      'fdk-reg_collapse',
      'fdk-reg_backgroundDefault',
      'fdk-datasets-description',
      {
        'fdk-reg_collapse_open': this.state.collapse
      }
    )

    const fieldClass = cx(
      'fdk-title-input',
      {
        'w-100': this.state.collapseTitle
      }
    );

    return (
      <form className="mb-5 fdk-reg-catalogs">
        <div className="d-none">
          <Field name="id" component={InputField} label="Beskrivelse" />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          {title && title.nb && !this.state.collapseTitle &&
          <h1 className="w-75 fdk-text-strong">
            {title.nb}
          </h1>
          }
          <div className={fieldClass}>
            <Field name="title.nb" component={InputTitleField} label="Tittel" hideInput={this.state.collapseTitle} onToggleTitle={this.toggleTitle} />
          </div>
        </div>

        {publisher && publisher.name &&
        <div className="fdk-reg-datasets-publisher mt-2 mb-4">
          Eies av {publisher.name}
        </div>
        }

        <div className={collapseClass}>
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex fdk-color1">
              {values.description.nb}
            </div>
            <button onClick={(e) => {e.preventDefault(); this.toggleDescription();}}>
              <i className="fa fa-pencil mr-2" />
              Rediger beskrivelse
            </button>
          </div>
          <Collapse
            className="mt-3"
            isOpen={this.state.collapse}
          >
            <div className="form-group">
              <Helptext title="Beskrivelse" required helptextItems={helptextItems.Catalog_title} />
              <Field name="description.nb" component={TextAreaField} label="Beskrivelse" />
            </div>
          </Collapse>
        </div>
      </form>
    )
  }
}

FormCatalog = reduxForm({
  form: 'catalog',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: [],
})(connect(state => ({
  values: getFormValues('catalog')(state)
}))(FormCatalog));

const mapStateToProps = ({ catalog }) => (
  {
    initialValues: {
      id: (catalog.catalogItem.id && catalog.catalogItem.id.length > 0) ? catalog.catalogItem.id : '',
      title: (catalog.catalogItem.title && catalog.catalogItem.title.nb && catalog.catalogItem.title.nb.length > 0) ? catalog.catalogItem.title : textType,
      description: (catalog.catalogItem.description && catalog.catalogItem.description.nb && catalog.catalogItem.description.nb.length > 0) ? catalog.catalogItem.description : textType,
      publisher: catalog.catalogItem.publisher
    }
  }
)

export default connect(mapStateToProps)(FormCatalog)
