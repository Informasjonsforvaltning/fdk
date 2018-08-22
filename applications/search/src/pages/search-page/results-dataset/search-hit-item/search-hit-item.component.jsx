import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { DistributionFormat } from '../../../../components/distribution-format/distribution-format.component';
import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import { getDistributionTypeByUri } from '../../../../redux/modules/distributionType';
import { DatasetLabelNational } from '../../../../components/dataset-label-national/dataset-label-national.component';
import { PublisherLabel } from '../../../../components/publisher-label/publisher-label.component';
import './search-hit-item.scss';

const renderFormats = (source, code, distributionTypeItems) => {
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
          const distributionType = getDistributionTypeByUri(
            distributionTypeItems,
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

const renderPublisher = source => {
  const { publisher } = source;
  if (!publisher) {
    return null;
  }
  return (
    <PublisherLabel
      label={localization.search_hit.owned}
      publisherItem={publisher}
    />
  );
};

const renderThemes = source => {
  let themeNodes;
  const { theme } = source;
  if (theme) {
    themeNodes = theme.map((singleTheme, index) => (
      <div
        key={`dataset-description-theme-${index}`}
        className="fdk-label mr-2 mb-2"
      >
        <span className="uu-invisible" aria-hidden="false">
          Datasettets tema.
        </span>
        {getTranslateText(singleTheme.title)}
      </div>
    ));
  }
  return themeNodes;
};

const renderSample = source => {
  const { sample } = source;
  if (sample) {
    if (sample.length > 0) {
      return <div id="search-hit-sample">{localization.search_hit.sample}</div>;
    }
  }
  return null;
};

export const SearchHitItem = props => {
  const { distributionTypeItems } = props;
  const { _source } = props.result;

  const hitId = encodeURIComponent(_source.id);
  let { title, description, objective } = _source;
  const { provenance } = _source;
  if (title) {
    title = getTranslateText(_source.title);
  }
  if (description) {
    description = getTranslateText(_source.description);
  }
  if (objective) {
    objective = getTranslateText(_source.objective);
  }

  if (description && description.length > 220) {
    description = `${description.substr(0, 220)}...`;
  } else if (description && description.length < 150 && objective) {
    const freeLength = 200 - description.length;
    const objectiveLength = objective.length;
    description = `${description} ${objective.substr(0, 200 - freeLength)} ${
      objectiveLength > freeLength ? '...' : ''
    }`;
  }
  const link = `/datasets/${hitId}`;

  let accessRightsLabel;
  let distributionNonPublic = false;
  let distributionRestricted = false;
  let distributionPublic = false;

  let authorityCode = '';
  if (_source.accessRights && _source.accessRights.code) {
    authorityCode = _source.accessRights.code;
  }

  if (_source.accessRights && authorityCode === 'NON_PUBLIC') {
    distributionNonPublic = true;
    accessRightsLabel =
      localization.dataset.accessRights.authorityCode.nonPublic;
  } else if (_source.accessRights && authorityCode === 'RESTRICTED') {
    distributionRestricted = true;
    accessRightsLabel =
      localization.dataset.accessRights.authorityCode.restricted;
  } else if (_source.accessRights && authorityCode === 'PUBLIC') {
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
          <h2>{title}</h2>
          <div className="fdk-dataset-themes">
            {renderPublisher(_source)}
            {renderThemes(_source)}
            {provenance &&
              provenance.code === 'NASJONAL' && <DatasetLabelNational />}
          </div>
          <p className="fdk-p-search-hit">
            <span className="uu-invisible" aria-hidden="false">
              Beskrivelse av datasettet,
            </span>
            {description}
          </p>
          <div className={distributionClass}>
            <strong>{accessRightsLabel}</strong>
            {renderFormats(_source, authorityCode, distributionTypeItems)}
            {renderSample(_source)}
          </div>
        </div>
      </Link>
    </article>
  );
};

SearchHitItem.defaultProps = {
  result: null,
  distributionTypeItems: null
};

SearchHitItem.propTypes = {
  result: PropTypes.shape({}),
  distributionTypeItems: PropTypes.array
};
