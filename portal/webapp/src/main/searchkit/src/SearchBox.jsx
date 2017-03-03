"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var searchkit_1 = require("searchkit");
var defaults = require("lodash/defaults");
var throttle = require("lodash/throttle");
var assign = require("lodash/assign");
var isUndefined = require("lodash/isUndefined");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        var _this = _super.call(this, props) || this;
        _this.translations = SearchBox.translations;
        _this.state = {
            focused: false,
            input: undefined
        };
        _this.lastSearchMs = 0;
        _this.throttledSearch = throttle(function () {
            _this.searchQuery(_this.accessor.getQueryString());
        }, props.searchThrottleTime);
        return _this;
    }
    SearchBox.prototype.defineBEMBlocks = function () {
        return { container: this.props.mod };
    };
    SearchBox.prototype.defineAccessor = function () {
        var _this = this;
        var _a = this.props, id = _a.id, prefixQueryFields = _a.prefixQueryFields, queryFields = _a.queryFields, queryBuilder = _a.queryBuilder, searchOnChange = _a.searchOnChange, queryOptions = _a.queryOptions, prefixQueryOptions = _a.prefixQueryOptions;
        return new searchkit_1.QueryAccessor(id, {
            prefixQueryFields: prefixQueryFields,
            prefixQueryOptions: assign({}, prefixQueryOptions),
            queryFields: queryFields || ["_all"],
            queryOptions: assign({}, queryOptions),
            queryBuilder: queryBuilder,
            onQueryStateChange: function () {
                if (!_this.unmounted && _this.state.input) {
                    _this.setState({ input: undefined });
                }
            }
        });
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        this.searchQuery(this.getValue());
    };
    SearchBox.prototype.searchQuery = function (query) {
        var shouldResetOtherState = false;
        this.accessor.setQueryString(query, shouldResetOtherState);
        var now = +new Date;
        var newSearch = now - this.lastSearchMs <= 2000;
        this.lastSearchMs = now;
        this.searchkit.performSearch(newSearch);
    };
    SearchBox.prototype.getValue = function () {
        var input = this.state.input;
        if (isUndefined(input)) {
            return this.getAccessorValue();
        }
        else {
            return input;
        }
    };
    SearchBox.prototype.getAccessorValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (e) {
        var query = e.target.value;
        if (this.props.searchOnChange) {
            this.accessor.setQueryString(query);
            this.throttledSearch();
            this.forceUpdate();
        }
        else {
            this.setState({ input: query });
        }
    };
    SearchBox.prototype.setFocusState = function (focused) {
        if (!focused) {
            var input = this.state.input;
            if (this.props.blurAction == "search"
                && !isUndefined(input)
                && input != this.getAccessorValue()) {
                this.searchQuery(input);
            }
            this.setState({
                focused: focused,
                input: undefined
            });
        }
        else {
            this.setState({ focused: focused });
        }
    };
    SearchBox.prototype.render = function () {
        var block = this.bemBlocks.container;
    return (
      <div className={block().state({focused:this.state.focused})}>
        <form onSubmit={this.onSubmit.bind(this)}>


        <span id="dosearch" className="glyphicon-search-frontpage glyphicon glyphicon-search"></span>
          <input type="search"
          data-qa="query"
          className={block("text") + ' fdk-search'}
          placeholder={this.props.placeholder || this.translate("searchbox.placeholder")}
          value={this.getValue()}
          onFocus={this.setFocusState.bind(this, true)}
          onBlur={this.setFocusState.bind(this, false)}
          ref="queryField"
          autoFocus={this.props.autofocus}
          onInput={this.onChange.bind(this)}/>
          <div data-qa="loader" className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
    );

    };
    return SearchBox;
}(searchkit_1.SearchkitComponent));
SearchBox.translations = {
    "searchbox.placeholder": "Search"
};
SearchBox.defaultProps = {
    id: 'q',
    mod: 'sk-search-box',
    searchThrottleTime: 200,
    blurAction: "search"
};
SearchBox.propTypes = defaults({
    id: React.PropTypes.string,
    searchOnChange: React.PropTypes.bool,
    searchThrottleTime: React.PropTypes.number,
    queryBuilder: React.PropTypes.func,
    queryFields: React.PropTypes.arrayOf(React.PropTypes.string),
    autofocus: React.PropTypes.bool,
    queryOptions: React.PropTypes.object,
    prefixQueryFields: React.PropTypes.arrayOf(React.PropTypes.string),
    prefixQueryOptions: React.PropTypes.object,
    translations: searchkit_1.SearchkitComponent.translationsPropType(SearchBox.translations),
    mod: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    blurAction: React.PropTypes.string
}, searchkit_1.SearchkitComponent.propTypes);
exports.SearchBox = SearchBox;
