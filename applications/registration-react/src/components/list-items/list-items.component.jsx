import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import localization from '../../utils/localization';
import SortButtons from '../sort-button/sort-button.component';
import { ListItem } from './list-item/list-item.component';

const renderDatasetItems = (catalogId, items, sortField, sortType) => {
  if (items) {
    let sortedItems = items;
    if (sortField === 'title') {
      // order by title and ignore case
      sortedItems = orderBy(
        items,
        [
          item => {
            const { nb } = item.title;
            if (nb) {
              return nb.toLowerCase();
            }
            return null;
          }
        ],
        [sortType]
      );
    } else if (sortField === 'registrationStatus') {
      sortedItems = orderBy(items, 'registrationStatus', [sortType]);
    }

    return sortedItems.map(item => (
      <ListItem key={item.id} catalogId={catalogId} item={item} />
    ));
  }
  return (
    <div className="fdk-datasets-list-item d-flex">
      <span className="fdk-text-size-small fdk-color2">
        {localization.datasets.list.missingItems}
      </span>
    </div>
  );
};

export const ListItems = props => {
  const { catalogId, items, sortField, sortType, onSortField } = props;
  return (
    <div>
      <div className="fdk-datasets-list-header d-flex">
        <div className="d-flex align-items-center w-75">
          <span className="header-item mr-1">
            {localization.datasets.list.header.title}
          </span>
          <SortButtons
            field="title"
            sortField={sortField}
            sortType={sortType}
            onSortField={onSortField}
          />
        </div>

        <div className="d-flex align-items-center w-25">
          <span className="header-item mr-1">
            {localization.datasets.list.header.status}
          </span>
          <SortButtons
            field="registrationStatus"
            sortField={sortField}
            sortType={sortType}
            onSortField={onSortField}
          />
        </div>
      </div>
      {renderDatasetItems(catalogId, items)}
    </div>
  );
};

ListItems.defaultProps = {
  catalogId: null,
  items: null,

  sortField: null,
  sortType: null,
  onSortField: null
};

ListItems.propTypes = {
  catalogId: PropTypes.string.isRequired,
  items: PropTypes.array,
  sortField: PropTypes.string,
  sortType: PropTypes.string,
  onSortField: PropTypes.func
};
