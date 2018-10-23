import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { DistributionFormat } from '../../../../components/distribution-format/distribution-format.component';
import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';
import './search-hit-item.scss';
import {
  getReferenceDataByUri,
  REFERENCEDATA_DISTRIBUTIONTYPE
} from '../../../../redux/modules/referenceData';

const renderFormats = (source, code, referenceData) => {
  const { distribution } = source;

  const children = (distributions, code) => {
    const nodes = [];
    distributions.forEach(item => {
      const { format } = item;
      let { type } = item;
      if (format && typeof format !== 'undefined') {
        if (
          type &&
          (type !== 'API' && type !== 'Feed' && type !== 'Nedlastbar fil')
        ) {
          const distributionType = getReferenceDataByUri(
            referenceData,
            REFERENCEDATA_DISTRIBUTIONTYPE,
            type
          );
          if (distributionType !== null && distributionType.length > 0) {
            type = getTranslateText(distributionType[0].prefLabel);
          } else {
            type = null;
          }
        }
        const formatNodes = Object.keys(format).map(key => (
          <DistributionFormat
            key={`dataset-distribution-format${key}`}
            code={code}
            text={format[key]}
            type={type}
          />
        ));
        nodes.push(formatNodes);
      }
    });
    return nodes;
  };

  if (distribution && _.isArray(Object.keys(distribution))) {
    return <div>{children(distribution, code)}</div>;
  }
  return null;
};

const renderSample = dataset => {
  const { sample } = dataset;
  if (Array.isArray(sample) && sample.length > 0) {
    return <div id="search-hit-sample">{localization.search_hit.sample}</div>;
  }
  return null;
};

export const SearchHitItem = props => {
  const { referenceData, result } = props;
  const { _source: dataset } = result || {};
  const { id, publisher, theme, provenance, accessRights } = dataset || {};
  let { title, description, objective } = dataset || {};
  title = getTranslateText(title);
  description = getTranslateText(description);
  objective = getTranslateText(objective);

  if (description && description.length > 220) {
    description = `${description.substr(0, 220)}...`;
  } else if (description && description.length < 150 && objective) {
    const freeLength = 200 - description.length;
    const objectiveLength = objective.length;
    description = `${description} ${objective.substr(0, 200 - freeLength)} ${
      objectiveLength > freeLength ? '...' : ''
    }`;
  }
  const link = `/datasets/${id}`;

  let accessRightsLabel;
  let distributionNonPublic = false;
  let distributionRestricted = false;
  let distributionPublic = false;

  const authorityCode = _.get(accessRights, 'code', '');

  if (authorityCode === 'NON_PUBLIC') {
    distributionNonPublic = true;
    accessRightsLabel =
      localization.dataset.accessRights.authorityCode.nonPublic;
  } else if (authorityCode === 'RESTRICTED') {
    distributionRestricted = true;
    accessRightsLabel =
      localization.dataset.accessRights.authorityCode.restricted;
  } else if (authorityCode === 'PUBLIC') {
    distributionPublic = true;
    accessRightsLabel = localization.dataset.accessRights.authorityCode.public;
  }

  const distributionClass = cx({
    'fdk-container-distributions':
      distributionNonPublic || distributionRestricted || distributionPublic,
    'fdk-distributions-red': distributionNonPublic,
    'fdk-distributions-yellow': distributionRestricted,
    'fdk-distributions-green': distributionPublic
  });

  return (
    <article>
      <Link
        className="fdk-a-search-hit"
        title={`${localization.result.dataset}: ${title}`}
        to={link}
      >
        <span className="uu-invisible" aria-hidden="false">
          Søketreff.
        </span>
        <div className="fdk-container-search-hit">
          <header>
            <SearchHitHeader
              tag="h2"
              title={title}
              publisherLabel={localization.search_hit.owned}
              publisher={publisher}
              theme={theme}
              nationalComponent={_.get(provenance, 'code') === 'NASJONAL'}
            />
          </header>
          <p className="fdk-p-search-hit">
            <span className="uu-invisible" aria-hidden="false">
              Beskrivelse av datasettet,
            </span>
            {description}
          </p>
          <div className={distributionClass}>
            <strong>{accessRightsLabel}</strong>
            {renderFormats(dataset, authorityCode, referenceData)}
            {renderSample(dataset)}
          </div>
        </div>
      </Link>
    </article>
  );
};

SearchHitItem.defaultProps = {
  result: null,
  referenceData: null
};

SearchHitItem.propTypes = {
  result: PropTypes.shape({}),
  referenceData: PropTypes.object
};
