import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import { InputTagsAPIsField } from '../field-tagsinput-apis/field-tagsinput-apis.component';
import { config } from '../../../services/config';

export const renderDistributionsAPI = () => (
  <div className="form-group">
    <Helptext
      title={localization.schema.distributionAPI.helptext.api}
      term="Distribution_api"
    />
    <Field
      name="distribution"
      type="text"
      component={InputTagsAPIsField}
      label={localization.schema.concept.conceptLabel}
      fieldLabel="no"
    />
  </div>
);

const renderConnectedApisByDatasetId = connectedApisByDatasetId => {
  if (
    !(
      connectedApisByDatasetId &&
      _.get(connectedApisByDatasetId, 'hits').length > 0
    )
  ) {
    return null;
  }

  const children = items =>
    items.map(item => (
      <div
        key={item.id}
        className="d-flex align-items-center border-bottom py-3"
      >
        <span className="w-75">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={`${config.searchHost}/apis/${item.id}`}
          >
            {item.title}
          </Link>
        </span>
        <span className="w-25 breakword">
          {_.get(item, ['publisher', 'name'])}
        </span>
      </div>
    ));

  return (
    <div className="px-3 mt-5 mb-5">
      <div className="d-flex border-bottom py-3">
        <span className="w-75">
          <strong>{localization.connectedAPI}</strong>
        </span>
        <span className="w-25">
          <strong>Tilbyder</strong>
        </span>
      </div>
      {children(_.get(connectedApisByDatasetId, 'hits'))}
    </div>
  );
};

export const FormDistributionApiPure = props => {
  const { connectedApisByDatasetId } = props;
  return (
    <React.Fragment>
      <form>
        <FieldArray name="distribution" component={renderDistributionsAPI} />
      </form>
      {renderConnectedApisByDatasetId(connectedApisByDatasetId)}
    </React.Fragment>
  );
};

FormDistributionApiPure.defaultProps = {
  connectedApisByDatasetId: null
};

FormDistributionApiPure.propTypes = {
  connectedApisByDatasetId: PropTypes.object
};
