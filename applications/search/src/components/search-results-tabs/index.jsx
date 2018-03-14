import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getLanguageFromUrl } from '../../utils/translateText';
import { addOrReplaceParamWithoutURL } from '../../utils/addOrReplaceUrlParam';
import localization from '../../components/localization';
import './index.scss';

const ResultsTabs  = (props) => {
  const { location, countDatasets, countTerms, selectedLanguageCode } = props;
  let { search } = location;
  if (selectedLanguageCode) {
    if (selectedLanguageCode === 'nb') {
      search = addOrReplaceParamWithoutURL(`${search}`, 'lang', '');
    } else {
      search = addOrReplaceParamWithoutURL(`${search}`, 'lang', selectedLanguageCode);
    }
  }
  search = addOrReplaceParamWithoutURL(`${search}`, 'from', '')
  return (
    <div className="row">
      <div className="col-md-12 text-center">
        <ul className="search-results-tabs">
          <li className={(location.pathname === '/') ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/', search: search}}
              aria-label="Link til side for datasett:"
            >
              {localization.page.datasetTab}
              <span>&nbsp;({countDatasets})</span>
            </Link>
          </li>
          <li className={(location.pathname === '/concepts') ? 'li-active' : ''}>
            <Link
              to={{ pathname: '/concepts', search: search}}
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
}

ResultsTabs.defaultProps = {
  isSelected: false
};

ResultsTabs.propTypes = {
  isSelected: PropTypes.bool
};

export default ResultsTabs;
