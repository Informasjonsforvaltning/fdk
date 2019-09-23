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
    <ul className="search-results-tabs d-flex align-items-center justify-content-center flex-wrap">
      <li
        className={cx('d-flex justify-content-center align-self-center', {
          'li-active': activePath === PATHNAME_DATASETS
        })}
      >
        <Link
          className="d-flex justify-content-center"
          to={getLinkForTab(location, PATHNAME_DATASETS)}
          aria-label="Link til side for datasett:"
        >
          <i className="mr-2 search-results-tab-dataset" />

          <div className="align-self-center">
            {localization.page.datasetTab}&nbsp;({countDatasets})
          </div>
        </Link>
      </li>
      <li
        className={cx('d-flex justify-content-center', {
          'li-active': activePath === PATHNAME_APIS
        })}
      >
        <Link
          className="d-flex justify-content-center"
          to={getLinkForTab(location, PATHNAME_APIS)}
          aria-label="Link til side for api:"
        >
          <i className="mr-2 search-results-tab-api" />

          <div className="align-self-center">
            {localization.page.apiTab}&nbsp;({countApis})
          </div>
        </Link>
      </li>
      <li
        className={cx('d-flex justify-content-center', {
          'li-active': activePath === PATHNAME_CONCEPTS
        })}
      >
        <Link
          className="d-flex justify-content-center"
          to={getLinkForTab(location, PATHNAME_CONCEPTS)}
          aria-label="Link til side for begrep:"
        >
          <i className="mr-2 search-results-tab-term" />

          <div className="align-self-center">
            {localization.page.termTab}&nbsp;({countTerms})
          </div>
        </Link>
      </li>
      <li
        className={cx('d-flex justify-content-center beta', {
          'li-active': activePath === PATHNAME_INFORMATIONMODELS
        })}
      >
        <Link
          className="d-flex justify-content-center"
          to={getLinkForTab(location, PATHNAME_INFORMATIONMODELS)}
          aria-label="Link til side for informasjonsmodell:"
        >
          <i className="mr-2 search-results-tab-infomodel" />

          <div className="align-self-center mr-4">
            {localization.page.informationModelTab}&nbsp;(
            {countInformationModels})
          </div>
        </Link>
      </li>
    </ul>
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
