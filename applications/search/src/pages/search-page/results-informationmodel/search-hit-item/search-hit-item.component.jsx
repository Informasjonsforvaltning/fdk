import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import './search-hit-item.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';

const renderHeaderLink = (item, publisher, publishers) => {
  if (!item) {
    return null;
  }
  const { title } = item;
  const link = `/informationmodels/${encodeURIComponent(item.id)}`;

  return (
    <header>
      <SearchHitHeader
        tag="h2"
        title={getTranslateText(title)}
        titleLink={link}
        publisherLabel={`${localization.responsible}:`}
        publisher={publisher}
        publisherItems={publishers}
        nationalComponent={item.nationalComponent}
        darkThemeBackground={false}
      />
    </header>
  );
};

export const SearchHitItem = props => {
  const { item, fadeInCounter, publishers } = props;

  const searchHitClass = cx('search-hit', {
    'fade-in-200': fadeInCounter === 0,
    'fade-in-300': fadeInCounter === 1,
    'fade-in-400': fadeInCounter === 2
  });

  return (
    <article className={searchHitClass}>
      <span className="uu-invisible" aria-hidden="false">
        Søketreff.
      </span>

      {renderHeaderLink(item, _.get(item, 'publisher'), publishers)}
    </article>
  );
};

SearchHitItem.defaultProps = {
  fadeInCounter: null,
  item: null,
  publishers: null
};

SearchHitItem.propTypes = {
  fadeInCounter: PropTypes.number,
  item: PropTypes.shape({}),
  publishers: PropTypes.object
};
