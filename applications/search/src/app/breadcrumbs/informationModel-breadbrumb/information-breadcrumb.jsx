import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getTranslateText } from '../../../lib/translateText';
import { getInformationmodel } from '../../../api/informationmodels';

const memoizedGetInformationModel = _.memoize(getInformationmodel);

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
