import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { ListRegular } from '../../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../../components/list-regular/twoColRow/twoColRow';
import { LinkExternal } from '../../../components/link-external/link-external.component';
import './dataset-info.scss';
import {
  getReferenceDataByUri,
  REFERENCEDATA_PATH_REFERENCETYPES
} from '../../../redux/modules/referenceData';
import { getConfig } from '../../../config';

const renderReferences = (references, referencedItems, referenceData) => {
  const children = items =>
    items.map(item => {
      const referenceTypeUri = _.get(item, ['referenceType', 'uri']);
      const referencedType = getReferenceDataByUri(
        referenceData,
        REFERENCEDATA_PATH_REFERENCETYPES,
        referenceTypeUri
      );

      const referenceUri = _.get(item, ['source', 'uri']);
      const referencedItem = _.find(referencedItems, { uri: referenceUri });

      return (
        <div
          key={`reference-${referenceUri}`}
          className="d-flex list-regular--item"
        >
          <div className="col-4 pl-0 fdk-text-strong">
            {getTranslateText(_.get(referencedType, 'prefLabel')) ||
              referenceTypeUri}
          </div>
          <div className="col-8">
            <LinkExternal
              uri={
                referencedItem
                  ? `${getConfig().searchHost.host}/datasets/${
                      referencedItem.id
                    }`
                  : referenceUri
              }
              prefLabel={
                getTranslateText(_.get(referencedItem, 'title')) || referenceUri
              }
            />
          </div>
        </div>
      );
    });

  if (!references) {
    return null;
  }
  return (
    <ListRegular title={localization.dataset.related}>
      {children(references)}
    </ListRegular>
  );
};

const renderSpatial = spatial => {
  if (!spatial) {
    return null;
  }
  const spatialItems = spatial =>
    spatial.map((item, index) => (
      <span key={index}>
        {index > 0 ? ', ' : ''}
        {getTranslateText(_.get(item, 'prefLabel'))}
      </span>
    ));

  return (
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">
        {localization.dataset.spatial}
      </div>
      <div className="col-8">{spatialItems(spatial)}</div>
    </div>
  );
};

const renderTemporal = temporal => {
  const children = items =>
    items.map(item => (
      <React.Fragment key={`temporal-${_.get(item, 'startDate')}`}>
        {_.get(item, 'startDate') && (
          <TwoColRow
            col1={localization.dataset.periodFrom}
            col2={<Moment format="DD.MM.YYYY">{item.startDate}</Moment>}
          />
        )}
        {_.get(item, 'endDate') && (
          <TwoColRow
            col1={localization.dataset.periodTo}
            col2={<Moment format="DD.MM.YYYY">{item.endDate}</Moment>}
          />
        )}
      </React.Fragment>
    ));

  if (!temporal) {
    return null;
  }
  return children(temporal);
};

const renderRestrictions = (spatial, temporal) => {
  if (!(spatial || temporal)) {
    return null;
  }

  return (
    <ListRegular title={localization.dataset.restrictions}>
      {renderSpatial(spatial)}
      {renderTemporal(temporal)}
    </ListRegular>
  );
};

export const DatasetInfo = props => {
  const { datasetItem, referenceData, referencedItems } = props;
  const { references, spatial, temporal } = datasetItem || {};
  return (
    <>
      {renderReferences(references, referencedItems, referenceData)}
      {renderRestrictions(spatial, temporal)}
    </>
  );
};

DatasetInfo.defaultProps = {
  datasetItem: null,
  referenceData: null,
  referencedItems: null
};

DatasetInfo.propTypes = {
  datasetItem: PropTypes.object,
  referenceData: PropTypes.object,
  referencedItems: PropTypes.array
};
