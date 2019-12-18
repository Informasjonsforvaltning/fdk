import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import includes from 'lodash/includes';
import { Field } from 'redux-form';
import Autocomplete from 'react-autocomplete';
import cx from 'classnames';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import { FieldTreeLos } from './field-tree-los/field-tree-los.component';
import { FilterPillsLos } from './filter-pills-los/filter-pills-los.component';
import { getLosItemParentsAndChildren } from '../../../redux/modules/referenceData';
import {
  matchInputStateToLosTerm,
  onClearSearchInput,
  onChangeSearchInput,
  onSelectSearchedLosItem
} from './autocomplete-helper';
import './form-los.scss';
import { isNapPublish, isNapUnPublishTheme } from '../../../lib/napPublish';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';
import { losValues } from '../dataset-registration-page.logic';

export const FormLOSPure = ({
  losItems,
  filterText,
  searchedItem,
  handleSetFilterText,
  handleSetSearchedItem,
  datasetItem,
  datasetFormStatus,
  isReadOnly,
  themes
}) => {
  const losItemsToShow = _.uniqBy(
    getLosItemParentsAndChildren(losItems, searchedItem),
    item => item.uri
  );

  if (losItemsToShow) {
    return (
      <div className="form-group">
        <Helptext
          title={localization.schema.los.helptext.title}
          term="themesLos"
          required
        />

        {!isReadOnly && (
          <>
            <Autocomplete
              wrapperProps={{ style: { width: '100%' } }}
              getItemValue={item => item.name.nb}
              items={losItems}
              renderInput={props => (
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    {...props}
                    placeholder={localization.schema.los.losSearchPlaceholder}
                  />
                  <span className="input-group-btn input-group-append">
                    <button
                      type="button"
                      className="btn btn-default input-group-text"
                      onClick={() =>
                        onClearSearchInput(
                          handleSetFilterText,
                          handleSetSearchedItem
                        )
                      }
                    >
                      <i className="fa fa-times-circle" />
                    </button>
                  </span>
                </div>
              )}
              renderItem={(item, isHighlighted) => {
                const itemClass = cx('px-2', {
                  'fdk-bg-color-neutral-lightest': isHighlighted
                });
                return (
                  <div key={item.uri} className={itemClass}>
                    {item.name.nb} [
                    {item.isTema ? localization.category : localization.topic}]
                  </div>
                );
              }}
              renderMenu={(items, value, style) => (
                <div className="fdk-autocomplete-menu" style={{ ...style }}>
                  {items.slice(0, 50)}
                </div>
              )}
              value={filterText}
              onChange={e =>
                onChangeSearchInput(
                  e,
                  handleSetFilterText,
                  handleSetSearchedItem
                )
              }
              onSelect={(val, item) =>
                onSelectSearchedLosItem(
                  val,
                  item,
                  handleSetFilterText,
                  handleSetSearchedItem
                )
              }
              menuStyle={{ zIndex: '1000' }}
              shouldItemRender={matchInputStateToLosTerm}
            />

            <form>
              <Field
                name="theme"
                component={FilterPillsLos}
                losItems={losItems}
              />
              <Field
                name="theme"
                component={FieldTreeLos}
                losItems={losItemsToShow}
                defaultOpenTree={typeof searchedItem !== 'undefined'}
                defaultShowTopic={
                  searchedItem && !_.get(searchedItem, 'isTema')
                    ? searchedItem
                    : null
                }
              />
            </form>
          </>
        )}

        {isReadOnly && (
          <div className="pl-3">{losValues(themes.values, losItems)}</div>
        )}

        {datasetFormStatus &&
          includes(datasetFormStatus.lastChangedFields, 'theme') &&
          isNapPublish(losItems, datasetItem) && (
            <AlertMessage type="info">
              <span>{localization.formStatus.napPublish}</span>
            </AlertMessage>
          )}

        {datasetFormStatus &&
          includes(datasetFormStatus.lastChangedFields, 'theme') &&
          isNapUnPublishTheme(losItems, datasetItem) && (
            <AlertMessage type="info">
              <span>{localization.formStatus.napUnPublish}</span>
            </AlertMessage>
          )}
      </div>
    );
  }
  return null;
};

FormLOSPure.defaultProps = {
  losItems: null,
  filterText: '',
  searchedItem: undefined,
  handleSetFilterText: _.noop,
  handleSetSearchedItem: _.noop,
  datasetItem: null,
  datasetFormStatus: null,
  isReadOnly: false,
  themes: null
};

FormLOSPure.propTypes = {
  losItems: PropTypes.array,
  filterText: PropTypes.string,
  searchedItem: PropTypes.object,
  handleSetFilterText: PropTypes.func,
  handleSetSearchedItem: PropTypes.func,
  datasetItem: PropTypes.object,
  datasetFormStatus: PropTypes.object,
  isReadOnly: PropTypes.bool,
  themes: PropTypes.object
};

const enhance = compose(
  withState('filterText', 'setFilterText', ''),
  withState('searchedItem', 'setSearchedItem', undefined),
  withHandlers({
    handleSetFilterText: props => value => {
      props.setFilterText(value);
    },
    handleSetSearchedItem: props => item => {
      props.setSearchedItem(item);
    }
  })
);

export const FormLOSWithState = enhance(FormLOSPure);
export const FormLOS = FormLOSWithState;
