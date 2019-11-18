import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';
import './search-hit-item.scss';
import {
  getReferenceDataByUri,
  REFERENCEDATA_PATH_DISTRIBUTIONTYPE
} from '../../../../redux/modules/referenceData';

const renderFormats = (source, referenceData) => {
  const { distribution } = source;

  const children = distributions => {
    const nodes = [];
    distributions.forEach(item => {
      let formatString;
      const { format } = item;
      let { type } = item;
      if (
        type &&
        (type !== 'API' && type !== 'Feed' && type !== 'Nedlastbar fil')
      ) {
        const distributionType = getReferenceDataByUri(
          referenceData,
          REFERENCEDATA_PATH_DISTRIBUTIONTYPE,
          type
        );
        if (distributionType) {
          type = getTranslateText(distributionType.prefLabel);
        } else {
          type = null;
        }
      }
      if (format && typeof format !== 'undefined') {
        formatString = format.join(', ');
      }
      nodes.push(` ${type} (${formatString})`);
    });
    return nodes;
  };

  if (distribution && _.isArray(Object.keys(distribution))) {
    return (
      <div className="d-flex flex-wrap mb-4">
        {localization.search_hit.distributionType}:{children(distribution)}
      </div>
    );
  }
  return null;
};

const renderAccessRights = accessRight => {
  if (!accessRight) {
    return null;
  }

  const { code } = accessRight || {
    code: null
  };
  let accessRightsIconClass;
  let accessRightsColorClass;
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsIconClass = 'fdk-icon-non-public';
      accessRightsColorClass = 'fdk-color-unntatt';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.nonPublicDetailsLabel;
      break;
    case 'RESTRICTED':
      accessRightsIconClass = 'fdk-icon-restricted';
      accessRightsColorClass = 'fdk-color-restricted';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.restrictedDetailsLabel;
      break;
    case 'PUBLIC':
      accessRightsIconClass = 'fdk-icon-public';
      accessRightsColorClass = 'fdk-color-offentlig';
      accessRightsLabel =
        localization.dataset.accessRights.authorityCode.publicDetailsLabel;
      break;
    default:
      accessRightsLabel = localization.unknown;
  }

  return (
    <div className="d-flex align-items-center mb-4">
      <i className={`mr-2 ${accessRightsIconClass}`} />
      <div className={accessRightsColorClass}>{accessRightsLabel}</div>
    </div>
  );
};

const renderSample = dataset => {
  const { sample } = dataset;
  if (Array.isArray(sample) && sample.length > 0) {
    return (
      <div className="mb-4" id="search-hit-sample">
        {localization.search_hit.sample}
      </div>
    );
  }
  return null;
};

export const SearchHitItem = props => {
  const { referenceData, dataset } = props;
  const { id, catalog, publisher, theme, provenance, accessRights } =
    dataset || {};
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

  return (
    <article>
      <article
        className="fdk-a-search-hitx search-hit"
        title={`${localization.result.dataset}: ${title}`}
      >
        <span className="uu-invisible" aria-hidden="false">
          Søketreff.
        </span>

        <header>
          <SearchHitHeader
            tag="h2"
            title={title}
            titleLink={link}
            catalog={catalog}
            publisherLabel={localization.search_hit.owned}
            publisher={publisher}
            theme={theme}
            nationalComponent={_.get(provenance, 'code') === 'NASJONAL'}
            referenceData={referenceData}
            darkThemeBackground={false}
          />
        </header>
        <p className="fdk-text-size-medium">
          <span className="uu-invisible" aria-hidden="false">
            Beskrivelse av datasettet,
          </span>
          {description}
        </p>

        {renderAccessRights(accessRights)}

        {renderFormats(dataset, referenceData)}

        {renderSample(dataset)}
      </article>
    </article>
  );
};

SearchHitItem.defaultProps = {
  dataset: null,
  referenceData: null
};

SearchHitItem.propTypes = {
  dataset: PropTypes.object,
  referenceData: PropTypes.object
};
