import { batch } from 'react-redux';
import _ from 'lodash';
import { fetchDatasetsIfNeeded } from '../../redux/modules/datasets';
import {
  REFERENCEDATA_PATH_FREQUENCY,
  REFERENCEDATA_PATH_LOS,
  REFERENCEDATA_PATH_OPENLICENCES,
  REFERENCEDATA_PATH_PROVENANCE,
  REFERENCEDATA_PATH_REFERENCETYPES,
  REFERENCEDATA_PATH_THEMES
} from '../../redux/modules/referenceData';
import { withDispatchOnChange } from '../../lib/redux-dispatch-on-change';

const ensureData = (dispatch, props) => {
  // dispatch actions to ensure store is populated fo render
  const { match, referenceDataApiActions } = props;
  const catalogId = _.get(match, ['params', 'catalogId']);
  batch(() => {
    dispatch(fetchDatasetsIfNeeded(catalogId));
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_PROVENANCE
      )
    );
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_FREQUENCY
      )
    );
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_THEMES
      )
    );
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_REFERENCETYPES
      )
    );
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_OPENLICENCES
      )
    );
    dispatch(
      referenceDataApiActions.fetchReferenceDataIfNeededAction(
        REFERENCEDATA_PATH_LOS
      )
    );
  });
};

export const datasetRegistrationEnsureData = withDispatchOnChange(
  ensureData,
  props => [props.match.params.id]
);
