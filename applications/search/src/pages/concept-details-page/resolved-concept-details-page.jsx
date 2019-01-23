import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ConceptDetailsPage } from './concept-details-page';
import { getConcept } from '../../api/concepts';

const memoizedGetConcept = _.memoize(getConcept);

const mapProps = {
  conceptItem: props => memoizedGetConcept(props.match.params.id)
};

export const ResolvedConceptDetailsPage = resolve(mapProps)(ConceptDetailsPage);
