import React from 'react';
import PropTypes from 'prop-types';
import { withState, withHandlers, compose } from 'recompose';
import _ from 'lodash';

import { getParamFromUrl } from '../../../lib/addOrReplaceUrlParam';
import localization from '../../../lib/localization';
import { CustomHitsStats } from './custom-hits-stats/custom-hits-stats.component';
import './search-box.scss';

export const SearchBox = props => {
  const {
    onSearchSubmit,
    countDatasets,
    countTerms,
    countApis,
    countInformationModels,
    open,
    searchQuery,
    inputText,
    setInputText,
    touched
  } = props;
  let refSearchBox; // eslint-disable-line no-unused-vars
  return (
    <div className="row pt-5 pb-5">
      <div className="col-12 col-lg-8 offset-lg-2 fdk-search-flex">
        <div className="d-inline d-lg-none">
          <button
            type="button"
            className="fdk-button fdk-button-filter"
            onClick={open}
          >
            Filter
          </button>
        </div>
        <div className="fdk-search-box">
          <form
            onSubmit={e => {
              e.preventDefault();
              onSearchSubmit(inputText);
            }}
          >
            <label htmlFor="searchBox">
              <input
                name="searchBox"
                ref={input => {
                  refSearchBox = input;
                }}
                type="search"
                placeholder={localization.query.intro}
                aria-label={localization.query.intro}
                className="fdk-search"
                value={touched ? inputText : searchQuery}
                onChange={e => setInputText(e)}
                autoComplete="off"
              />
            </label>
          </form>
        </div>
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            onSearchSubmit(inputText);
          }}
          className="fdk-button-search btn btn-lg"
        >
          <i className="fa fa-search mr-2" />
          {localization.query.do}
        </button>
      </div>
      <div className="col-md-12 text-center">
        <CustomHitsStats
          countDatasets={countDatasets}
          countTerms={countTerms}
          countApis={countApis}
          countInformationModels={countInformationModels}
          filteringOrTextSearchPerformed={
            !!(
              getParamFromUrl('q') ||
              getParamFromUrl('theme') ||
              getParamFromUrl('accessRight') ||
              getParamFromUrl('publisher')
            )
          }
        />
      </div>
    </div>
  );
};

SearchBox.defaultProps = {
  searchQuery: null,
  countDatasets: null,
  countTerms: null,
  countApis: null,
  countInformationModels: null,
  inputText: null,
  setInputText: _.noop(),
  touched: false
};

SearchBox.propTypes = {
  onSearchSubmit: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  countInformationModels: PropTypes.number,
  open: PropTypes.func.isRequired,
  inputText: PropTypes.string,
  setInputText: PropTypes.func,
  touched: PropTypes.bool
};

const enhance = compose(
  withState('inputText', 'setInputText', ''),
  withState('touched', 'setTouched', false),
  withHandlers({
    setInputText: props => event => {
      event.preventDefault();
      props.setTouched(true);
      props.setInputText(event.target.value !== '' ? event.target.value : '');
    }
  })
);

export const SearchBoxWithState = enhance(SearchBox);
