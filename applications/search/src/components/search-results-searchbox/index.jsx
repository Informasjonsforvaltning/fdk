

const __extends = (this && this.__extends) || function(d, b) {
  for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
const React = require('react');
const PropTypes = require('prop-types');
const searchkit_1 = require('searchkit');
const defaults = require('lodash/defaults');
const throttle = require('lodash/throttle');
const assign = require('lodash/assign');
const isUndefined = require('lodash/isUndefined');

const SearchBox = (function(_super) {
  __extends(SearchBox, _super);
  function SearchBox(props) {
    const _this = _super.call(this, props) || this;
    _this.translations = SearchBox.translations;
    _this.state = {
      focused: false,
      input: undefined
    };
    _this.lastSearchMs = 0;
    _this.throttledSearch = throttle(() => {
      _this.searchQuery(_this.accessor.getQueryString());
    }, props.searchThrottleTime);
    return _this;
  }
  SearchBox.prototype.defineBEMBlocks = function() {
    return { container: this.props.mod };
  };
  SearchBox.prototype.defineAccessor = function() {
    const _this = this;
    const {
      id,
      prefixQueryFields,
      queryFields,
      queryBuilder,
      queryOptions,
      prefixQueryOptions
    } = this.props;
    return new searchkit_1.QueryAccessor(id, {
      prefixQueryFields,
      prefixQueryOptions: assign({}, prefixQueryOptions),
      queryFields: queryFields || ['_all'],
      queryOptions: assign({}, queryOptions),
      queryBuilder,
      onQueryStateChange() {
        if (!_this.unmounted && _this.state.input) {
          _this.setState({ input: undefined });
        }
      }
    });
  };
  SearchBox.prototype.onSubmit = function(event) {
    event.preventDefault();
    this.searchQuery(this.getValue());
  };
  SearchBox.prototype.searchQuery = function(query) {
    const shouldResetOtherState = false;
    this.accessor.setQueryString(query, shouldResetOtherState);
    const now = +new Date();
    const newSearch = now - this.lastSearchMs <= 2000;
    this.lastSearchMs = now;
    this.searchkit.performSearch(newSearch);
  };
  SearchBox.prototype.getValue = function() {
    const input = this.state.input;
    if (isUndefined(input)) {
      return this.getAccessorValue();
    }

    return input;
  };
  SearchBox.prototype.getAccessorValue = function() {
    return `${this.accessor.state.getValue() || ''}`;
  };
  SearchBox.prototype.onChange = function(e) {
    const query = e.target.value;
    if (this.props.searchOnChange) {
      this.accessor.setQueryString(query);
      this.throttledSearch();
      this.forceUpdate();
    } else {
      this.setState({ input: query });
    }
  };
  SearchBox.prototype.setFocusState = function(focused) {
    if (!focused) {
      const input = this.state.input;
      if (this.props.blurAction === 'search'
                && !isUndefined(input)
                && input !== this.getAccessorValue()) {
        this.searchQuery(input);
      }
      this.setState({
        focused,
        input: undefined
      });
    } else {
      this.setState({ focused });
    }
  };
  SearchBox.prototype.render = function() {
    const block = this.bemBlocks.container;
    return (
      <div className={block().state({ focused: this.state.focused })}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <span className="glyphicon-search-frontpage glyphicon glyphicon-search" />
          <input
            type="search"
            data-qa="query"
            className={`${block('text')} fdk-search`}
            placeholder={this.props.placeholder || this.translate('searchbox.placeholder')}
            value={this.getValue()}
            onFocus={this.setFocusState.bind(this, true)}
            onBlur={this.setFocusState.bind(this, false)}
            ref="queryField"
            autoFocus={this.props.autofocus}
            onInput={this.onChange.bind(this)}
            aria-label='Skriv tekst for søk'
          />
          <div data-qa="loader" className={block('loader').mix('sk-spinning-loader').state({ hidden: !this.isLoading() })} />
        </form>
      </div>
    );
  };
  return SearchBox;
}(searchkit_1.SearchkitComponent));
SearchBox.translations = {
  'searchbox.placeholder': 'Search'
};
SearchBox.defaultProps = {
  id: 'q',
  mod: 'sk-search-box',
  searchThrottleTime: 200,
  blurAction: 'search'
};
SearchBox.propTypes = defaults({
  id: PropTypes.string,
  searchOnChange: PropTypes.bool,
  searchThrottleTime: PropTypes.number,
  queryBuilder: PropTypes.func,
  queryFields: PropTypes.arrayOf(PropTypes.string),
  autofocus: PropTypes.bool,
  queryOptions: PropTypes.object,
  prefixQueryFields: PropTypes.arrayOf(PropTypes.string),
  prefixQueryOptions: PropTypes.object,
  translations: searchkit_1.SearchkitComponent.translationsPropType(SearchBox.translations),
  mod: PropTypes.string,
  placeholder: PropTypes.string,
  blurAction: PropTypes.string
}, searchkit_1.SearchkitComponent.propTypes);
exports.SearchBox = SearchBox;
