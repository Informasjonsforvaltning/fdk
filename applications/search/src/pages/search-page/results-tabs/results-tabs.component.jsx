import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withRouter } from 'react-router';

import localization from '../../../lib/localization';
import './results-tabs.scss';
import {
  PATHNAME_DATASETS,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  PATHNAME_INFORMATIONMODELS
} from '../../../constants/constants';
import { getLinkForTab } from '../search-location-helper';

export const ResultsTabsPure = ({
  countDatasets,
  countTerms,
  countApis,
  countInformationModels,
  location
}) => {
  const activePath = location.pathname;
  return (
    <div className="row">
      <div className="col-12">
        <ul className="search-results-tabs d-flex align-items-center justify-content-center flex-wrap">
          <li
            className={cx('d-flex justify-content-center', {
              'li-active': activePath === PATHNAME_DATASETS
            })}
          >
            <Link
              to={getLinkForTab(location, PATHNAME_DATASETS)}
              aria-label="Link til side for datasett:"
            >
              {localization.page.datasetTab}
              <span>&nbsp;({countDatasets})</span>
            </Link>
          </li>
          <li
            className={cx('d-flex justify-content-center beta', {
              'li-active': activePath === PATHNAME_APIS
            })}
          >
            <Link
              to={getLinkForTab(location, PATHNAME_APIS)}
              aria-label="Link til side for api:"
            >
              {localization.page.apiTab}
              <span>&nbsp;({countApis})</span>
            </Link>
          </li>
          <li
            className={cx('d-flex justify-content-center', {
              'li-active': activePath === PATHNAME_CONCEPTS
            })}
          >
            <Link
              to={getLinkForTab(location, PATHNAME_CONCEPTS)}
              aria-label="Link til side for begrep:"
            >
              {localization.page.termTab}
              <span>&nbsp;({countTerms})</span>
            </Link>
          </li>
          <li
            className={cx('d-flex justify-content-center beta', {
              'li-active': activePath === PATHNAME_INFORMATIONMODELS
            })}
          >
            <Link
              to={getLinkForTab(location, PATHNAME_INFORMATIONMODELS)}
              aria-label="Link til side for informasjonsmodell:"
            >
              {localization.page.informationModelTab}
              <span>&nbsp;({countInformationModels})</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

ResultsTabsPure.defaultProps = {
  countDatasets: null,
  countTerms: null,
  countApis: null,
  countInformationModels: null,

  location: { search: '' }
};

ResultsTabsPure.propTypes = {
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  countInformationModels: PropTypes.number,

  location: PropTypes.object
};

export const ResultsTabs = withRouter(ResultsTabsPure);
