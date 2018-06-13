import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import localization from '../../../../lib/localization';

export class Select extends React.Component {
  constructor(props) {
    super(props);
    const { activeSort } = this.props;
    this.state = {
      selectedValue: activeSort
        ? activeSort.substring(0, activeSort.lastIndexOf('.'))
        : 'relevance'
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onChange } = this.props;
    onChange(e);
    this.setState({
      selectedValue: e.label
    });
  }

  render() {
    const { items } = this.props;
    return (
      <DropdownButton
        bsStyle="default"
        id="search-result-dropdown-1"
        className="fdk-button fdk-button-default"
        title={`${localization.sort.by} ${localization.sort[
          this.state.selectedValue
        ]}`}
        onSelect={this.onChange}
        aria-label={`Sorter søkeresultat, ${localization.sort.by} ${localization
          .sort[this.state.selectedValue]}`}
      >
        {map(items, (item, idx) => {
          const { label } = item;
          const text = `${localization.sort.by} ${localization.sort[label]}`;
          return (
            <MenuItem key={idx} eventKey={item}>
              {text}
            </MenuItem>
          );
        })}
      </DropdownButton>
    );
  }
}

Select.defaultProps = {
  items: null,
  activeSort: null
};

Select.propTypes = {
  items: PropTypes.array,
  activeSort: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
