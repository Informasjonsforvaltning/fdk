import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ConceptDetailsPage } from './concept-details-page';
import { getConcept } from '../../api/concepts';
import { datasetsSearch, extractDatasets } from '../../api/datasets';

const getDatasetsForConcept = id => {
  const subject = `https://fellesdatakatalog.brreg.no/api/concepts/${id}`;
  const returnfields = 'id,uri,title';
  return datasetsSearch({ subject, returnfields }).then(extractDatasets);
};

const memoizedGetConcept = _.memoize(getConcept);
const memoizedGetDatasets = _.memoize(getDatasetsForConcept);

const mapProps = {
  conceptItem: props => memoizedGetConcept(props.match.params.id),
  conceptDatasetReferences: props => memoizedGetDatasets(props.match.params.id)
};

export const ResolvedConceptDetailsPage = resolve(mapProps)(ConceptDetailsPage);
