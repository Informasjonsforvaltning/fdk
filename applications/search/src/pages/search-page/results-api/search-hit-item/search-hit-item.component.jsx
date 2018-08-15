import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import localization from '../../../../lib/localization';
import { DatasetLabelNational } from '../../../../components/dataset-label-national/dataset-label-national.component';
import './search-hit-item.scss';

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
          <span className="uu-invisible" aria-hidden="false">
            Utgiver.
          </span>
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

const renderAccessRights = props => {
  // TODO check props
  return (
    <div className="mb-2">
      <strong>
        {localization.api.searchHit.accessRight.public}
      </strong>
      <i className="fa fa-info-circle ml-2 fdk-color-cta2"/>
    </div>
  )
}

const renderFormat = props => {
  // TODO check props
  return (
    <div className="mb-2">
      <strong>
        Format:&nbsp;
      </strong>
      <span>
        applicatoin/rfd+xml, JSON
      </span>
    </div>
  )
}

export const SearchHitItem = props => {
  const { result, fadeInCounter } = props;
  const hitId = encodeURIComponent(result.uri);
  const { title } = result.info;
  let { description } = result.info;
  if (description && description.length > 220) {
    description = `${description.substr(0, 220)}...`;
  }
  const link = `/apis/${hitId}`;

  const searchHitClass = cx(
    'search-hit',
    {
      'fade-in-200': fadeInCounter === 0,
      'fade-in-300': fadeInCounter === 1,
      'fade-in-400': fadeInCounter === 2,
    }
  );

  return (
    <section className={searchHitClass}>
      <span className="uu-invisible" aria-hidden="false">
        Søketreff.
      </span>
      <Link
        className="search-hit__title-link"
        title={`${localization.result.dataset}: ${title}`}
        to={link}
      >
        <div className="mb-2 d-flex flex-wrap align-items-baseline">
          <h2 className="mr-3">{title}</h2>
          <DatasetLabelNational />
        </div>
      </Link>
      <div className="mb-4">{renderPublisher(result)}</div>
      <div className="search-hit__version mb-4 p-4">
        <span>
          Denne versjonen av API-et er utgått og vil fases ut i 2019.{' '}
        </span>
        <Link to="/TODO">Versjon 2 er dokumentert her.</Link>
      </div>
      <p>
        <span className="uu-invisible" aria-hidden="false">
          Beskrivelse av datasettet,
        </span>
        {description}
      </p>
      {renderAccessRights(props)}
      {renderFormat(props)}
    </section>
  );
};

SearchHitItem.defaultProps = {
  fadeInCounter: null,
  result: null
};

SearchHitItem.propTypes = {
  fadeInCounter: PropTypes.number,
  result: PropTypes.shape({})
};
