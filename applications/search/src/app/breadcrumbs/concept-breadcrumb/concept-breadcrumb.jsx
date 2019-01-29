import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getConcept } from '../../../api/concepts';
import { getTranslateText } from '../../../lib/translateText';

const memoizedGetApi = _.memoize(getConcept);

const PureConceptBreadcrumb = props => {
  const { conceptItem } = props;
  return <span>{getTranslateText(_.get(conceptItem, 'prefLabel'))}</span>;
};

const mapProps = {
  conceptItem: props => memoizedGetApi(props.match.params.id)
};

PureConceptBreadcrumb.defaultProps = {
  conceptItem: null
};

PureConceptBreadcrumb.propTypes = {
  conceptItem: PropTypes.object
};

export const ConceptBreadcrumb = resolve(mapProps)(PureConceptBreadcrumb);
