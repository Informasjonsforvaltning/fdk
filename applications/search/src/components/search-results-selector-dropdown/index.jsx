import * as React from 'react';
import { map } from 'lodash';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import localization from '../localization';

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: `${localization.sort.by} ${localization.sort['by.relevance'].toLowerCase()}`,
      setItems: null
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      setItems: this.props.setItems
    });
  }

  onChange(e) {
    // const { setItems } = this.props
    const key = e.key;
    this.state.setItems([key]);
    const text = this.props.translate(e.label || e.title || e.key);
    this.setState({
      selectedValue: `${text}`
    });
  }

  getSelectedValue() {
    const { selectedItems = [] } = this.props;
    if (selectedItems.length === 0) return null;
    return selectedItems[0];
  }

  render() {
    const { mod, className, items,
      disabled, showCount, translate, countFormatter } = this.props;


    const props = this.props;
    return (
      <DropdownButton
        id="search-result-dropdown-1"
        bsStyle="default"
        className="btn btn-default dropdown-toggle fdk-button fdk-button-default"
        title={this.state.selectedValue}
        onSelect={this.onChange}
      >
        {map(items, (item, idx) => {
          const { key, label, title, disabled, doc_count } = item;
          let text = translate(label || title || key);
          if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`;
          return (
            <MenuItem key={idx} eventKey={item}>{text}</MenuItem>
          );
        })}
      </DropdownButton>

    );
  }
}
