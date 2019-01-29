import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FeatureToggle } from 'react-feature-toggles';
import cx from 'classnames';

import { addOrReplaceParamWithoutURL } from '../../../lib/addOrReplaceUrlParam';
import localization from '../../../lib/localization';
import './results-tabs.scss';
import { FEATURES } from '../../../app/features';
import {
  PATHNAME_DATASETS,
  PATHNAME_APIS,
  PATHNAME_CONCEPTS,
  PATHNAME_INFORMATIONMODELS
} from '../../../constants/constants';

export const ResultsTabs = props => {
  const {
    activePath,
    searchParam,
    countDatasets,
    countTerms,
    countApis,
    countInformationModels
  } = props;

  let search = addOrReplaceParamWithoutURL(searchParam, 'page', '');
  search = addOrReplaceParamWithoutURL(search, 'sortfield', '');
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
              to={{ pathname: PATHNAME_DATASETS, search }}
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
              to={{ pathname: PATHNAME_APIS, search }}
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
              to={{ pathname: PATHNAME_CONCEPTS, search }}
              aria-label="Link til side for begrep:"
            >
              {localization.page.termTab}
              <span>&nbsp;({countTerms})</span>
            </Link>
          </li>
          <FeatureToggle featureName={FEATURES.INFORMATIONMODEL}>
            <li
              className={cx('d-flex justify-content-center beta', {
                'li-active': activePath === PATHNAME_INFORMATIONMODELS
              })}
            >
              <Link
                to={{ pathname: PATHNAME_INFORMATIONMODELS, search }}
                aria-label="Link til side for informasjonsmodell:"
              >
                {localization.page.informationModelTab}
                <span>&nbsp;({countInformationModels})</span>
              </Link>
            </li>
          </FeatureToggle>
        </ul>
      </div>
    </div>
  );
};

ResultsTabs.defaultProps = {
  activePath: null,
  searchParam: '',
  countDatasets: null,
  countTerms: null,
  countApis: null,
  countInformationModels: null
};

ResultsTabs.propTypes = {
  activePath: PropTypes.string,
  searchParam: PropTypes.string,
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  countInformationModels: PropTypes.number
};
