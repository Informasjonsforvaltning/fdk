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
import { getReferenceDataByUri } from '../../../redux/modules/referenceData';

const renderReferences = (references, referencedItems, referenceData) => {
  const children = items =>
    items.map(item => {
      const referencedType = getReferenceDataByUri(
        referenceData,
        'referencetypes',
        _.get(item, ['referenceType', 'uri'])
      );

      let referencedItem;
      if (referencedItems) {
        referencedItem = referencedItems.filter(referencedItem => {
          if (_.get(referencedItem, 'uri')) {
            return referencedItem.uri === _.get(item, ['source', 'uri']);
          }
          return null;
        });
      }

      return (
        <div
          key={`reference-${_.get(item, ['source', 'uri'])}`}
          className="d-flex list-regular--item"
        >
          <div className="col-4 pl-0 fdk-text-strong">
            {referencedType
              ? getTranslateText(_.get(referencedType, 'prefLabel'))
              : _.get(item, ['referenceType', 'uri'])}
          </div>
          <div className="col-8">
            <LinkExternal
              uri={item.uri}
              prefLabel={
                getTranslateText(_.get(referencedItem, [0, 'title'])) ||
                _.get(item, ['source', 'uri'])
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
    <React.Fragment>
      {renderReferences(references, referencedItems, referenceData)}
      {renderRestrictions(spatial, temporal)}
    </React.Fragment>
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
