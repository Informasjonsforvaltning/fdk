import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { addOrReplaceParamWithoutURL } from '../../utils/addOrReplaceUrlParam';
import localization from '../../components/localization';
import './index.scss';

const ResultsTabs = props => {
  const { location, countDatasets, countTerms } = props;
  let { search } = location;
  search = addOrReplaceParamWithoutURL(search, 'from', '');
  return (
    <div className="row">
      <div className="col-sm-12 col-md-8 col-md-offset-4">
        <ul className="search-results-tabs">
          <li className={location.pathname === '/' ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/', search }}
              aria-label="Link til side for datasett:"
            >
              {localization.page.datasetTab}
              <span>&nbsp;({countDatasets})</span>
            </Link>
          </li>
          <li className={location.pathname === '/concepts' ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/concepts', search }}
              aria-label="Link til side for begrep:"
            >
              {localization.page.termTab}
              <span>&nbsp;({countTerms})</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

ResultsTabs.defaultProps = {
  countDatasets: null,
  countTerms: null
};

ResultsTabs.propTypes = {
  location: PropTypes.object.isRequired,
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number
};

export default ResultsTabs;
