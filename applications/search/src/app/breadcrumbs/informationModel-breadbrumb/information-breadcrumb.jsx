import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getInformationModel } from '../../../api/get-information-model';
import { getTranslateText } from '../../../lib/translateText';

const memoizedGetInformationModel = _.memoize(getInformationModel);

export const PureInformationModelBreadcrumb = props => {
  const { informationModelItem } = props;
  return <span>{getTranslateText(_.get(informationModelItem, 'title'))}</span>;
};

const mapProps = {
  informationModelItem: props =>
    memoizedGetInformationModel(props.match.params.id)
};

PureInformationModelBreadcrumb.defaultProps = {
  informationModelItem: null
};

PureInformationModelBreadcrumb.propTypes = {
  informationModelItem: PropTypes.object
};

export const InformationModelBreadcrumb = resolve(mapProps)(
  PureInformationModelBreadcrumb
);
