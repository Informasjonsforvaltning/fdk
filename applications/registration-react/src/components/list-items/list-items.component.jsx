import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import _ from 'lodash';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../services/localization';
import SortButtons from '../sort-button/sort-button.component';
import { ListItem } from './list-item/list-item.component';
import { getTranslateText } from '../../services/translateText';
import './list-items.scss';

const renderItems = (
  catalogId,
  items,
  itemTitleField,
  sortField,
  sortType,
  prefixPath,
  defaultEmptyListText
) => {
  if (items) {
    let sortedItems = items;
    if (sortField === 'title') {
      // order by title and ignore case
      sortedItems = orderBy(
        items,
        [
          item => {
            if (_.get(item, itemTitleField)) {
              const retTitle =
                getTranslateText(_.get(item, itemTitleField)) ||
                _.get(item, itemTitleField);
              return typeof retTitle === 'string' ? retTitle.toLowerCase() : '';
            }
            return null;
          }
        ],
        [sortType]
      );
    } else if (sortField === 'registrationStatus') {
      sortedItems = orderBy(items, 'registrationStatus', [sortType]);
    } else {
      sortedItems = orderBy(items, '_lastModified', ['desc']);
    }

    return sortedItems.map(item => {
      const title =
        getTranslateText(_.get(item, itemTitleField)) ||
        _.get(item, itemTitleField);
      return (
        <ListItem
          key={item.id}
          title={typeof title === 'object' ? null : title}
          status={_.get(item, 'registrationStatus')}
          path={`${prefixPath}/${item.id}`}
        />
      );
    });
  }
  return (
    <div className="fdk-list-item d-flex">
      <span className="fdk-text-size-small fdk-color-neutral-darkest">
        {defaultEmptyListText}
      </span>
    </div>
  );
};

export const ListItemsPure = props => {
  const {
    catalogId,
    items,
    itemTitleField,
    sortField,
    sortType,
    onSortField,
    prefixPath,
    defaultEmptyListText
  } = props;
  return (
    <div>
      <div className="fdk-list-header d-flex">
        <div className="d-flex align-items-center w-75">
          <span className="header-item mr-1">{localization.title}</span>
          <SortButtons
            field="title"
            sortField={sortField}
            sortType={sortType}
            onSortField={onSortField}
          />
        </div>

        <div className="d-flex align-items-center w-25">
          <span className="header-item mr-1">
            {localization.listItems.header.status}
          </span>
          <SortButtons
            field="registrationStatus"
            sortField={sortField}
            sortType={sortType}
            onSortField={onSortField}
          />
        </div>
      </div>
      {renderItems(
        catalogId,
        items,
        itemTitleField,
        sortField,
        sortType,
        prefixPath,
        defaultEmptyListText
      )}
    </div>
  );
};

ListItemsPure.defaultProps = {
  items: null,
  itemTitleField: ['title'],
  sortField: null,
  sortType: null,
  onSortField: null,
  prefixPath: null,
  defaultEmptyListText: null
};

ListItemsPure.propTypes = {
  catalogId: PropTypes.string.isRequired,
  items: PropTypes.array,
  itemTitleField: PropTypes.array,
  sortField: PropTypes.string,
  sortType: PropTypes.string,
  onSortField: PropTypes.func,
  prefixPath: PropTypes.string,
  defaultEmptyListText: PropTypes.string
};

const enhance = compose(
  withState('sortField', 'setSortField', ''),
  withState('sortType', 'setSortType', ''),
  withHandlers({
    onSortField: props => (field, type) => {
      props.setSortField(field);
      props.setSortType(type);
    }
  })
);

export const ListItems = enhance(ListItemsPure);
