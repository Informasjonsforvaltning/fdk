import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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

export const SearchHitItem = props => {
  const { _source } = props.result;
  const hitId = encodeURIComponent(_source.id);
  const { title } = _source.info;
  let { description } = _source.info;
  if (description && description.length > 220) {
    description = `${description.substr(0, 220)}...`;
  }
  const link = `/apis/${hitId}`;

  return (
    <section className="search-hit">
      <span className="uu-invisible" aria-hidden="false">
        Søketreff.
      </span>
      <Link
        className="search-hit__title-link"
        title={`${localization.result.dataset}: ${title}`}
        to={link}
      >
        <div className="mb-4 d-flex flex-wrap align-items-baseline">
          <h2 className="mr-3">{title}</h2>
          <DatasetLabelNational />
        </div>
      </Link>
      <div className="mb-4">{renderPublisher(_source)}</div>
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
    </section>
  );
};

SearchHitItem.defaultProps = {
  result: null
};

SearchHitItem.propTypes = {
  result: PropTypes.shape({})
};
