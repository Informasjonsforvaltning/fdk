import { connect } from 'react-redux';
import {
  fetchConceptsToCompareIfNeededAction,
  removeConceptAction
} from '../../redux/modules/conceptsCompare';
import { ConceptComparePage } from './concept-compare-page';

const mapStateToProps = ({ conceptsCompare }) => {
  const { items } = conceptsCompare || {
    items: {}
  };

  return {
    conceptsCompare: items
  };
};

const mapDispatchToProps = dispatch => ({
  fetchConceptsToCompareIfNeeded: iDs =>
    dispatch(fetchConceptsToCompareIfNeededAction(iDs)),
  removeConcept: uri => dispatch(removeConceptAction(uri))
});

export const ConnectedConceptComparePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConceptComparePage);
