import React from 'react';
import PropTypes from 'prop-types';
import { withState, withHandlers, compose } from 'recompose';
import _ from 'lodash';

import { getParamFromUrl } from '../../../lib/addOrReplaceUrlParam';
import localization from '../../../lib/localization';
import { HitsStats } from './hits-stats/hits-stats.component';
import './search-box.scss';

export const SearchBoxPure = props => {
  const {
    onSearchSubmit,
    countDatasets,
    countTerms,
    countApis,
    countInformationModels,
    open,
    searchText,
    inputText,
    setInputText,
    clearInputTextHandler,
    touched
  } = props;
  let refSearchBox; // eslint-disable-line no-unused-vars
  return (
    <div className="container pt-5 pb-5">
      <div className="col-12 col-lg-10 offset-lg-1 fdk-search-flex d-flex">
        <div className="d-inline d-lg-none">
          <button
            type="button"
            className="fdk-button fdk-button-filter"
            onClick={open}
          >
            Filter
          </button>
        </div>
        <div className="fdk-search-box flex-grow-1">
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
                value={touched ? inputText : searchText}
                onChange={e => setInputText(e)}
                autoComplete="off"
              />
              <div
                role="button"
                tabIndex="0"
                className="clear-icon"
                aria-label={localization.query.reset}
                onClick={e => {
                  clearInputTextHandler(e);
                }}
                onKeyDown={() => {}}
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
        <HitsStats
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

SearchBoxPure.defaultProps = {
  searchText: null,
  countDatasets: null,
  countTerms: null,
  countApis: null,
  countInformationModels: null,
  inputText: null,
  setInputText: _.noop,
  clearInputTextHandler: _.noop,
  touched: false
};

SearchBoxPure.propTypes = {
  onSearchSubmit: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  countDatasets: PropTypes.number,
  countTerms: PropTypes.number,
  countApis: PropTypes.number,
  countInformationModels: PropTypes.number,
  open: PropTypes.func.isRequired,
  inputText: PropTypes.string,
  setInputText: PropTypes.func,
  clearInputTextHandler: PropTypes.func,
  touched: PropTypes.bool
};

const enhance = compose(
  withState('inputText', 'setInputText', ''),
  withState('touched', 'setTouched', false),
  withHandlers({
    setInputText: props => event => {
      event.preventDefault();
      props.setTouched(true);
      props.setInputText(event.target.value);
    },
    clearInputTextHandler: props => event => {
      event.preventDefault();
      props.setTouched(false);
      props.setInputText('');
      props.onSearchSubmit('');
    }
  })
);

export const SearchBoxWithState = enhance(SearchBoxPure);
export const SearchBox = SearchBoxWithState;
