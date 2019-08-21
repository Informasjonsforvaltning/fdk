import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTranslateText } from '../../../lib/translateText';
import { PublisherLabel } from '../../../components/publisher-label/publisher-label.component';
import localization from '../../../lib/localization';

const renderAccessRights = accessRight => {
  if (!accessRight) {
    return null;
  }

  const { code } = accessRight || {
    code: null
  };
  let accessRightsIconClass;
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsIconClass = 'fdk-color-unntatt fdk-icon-non-public';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.nonPublicDetailsLabel;
      break;
    case 'RESTRICTED':
      accessRightsIconClass = 'fdk-color-restricted fdk-icon-restricted';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.restrictedDetailsLabel;
      break;
    case 'PUBLIC':
      accessRightsIconClass = 'fdk-color-offentlig fdk-icon-public';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.publicDetailsLabel;
      break;
    default:
      accessRightsLabel = localization.unknown;
  }

  return (
    <div className="d-flex align-items-center">
      <i className={`fa fdk-fa-left ${accessRightsIconClass}`} />
      <strong style={{ marginTop: '6px' }}>{accessRightsLabel}</strong>
    </div>
  );
};

export const DatasetReference = props => {
  const { datasetReference } = props;

  if (!datasetReference) {
    return null;
  }

  const id = _.get(datasetReference, ['id']);
  const prefLabel = _.get(datasetReference, ['title']);

  return (
    <div className="d-flex flex-column list-regular--item mb-4">
      <a title={localization.api.linkDatasetReference} href={`/datasets/${id}`}>
        <strong>{prefLabel ? getTranslateText(prefLabel) : id}</strong>
      </a>
      <PublisherLabel
        label={localization.search_hit.owned}
        publisherItem={_.get(datasetReference, 'publisher')}
      />
      <div className="my-3">
        {getTranslateText(_.get(datasetReference, 'description'))}
      </div>
      {renderAccessRights(_.get(datasetReference, 'accessRights'))}
    </div>
  );
};

DatasetReference.defaultProps = {
  datasetReference: null
};

DatasetReference.propTypes = {
  datasetReference: PropTypes.object
};
