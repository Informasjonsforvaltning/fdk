import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import DistributionFormat from '../search-dataset-format';
import localization from '../../components/localization';
import {
  getTranslateText,
  getLanguageFromUrl
} from '../../utils/translateText';
import './index.scss';

const renderFormats = (source, code) => {
  const { distribution } = source;

  const children = (distributions, code) => {
    const nodes = [];
    distributions.forEach(item => {
      const { format, type } = item;
      if (format && typeof format !== 'undefined') {
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
  if (publisher && publisher.name) {
    return (
      <span>
        <span className="uu-invisible" aria-hidden="false">
          Datasettet
        </span>
        {localization.search_hit.owned}&nbsp;
        <span className="fdk-strong-virksomhet">
          {publisher && publisher.name
            ? publisher.name.charAt(0) +
              publisher.name.substring(1).toLowerCase()
            : ''}
        </span>
      </span>
    );
  }
  return null;
};

const renderThemes = (source, selectedLanguageCode) => {
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
        {getTranslateText(singleTheme.title, selectedLanguageCode)}
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

const SearchHitItem = props => {
  const { selectedLanguageCode } = props;
  const langCode = getLanguageFromUrl();
  const langParam = langCode ? `?lang=${langCode}` : '';
  const { _source } = props.result;

  // Read fields from search-hit, use correct selectedLanguageCode field if specified.
  const hitId = encodeURIComponent(_source.id);
  let { title, description, objective } = _source;
  const { provenance } = _source;
  if (title) {
    title = getTranslateText(_source.title, selectedLanguageCode);
  }
  if (description) {
    description = getTranslateText(_source.description, selectedLanguageCode);
  }
  if (objective) {
    objective = getTranslateText(_source.objective, selectedLanguageCode);
  }

  if (description && description.length > 220) {
    description = `${description.substr(0, 220)}...`;
  } else if (description && description.length < 150 && objective) {
    const freeLength = 200 - description.length;
    const objectiveLength = objective.length;
    description = `${description} ${objective.substr(
      0,
      200 - freeLength
    )} ${objectiveLength > freeLength ? '...' : ''}`;
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
    <Link
      className="fdk-a-search-hit"
      title={`${localization.result.dataset}: ${title}`}
      to={`${link}${langParam}`}
    >
      <span className="uu-invisible" aria-hidden="false">
        Søketreff.
      </span>
      <div className="fdk-container-search-hit">
        {provenance &&
          provenance.code === 'NASJONAL' && (
            <div className="fdk-label mb-1-em pull-right">
              <strong>{localization.search_hit.NationalBuildingBlock}</strong>
            </div>
          )}
        <h2>{title}</h2>
        <div className="fdk-dataset-themes">
          {renderPublisher(_source)}
          {renderThemes(_source, selectedLanguageCode)}
        </div>
        <p className="fdk-p-search-hit">
          <span className="uu-invisible" aria-hidden="false">
            Beskrivelse av datasettet,
          </span>
          {description}
        </p>
        <div className={distributionClass}>
          <strong>{accessRightsLabel}</strong>
          {renderFormats(_source, authorityCode)}
          {renderSample(_source)}
        </div>
      </div>
    </Link>
  );
};

SearchHitItem.defaultProps = {
  result: null,
  selectedLanguageCode: 'nb'
};

SearchHitItem.propTypes = {
  result: PropTypes.shape({}),
  selectedLanguageCode: PropTypes.string
};

export default SearchHitItem;
