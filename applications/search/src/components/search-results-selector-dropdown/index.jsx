import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import localization from '../localization';

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    // const catalogDatasetsURL = datasetURL.substring(0, datasetURL.lastIndexOf('/'));
    const { activeSort } = this.props;
    this.state = {
      selectedValue: activeSort ? activeSort.substring(0, activeSort.lastIndexOf('.')) : 'relevance'
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onChange } = this.props;
    onChange(e);
    this.setState({
      selectedValue: e.label || e.title || e.key
    });
  }

  getSelectedValue() {
    const { selectedItems = [] } = this.props;
    if (selectedItems.length === 0) return null;
    return selectedItems[0];
  }

  render() {
    const { items } = this.props; // eslint-disable-line react/prop-types

    return (
      <DropdownButton
        bsStyle="default"
        id="search-result-dropdown-1"
        className="fdk-button fdk-button-default"
        title={`${localization.sort.by} ${localization.sort[this.state.selectedValue]}`}
        onSelect={this.onChange}
        aria-label={`Sorter søkeresultat, ${localization.sort.by} ${localization.sort[this.state.selectedValue]}`}
      >
        {map(items, (item, idx) => {
          const { key, label, title } = item; // eslint-disable-line camelcase
          const text = `${localization.sort.by} ${localization.sort[label]}`;
          return (
            <MenuItem key={idx} eventKey={item}>{text}</MenuItem>
          );
        })}
      </DropdownButton>
    );
  }
}

Select.defaultProps = {
  selectedItems: null
};

Select.propTypes = {
  selectedItems: PropTypes.array
};
