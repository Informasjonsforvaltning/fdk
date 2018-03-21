import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

import localization from '../localization'
import FilterOption from '../search-results-filterbox-option';
import './index.scss';

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }



  _renderOptions({ buckets }, onClick, activeFilter) {
    const { open } = this.state;
    const { themesItems } = this.props;
    let filters;
    if (activeFilter) {
      filters = activeFilter.split(',');
    }
    const options = (items) => items.map((item, index) => {
      let active = false;
      if (filters && filters.includes(item.key)) {
        active = true;
      }
      return (
        <FilterOption
          key={index}
          itemKey={index}
          value={item.key}
          label={item.key}
          count={item.doc_count}
          onClick={onClick}
          active={active}
          themesItems={themesItems}
        />
      );
    });

    if (buckets) {
      const bucketsLength = buckets.length;
      return (
        <div>
          { options(buckets.slice(0,5))}
          {bucketsLength > 4 &&
          <div>
            <Collapse in={open}>
              <div>
                { options(buckets.slice(5)) }
              </div>
            </Collapse>
            <button onClick={this.toggle}>{open ? localization.facet.showfewer :localization.facet.showmore}</button>
          </div>
          }
        </div>
      )
    } return null;
  };

  render() {
    const {title, filter, onClick, activeFilter} = this.props;
    return (
      <div className="fdk-panel--filter">
        <div className="fdk-panel__header">{title}</div>
        <div className="fdk-panel__content">
          <div className="fdk-items-list">
            {this._renderOptions(filter, onClick, activeFilter)}
          </div>
        </div>
      </div>
    );
  }
}

FilterBox.defaultProps = {
  title: null,
  activeFilter: null,
  themesItems: null
};

FilterBox.propTypes = {
  title: PropTypes.string,
  filter: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  activeFilter: PropTypes.string,
  themesItems: PropTypes.object
};

export default FilterBox;
