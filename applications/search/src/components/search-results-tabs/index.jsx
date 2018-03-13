import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getLanguageFromUrl } from '../../utils/translateText';
import localization from '../../components/localization';
import './index.scss';

const ResultsTabs  = (props) => {
  const { onSelectView, isSelected, location } = props;
  const langCode = getLanguageFromUrl();
  const langParam = langCode ? `?lang=${langCode}` : '';
  return (
    <div className="row">
      <div className="col-md-12 text-center">
        <ul className="search-results-tabs">
          <li className={(location.pathname === '/') ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/', search: langParam}}
              aria-label="Link til side for datasett:"
            >{localization.page.datasetTab}
            </Link>
          </li>
          <li className={(location.pathname === '/concepts') ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/concepts', search: location.search}}
              aria-label="Link til side for begrep:"
            >{localization.page.termTab}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

ResultsTabs.defaultProps = {
  isSelected: false
};

ResultsTabs.propTypes = {
  onSelectView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

export default ResultsTabs;
