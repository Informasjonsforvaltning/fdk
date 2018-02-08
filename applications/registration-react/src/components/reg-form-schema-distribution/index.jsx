import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';

const validate = values => {
  const errors = {}
  const { distribution } = values;
  let errorNodes = null;

  if (distribution) {
    errorNodes = distribution.map((item, index) => {
      const errors = {}
      const description = (item.description && item.description.nb) ? item.description.nb : null;
      const license = (item.license && item.license.uri) ? item.license.uri : null;
      const page = (item.page && item.page[index] && item.page[index].uri) ? item.page[index].uri : null;

      if (license && license.length < 2) {
        errors.license = { uri: localization.validation.minTwoChars}
      }

      if (description && description.length < 2) {
        errors.description = { nb: localization.validation.minTwoChars}
      }

      if (page && page.length < 2) {
        errors.page = [{uri: localization.validation.minTwoChars}]
      }

      return errors;
    });
  }
  errors.distribution = errorNodes;

  /*
   let themeNodes = null;
   const { themes, selectedLanguageCode } = this.props;
   if (themes) {
   themeNodes = themes.map(singleTheme => (
   <div
   key={`dataset-description-theme-${singleTheme.code}`}
   id={`dataset-description-theme-${singleTheme.code}`}
   className="fdk-label fdk-label-on-grey"
   >
   {getTranslateText(singleTheme.title, selectedLanguageCode)}
   </div>
   ));
   }
   return themeNodes;

   */


  // errors.distribution = {accessURL: localization.validation.minTwoChars}

  /*
   if (values.distribution.description.length < 2) {
   errors.distribution.description = localization.validation.minTwoChars
   }
   */

  /*
   if (values.distribution.accessURL.length < 2) {
   errors.distribution.accessURL = localization.validation.minTwoChars
   }
   */

  return errors
}

const renderDistributionLandingpage = ({ fields }) => (
  <div>
    {fields.map((item, index) =>
      (<Field
        key={index}
        name={`${item}.uri`}
        component={InputField}
        label="Landingsside"
      />)
    )}
  </div>
);

const renderDistributions = (props) => {
  /*

   */
  const { fields, helptextItems } = props
  return (
    <div>
      {fields.map((distribution, index) => (
        <div key={index}>
          <div className="d-flex">
            <h4>Distribusjon #{index + 1}</h4>
            <button
              type="button"
              title="Remove distribution"
              onClick={() => {fields.remove(index); asyncValidate(fields.getAll(), null, props, `remove_distribution_${index}`);}}
            >
              <i className="fa fa-trash mr-2" />
                Slett distribusjon
            </button>
          </div>
          <div className="form-group">
            <Helptext title="Type" helptextItems={helptextItems.Dataset_distribution} />
            <Field name={`${distribution}.type`} radioId={`distribution-api-${index}`} component={RadioField} type="radio" value="API" label="API"  />
            <Field name={`${distribution}.type`} radioId={`distribution-feed-${index}`}  component={RadioField} type="radio" value="Feed" label="Feed"  />
            <Field name={`${distribution}.type`} radioId={`distribution-file-${index}`} component={RadioField} type="radio" value="Nedlastbar fil" label="Nedlastbar fil" />
          </div>
          <div className="form-group">
            <Helptext title="Tilgangs URL" helptextItems={helptextItems.Distribution_accessURL} />
            <Field
              name={`${distribution}.accessURL.0`}
              type="text"
              component={InputField}
              label="Tilgangs URL"
            />
          </div>
          <div className="form-group">
            <Helptext title="Format" helptextItems={helptextItems.Distribution_format} />
            <Field
              name={`${distribution}.format`}
              type="text"
              component={InputTagsField}
              label="Format"
            />
          </div>
          <div className="form-group">
            <Helptext title="Lisens" helptextItems={helptextItems.Distribution_modified} />
            <Field name={`${distribution}.license.uri`} component={InputField} label="Lisens" />
          </div>
          <div className="form-group">
            <Helptext title="Beskrivelse" helptextItems={helptextItems.Distribution_description} />
            <Field name={`${distribution}.description.nb`} component={TextAreaField} label="Beskrivelse" />
          </div>

          <div className="form-group">
            <Helptext
              title="Lenke til dokumentasjon av distribusjonen"
              helptextItems={helptextItems.Distribution_documentation}
            />
            <FieldArray
              name={`${distribution}.page`}
              component={renderDistributionLandingpage}
              helptextItems={helptextItems}
            />
          </div>

          <div className="form-group">
            <Helptext
              title="Standard"
              helptextItems={helptextItems.Distribution_conformsTo}
            />
            <div className="d-flex">
              <div className="w-50">
                <Field name={`${distribution}.conformsTo[0].prefLabel.nb`} component={InputField} showLabel label="Tittel" />
              </div>
              <div className="w-50">
                <Field name={`${distribution}.conformsTo[0].uri`} component={InputField} showLabel label="Lenke" />
              </div>
            </div>
          </div>
          <hr />
        </div>
      )
      )}
      <button
        type="button"
        onClick={() => fields.push(
          {
            id: '',
            description: textType,
            accessURL: [],
            license: licenseType,
            conformsTo: [],
            page: [licenseType],
            format: [],
            type: ''
          }
        )}
      >
        <i className="fa fa-plus mr-2" />
        Legg til distribusjon
      </button>
    </div>
  );
}

let FormDistribution = props => {
  const { helptextItems } = props;
  return (
    <form>
      <FieldArray
        name="distribution"
        component={renderDistributions}
        helptextItems={helptextItems}
      />
    </form>
  )
}

FormDistribution = reduxForm({
  form: 'distribution',
  validate,
  asyncValidate,
})(FormDistribution)

const distributionTypes = values => {
  console.log("inn i types");
  let distributions  = null;
  if (values && values.length > 0) {
    distributions = values.map(item => (
      {
        id: item.id ? item.id : '',
        description: item.description ? item.description : textType,
        accessURL: item.accessURL ? item.accessURL : [],
        license: item.license ? item.license : licenseType,
        conformsTo: item.conformsTo ? item.conformsTo : [],
        page: (item.page && item.page.length > 0) ? item.page : [licenseType],
        format: (item.format) ? item.format : [],
        type: item.type ? item.type : ''
      }
    ))
  } else {
    distributions = [{
      id: '',
      description: textType,
      accessURL: [],
      license: licenseType,
      conformsTo: [],
      page: [licenseType],
      format: [],
      type: ''
    }]
  }
  return distributions;
}

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      distribution: distributionTypes(dataset.result.distribution)
    }
  }
)

export default connect(mapStateToProps)(FormDistribution)

/*
 // You have to connect() to any reducers that you wish to connect to yourself
 FormDistribution = connect(
 state => ({
 // initialValues: state.dataset.result // pull initial values from dataset reducer
 initialValues: {
 distribution: state.dataset.result.distribution || null
 }
 })
 )(FormDistribution)

 export default FormDistribution;
 */
