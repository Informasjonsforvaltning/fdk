var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "react", "lodash", "qs"], function (require, exports, React,lodash_1, qs) {
    "use strict";
    var block = require("bem-cn");
    var Select = (function (_super) {
        __extends(Select, _super);
        function Select(props) {
            var _this = _super.call(this, props) || this;
            _this.onClick = _this.onClick.bind(_this);
            return _this;
        }
        Select.prototype.onClick = function (e) {
            e.preventDefault();
            var setItems = this.props.setItems;
            var key = e.target.getAttribute('data-value');
            setItems(['aa']); // this might remove the item instead of adding it (searchkit bug in toggleItem here: /components/search/sorting-selector/src/SortingSelector.tsx)
            setItems([key]); // whether added or removed in the previous step, we still add it, just to be sure
            setItems([key]); // whether added or removed in the previous step, we still add it, just to be sure
        };
        Select.prototype.getSelectedValue = function () {
            var _a = this.props.selectedItems, selectedItems = _a === void 0 ? [] : _a;
            if (selectedItems.length == 0)
                return null;
            return selectedItems[0];
        };
        Select.prototype.render = function () {
            var _a = this.props, mod = _a.mod, className = _a.className, items = _a.items, disabled = _a.disabled, showCount = _a.showCount, translate = _a.translate, countFormatter = _a.countFormatter;
            var bemBlocks = {
                container: block(mod)
            };
        	  let queryObj = qs.parse(window.location.search.substr(1));
            let perPage = '';
            if(queryObj.lang == 'nb' || !queryObj.lang) {
              perPage = 'per side';
            } else if(queryObj.lang == 'nn') {
              perPage = 'per side';
            } else {
              perPage = 'per page';
            }
            if(!queryObj['sort']) queryObj['sort'] = '_score_asc';
            let selectedValue = parseInt(this.getSelectedValue()) >= 0 ? this.getSelectedValue() : queryObj['sort'];
            let selectedLabel = '';
            this.props.items.forEach((item) => {
              if(item.key === selectedValue) {
                selectedLabel = item.label;
              }
            })
            return ( // Will sho "per side" if the text values are parsed to integers.
             <div className="dropdown">
                  <a href="#" className="btn btn-default dropdown-toggle fdk-dropdown-toggle-language" data-toggle="dropdown">{parseInt(selectedLabel) >= 0 ? selectedLabel + ' ' + perPage : selectedLabel} <b className="caret"></b></a>
                  <ul className="dropdown-menu">
                    {lodash_1.map(items, ({key, label, title, disabled, doc_count}, idx) => {
                      var text = translate(label || title || key)
                      if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`
                      return <li key={key}><a data-value={key} onClick={this.onClick} href="#">{parseInt(text) >= 0 ? text + ' ' + perPage : text}</a></li>
                    })}
                  </ul>
              </div>);
        };
        return Select;
    }(React.Component));
    Select.defaultProps = {
        mod: "sk-select",
        showCount: true,
        translate: lodash_1.identity,
        countFormatter: lodash_1.identity
    };
    exports.Select2 = Select;
});
