import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import { InputTagsAPIsField } from '../field-tagsinput-apis/field-tagsinput-apis.component';
import { getConfig } from '../../../config';

export const renderDistributionsAPI = () => (
  <div className="form-group">
    <Helptext
      title={localization.schema.distributionAPI.helptext.api}
      term="Distribution_api"
    />
    <Field name="distribution" component={InputTagsAPIsField} />
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${getConfig().searchHost}/apis/${item.id}`}
          >
            {item.title}
          </a>
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
    <>
      <form>
        <FieldArray name="distribution" component={renderDistributionsAPI} />
      </form>
      {renderConnectedApisByDatasetId(connectedApisByDatasetId)}
    </>
  );
};

FormDistributionApiPure.defaultProps = {
  connectedApisByDatasetId: null
};

FormDistributionApiPure.propTypes = {
  connectedApisByDatasetId: PropTypes.object
};
