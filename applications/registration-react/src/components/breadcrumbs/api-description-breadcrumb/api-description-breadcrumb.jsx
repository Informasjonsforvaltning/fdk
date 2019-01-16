import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getApiItemsByApiId } from '../../../redux/modules/apis';

export const PureapiDescriptionBreadcrumb = props => {
  const { apiDescriptionItem } = props;
  return (
    <span>
      {_.get(apiDescriptionItem, ['apiSpecification', 'info', 'title'])}
    </span>
  );
};

const mapStateToProps = ({ apis }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const apiId = _.get(ownProps, ['match', 'params', 'id']);
  return {
    apiDescriptionItem: getApiItemsByApiId(apis, catalogId, apiId)
  };
};

PureapiDescriptionBreadcrumb.defaultProps = {
  apiDescriptionItem: null
};

PureapiDescriptionBreadcrumb.propTypes = {
  apiDescriptionItem: PropTypes.object
};

export const ApiDescriptionBreadcrumb = connect(mapStateToProps)(
  PureapiDescriptionBreadcrumb
);
