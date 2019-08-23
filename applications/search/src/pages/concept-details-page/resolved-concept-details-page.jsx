import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ConceptDetailsPage } from './concept-details-page';
import { getConcept, getDatasets } from '../../api/concepts';

const memoizedGetConcept = _.memoize(getConcept);
const memoizedGetDatasets = _.memoize(getDatasets);

const mapProps = {
  conceptItem: props => memoizedGetConcept(props.match.params.id),
  conceptDatasetReferences: props => memoizedGetDatasets(props.match.params.id)
};

export const ResolvedConceptDetailsPage = resolve(mapProps)(ConceptDetailsPage);
