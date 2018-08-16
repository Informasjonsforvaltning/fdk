import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FeatureToggle } from 'react-feature-toggles';

import { addOrReplaceParamWithoutURL } from '../../../lib/addOrReplaceUrlParam';
import localization from '../../../lib/localization';
import './results-tabs.scss';
import { FEATURES } from '../../../app/features';

export const ResultsTabs = props => {
  const { location, countDatasets, countTerms } = props;
  let { search } = location;
  search = addOrReplaceParamWithoutURL(search, 'from', '');
  return (
    <div className="row">
      <div className="col-12 col-lg-8 offset-lg-4">
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
          <FeatureToggle featureName={FEATURES.API}>
            <li className={location.pathname === '/apis' ? 'li-active' : ''}>
              <Link
                to={{ pathname: '/apis', search }}
                aria-label="Link til side for api:"
              >
                {localization.page.apiTab}
                <span>&nbsp;(beta)</span>
              </Link>
            </li>
          </FeatureToggle>
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
