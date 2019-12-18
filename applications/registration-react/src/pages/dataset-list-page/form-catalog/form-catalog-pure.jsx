import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import cx from 'classnames';
import { Collapse } from 'reactstrap';

import localization from '../../../services/localization';
import { getTranslateText } from '../../../services/translateText';
import { Helptext } from '../../../components/helptext/helptext.component';
import InputTitleField from '../../../components/fields/field-input-title/field-input-title.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';

export class FormCatalogPure extends React.Component {
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
    const { collapseTitle } = this.state;
    this.setState({ collapseTitle: !collapseTitle });
  }

  toggleDescription() {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  }

  render() {
    const { initialValues, values } = this.props;
    const { collapse, collapseTitle } = this.state;
    const { title, publisher } = initialValues;

    const collapseClass = cx(
      'fdk-reg_collapse',
      'fdk-reg_backgroundDefault',
      'fdk-datasets-description',
      {
        'fdk-reg_collapse_open': collapse
      }
    );

    const fieldClass = cx('fdk-title-input', {
      'w-100': collapseTitle
    });

    return (
      <form className="mb-5 fdk-reg-catalogs">
        <div className="d-flex align-items-center justify-content-between">
          {title && title.nb && !collapseTitle && (
            <h1 className="w-75 fdk-text-strong">
              {getTranslateText(title, localization.getLanguage())}
            </h1>
          )}
          <div className={fieldClass}>
            <Field
              name={`title.${localization.getLanguage()}`}
              component={InputTitleField}
              hideInput={collapseTitle}
              onToggleTitle={this.toggleTitle}
            />
          </div>
        </div>

        {publisher && publisher.name && (
          <div className="fdk-reg-datasets-publisher mt-2 mb-4">
            {localization.schema.catalog.ownedByLabel} {publisher.name}
          </div>
        )}

        <div className={collapseClass}>
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex fdk-color-neutral-darkest">
              {getTranslateText(values.description, localization.getLanguage())}
            </div>
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                this.toggleDescription();
              }}
            >
              <i className="fa fa-pencil mr-2" />
              {localization.schema.catalog.editDescriptionLabel}
            </button>
          </div>
          <Collapse className="mt-3" isOpen={collapse}>
            <div className="form-group">
              <Helptext
                title={localization.schema.catalog.helptext.title}
                required
                term="Catalog_title"
              />
              <Field
                name={`description.${localization.getLanguage()}`}
                component={TextAreaField}
                label={localization.schema.common.descriptionLabel}
              />
            </div>
          </Collapse>
        </div>
      </form>
    );
  }
}

FormCatalogPure.defaultProps = {
  initialValues: null,
  values: null
};
FormCatalogPure.propTypes = {
  initialValues: PropTypes.object,
  values: PropTypes.object
};
